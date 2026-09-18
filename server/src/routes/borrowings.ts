/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import {
  requireAuth,
  requireRole,
  type AuthRequest,
} from "../middleware/auth.js";
import { audit } from "../utils/audit.js";

const router = Router();
router.use(requireAuth);
const createSchema = z.object({
  itemId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  borrowedDate: z.string(),
  dueDate: z.string(),
  purpose: z.string().min(1),
});

router.get("/", async (request: AuthRequest, response, next) => {
  try {
    const isStaff =
      request.user?.role === "ADMIN" || request.user?.role === "STAFF";
    const [rows] = await pool.execute(
      "SELECT b.*, u.name AS borrower, i.name AS item_name, bi.quantity FROM borrowings b JOIN users u ON u.id=b.user_id JOIN borrowing_items bi ON bi.borrowing_id=b.id JOIN items i ON i.id=bi.item_id WHERE (? = 1 OR b.user_id = ?) ORDER BY b.created_at DESC",
      [isStaff ? 1 : 0, request.user?.id ?? 0],
    );
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});
router.post("/", async (request: AuthRequest, response, next) => {
  const connection = await pool.getConnection();
  try {
    const input = createSchema.parse(request.body);
    await connection.beginTransaction();
    const [items] = await connection.execute<any[]>(
      "SELECT * FROM items WHERE id=? FOR UPDATE",
      [input.itemId],
    );
    const item = items[0];
    if (
      !item ||
      item.available_quantity < input.quantity ||
      item.status !== "AVAILABLE"
    ) {
      await connection.rollback();
      return response
        .status(409)
        .json({ message: "อุปกรณ์มีจำนวนไม่เพียงพอหรือไม่พร้อมให้ยืม" });
    }
    const code = `BR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const [result] = await connection.execute<any>(
      "INSERT INTO borrowings (request_code, user_id, borrowed_at, due_at, purpose) VALUES (?, ?, ?, ?, ?)",
      [
        code,
        request.user?.id ?? 0,
        input.borrowedDate,
        input.dueDate,
        input.purpose,
      ],
    );
    await connection.execute(
      "INSERT INTO borrowing_items (borrowing_id, item_id, quantity) VALUES (?, ?, ?)",
      [result.insertId, input.itemId, input.quantity],
    );
    await connection.execute(
      "UPDATE items SET available_quantity=available_quantity-? WHERE id=?",
      [input.quantity, input.itemId],
    );
    await connection.commit();
    await audit(
      request.user?.id,
      "CREATE",
      "borrowings",
      result.insertId,
      null,
      { code, ...input },
    );
    return response.status(201).json({
      id: result.insertId,
      requestCode: code,
      status: "PENDING",
      ...input,
    });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
});
router.patch(
  "/:id/status",
  requireRole("ADMIN", "STAFF"),
  async (request: AuthRequest, response, next) => {
    try {
      const status = z
        .enum(["APPROVED", "REJECTED", "BORROWED", "RETURNED", "CANCELLED"])
        .parse(request.body.status);
      await pool.execute(
        "UPDATE borrowings SET status=?, approved_by=? WHERE id=?",
        [status, request.user?.id ?? 0, String(request.params.id)],
      );
      await audit(
        request.user?.id,
        "STATUS_CHANGE",
        "borrowings",
        Number(request.params.id),
        null,
        { status },
      );
      return response.json({ id: request.params.id, status });
    } catch (error) {
      return next(error);
    }
  },
);
router.patch("/:id/cancel", async (request: AuthRequest, response, next) => {
  try {
    await pool.execute(
      "UPDATE borrowings SET status='CANCELLED' WHERE id=? AND user_id=? AND status='PENDING'",
      [String(request.params.id), request.user?.id ?? 0],
    );
    await audit(
      request.user?.id,
      "CANCEL",
      "borrowings",
      Number(request.params.id),
      null,
      { status: "CANCELLED" },
    );
    return response.json({ message: "ยกเลิกคำขอแล้ว" });
  } catch (error) {
    return next(error);
  }
});
export default router;
