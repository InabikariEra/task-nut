/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import {
  requireAuth,
  requireRole,
  type AuthRequest,
} from "../middleware/auth.js";
import { audit } from "../utils/audit.js";

const router = Router();
router.use(requireAuth, requireRole("ADMIN", "STAFF"));
const schema = z.object({
  condition: z.enum(["NORMAL", "DAMAGED", "LOST"]),
  note: z.string().optional(),
  returnedAt: z.string(),
});
router.get("/", async (_request, response, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT r.*, b.request_code, u.name AS borrower FROM returns r JOIN borrowings b ON b.id=r.borrowing_id JOIN users u ON u.id=b.user_id ORDER BY r.created_at DESC",
    );
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});
router.post("/:borrowingId", async (request: AuthRequest, response, next) => {
  const connection = await pool.getConnection();
  try {
    const input = schema.parse(request.body);
    await connection.beginTransaction();
    const [borrowings] = await connection.execute<any[]>(
      "SELECT b.*, bi.item_id, bi.quantity, i.due_at FROM borrowings b JOIN borrowing_items bi ON bi.borrowing_id=b.id JOIN items i ON i.id=bi.item_id WHERE b.id=? FOR UPDATE",
      [String(request.params.borrowingId)],
    );
    const borrowing = borrowings[0];
    if (!borrowing) {
      await connection.rollback();
      return response.status(404).json({ message: "ไม่พบรายการยืม" });
    }
    await connection.execute(
      "INSERT INTO returns (borrowing_id, processed_by, condition_status, note, returned_at) VALUES (?, ?, ?, ?, ?)",
      [
        borrowing.id,
        request.user?.id ?? 0,
        input.condition,
        input.note ?? null,
        input.returnedAt,
      ],
    );
    await connection.execute(
      "UPDATE borrowings SET status='RETURNED', returned_at=? WHERE id=?",
      [input.returnedAt, borrowing.id],
    );
    const available = input.condition === "NORMAL" ? borrowing.quantity : 0;
    await connection.execute(
      "UPDATE items SET available_quantity=available_quantity+?, status=IF(available_quantity+? > 0, 'AVAILABLE', status) WHERE id=?",
      [available, available, borrowing.item_id],
    );
    const lateDays = Math.max(
      0,
      Math.ceil(
        (new Date(input.returnedAt).getTime() -
          new Date(borrowing.due_at).getTime()) /
          86400000,
      ),
    );
    if (lateDays > 0)
      await connection.execute(
        "INSERT INTO fines (borrowing_id, user_id, late_days, amount) VALUES (?, ?, ?, ?)",
        [borrowing.id, borrowing.user_id, lateDays, lateDays * env.finePerDay],
      );
    await connection.commit();
    await audit(
      request.user?.id,
      "RETURN",
      "borrowings",
      borrowing.id,
      null,
      input,
    );
    return response.status(201).json({ message: "รับคืนสำเร็จ", lateDays });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
});
export default router;
