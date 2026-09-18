/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { pool } from "../config/db.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();
router.get("/items", async (_request, response, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT i.id, i.code, i.name, i.item_type AS itemType, i.description, i.total_quantity AS totalQuantity, i.available_quantity AS availableQuantity, i.location, i.status, c.id AS categoryId, c.name AS categoryName FROM items i JOIN categories c ON c.id = i.category_id ORDER BY i.name",
    );
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});
router.get("/categories", async (_request, response, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM categories WHERE status = 'ACTIVE' ORDER BY name",
    );
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});
router.get("/rooms", async (_request, response, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms ORDER BY name");
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});
router.get("/items/:id", async (request, response, next) => {
  try {
    const [rows] = await pool.execute<any[]>(
      "SELECT i.*, c.name AS categoryName FROM items i JOIN categories c ON c.id=i.category_id WHERE i.id=? OR i.code=?",
      [request.params.id, request.params.id],
    );
    return rows[0]
      ? response.json(rows[0])
      : response.status(404).json({ message: "ไม่พบรายการ" });
  } catch (error) {
    return next(error);
  }
});
router.get(
  "/audit-logs",
  requireAuth,
  async (_request: AuthRequest, response, next) => {
    try {
      const [rows] = await pool.query(
        "SELECT a.*, u.name AS user_name FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT 200",
      );
      return response.json(rows);
    } catch (error) {
      return next(error);
    }
  },
);
export default router;
