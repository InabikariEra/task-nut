import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { pool } from "../config/db.js";
import { audit } from "../utils/audit.js";
import {
  requireAuth,
  requireRole,
  type AuthRequest,
} from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("ADMIN"));
const itemSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(1),
  categoryId: z.coerce.number().int().positive(),
  itemType: z.enum(["EQUIPMENT", "BOOK", "OTHER"]),
  description: z.string().optional(),
  totalQuantity: z.coerce.number().int().min(1),
  availableQuantity: z.coerce.number().int().min(0),
  location: z.string().optional(),
  status: z
    .enum(["AVAILABLE", "BORROWED", "MAINTENANCE", "UNAVAILABLE"])
    .default("AVAILABLE"),
});
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  studentId: z.string().optional(),
  department: z.string().optional(),
  role: z.enum(["ADMIN", "STAFF", "USER"]),
  status: z.enum(["ACTIVE", "SUSPENDED"]).default("ACTIVE"),
});

router.get("/items", async (_request, response, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT i.*, c.name AS category_name FROM items i JOIN categories c ON c.id = i.category_id ORDER BY i.created_at DESC",
    );
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});
router.post("/items", async (request: AuthRequest, response, next) => {
  try {
    const input = itemSchema.parse(request.body);
    const [result] = await pool.execute<any>(
      "INSERT INTO items (category_id, code, name, item_type, description, total_quantity, available_quantity, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        input.categoryId,
        input.code,
        input.name,
        input.itemType,
        input.description ?? null,
        input.totalQuantity,
        input.availableQuantity,
        input.location ?? null,
        input.status,
      ],
    );
    await audit(
      request.user?.id,
      "CREATE",
      "items",
      result.insertId,
      null,
      input,
    );
    return response.status(201).json({ id: result.insertId, ...input });
  } catch (error) {
    return next(error);
  }
});
router.put("/items/:id", async (request: AuthRequest, response, next) => {
  try {
    const input = itemSchema.parse(request.body);
    const [beforeRows] = await pool.execute<any[]>(
      "SELECT * FROM items WHERE id = ?",
      [request.params.id],
    );
    await pool.execute(
      "UPDATE items SET category_id=?, code=?, name=?, item_type=?, description=?, total_quantity=?, available_quantity=?, location=?, status=? WHERE id=?",
      [
        input.categoryId,
        input.code,
        input.name,
        input.itemType,
        input.description ?? null,
        input.totalQuantity,
        input.availableQuantity,
        input.location ?? null,
        input.status,
        request.params.id,
      ],
    );
    await audit(
      request.user?.id,
      "UPDATE",
      "items",
      Number(request.params.id),
      beforeRows[0],
      input,
    );
    return response.json(input);
  } catch (error) {
    return next(error);
  }
});
router.delete("/items/:id", async (request: AuthRequest, response, next) => {
  try {
    const [beforeRows] = await pool.execute<any[]>(
      "SELECT * FROM items WHERE id = ?",
      [request.params.id],
    );
    await pool.execute("DELETE FROM items WHERE id = ?", [request.params.id]);
    await audit(
      request.user?.id,
      "DELETE",
      "items",
      Number(request.params.id),
      beforeRows[0],
      null,
    );
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.get("/users", async (_request, response, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT u.id, u.name, u.email, u.student_id AS studentId, u.department, u.status, r.code AS role, u.created_at AS joined FROM users u JOIN roles r ON r.id = u.role_id ORDER BY u.created_at DESC",
    );
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});
router.post("/users", async (request: AuthRequest, response, next) => {
  try {
    const input = userSchema
      .extend({ password: z.string().min(6) })
      .parse(request.body);
    const passwordHash = await bcrypt.hash(input.password, 12);
    const [roleRows] = await pool.execute<any[]>(
      "SELECT id FROM roles WHERE code = ?",
      [input.role],
    );
    const [result] = await pool.execute<any>(
      "INSERT INTO users (role_id, name, email, password_hash, student_id, department, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        roleRows[0].id,
        input.name,
        input.email,
        passwordHash,
        input.studentId ?? null,
        input.department ?? null,
        input.status,
      ],
    );
    await audit(request.user?.id, "CREATE", "users", result.insertId, null, {
      ...input,
      password: undefined,
    });
    return response
      .status(201)
      .json({ id: result.insertId, ...input, password: undefined });
  } catch (error) {
    return next(error);
  }
});
router.put("/users/:id", async (request: AuthRequest, response, next) => {
  try {
    const input = userSchema.parse(request.body);
    const [roleRows] = await pool.execute<any[]>(
      "SELECT id FROM roles WHERE code = ?",
      [input.role],
    );
    const [beforeRows] = await pool.execute<any[]>(
      "SELECT * FROM users WHERE id = ?",
      [request.params.id],
    );
    await pool.execute(
      "UPDATE users SET role_id=?, name=?, email=?, student_id=?, department=?, status=? WHERE id=?",
      [
        roleRows[0].id,
        input.name,
        input.email,
        input.studentId ?? null,
        input.department ?? null,
        input.status,
        request.params.id,
      ],
    );
    await audit(
      request.user?.id,
      "UPDATE",
      "users",
      Number(request.params.id),
      beforeRows[0],
      input,
    );
    return response.json(input);
  } catch (error) {
    return next(error);
  }
});
router.delete("/users/:id", async (request: AuthRequest, response, next) => {
  try {
    const [beforeRows] = await pool.execute<any[]>(
      "SELECT * FROM users WHERE id = ?",
      [request.params.id],
    );
    await pool.execute("DELETE FROM users WHERE id = ?", [request.params.id]);
    await audit(
      request.user?.id,
      "DELETE",
      "users",
      Number(request.params.id),
      beforeRows[0],
      null,
    );
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
