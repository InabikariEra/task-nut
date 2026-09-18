/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
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
const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  itemType: z.enum(["EQUIPMENT", "BOOK", "OTHER"]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
const roomSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(1),
  building: z.string().min(1),
  floor: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
  status: z
    .enum(["AVAILABLE", "MAINTENANCE", "UNAVAILABLE"])
    .default("AVAILABLE"),
});

router.get("/categories", async (_request, response, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY name");
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});
router.post("/categories", async (request: AuthRequest, response, next) => {
  try {
    const input = categorySchema.parse(request.body);
    const [result] = await pool.execute<any>(
      "INSERT INTO categories (name, description, item_type, status) VALUES (?, ?, ?, ?)",
      [input.name, input.description ?? null, input.itemType, input.status],
    );
    await audit(
      request.user?.id,
      "CREATE",
      "categories",
      result.insertId,
      null,
      input,
    );
    return response.status(201).json({ id: result.insertId, ...input });
  } catch (error) {
    return next(error);
  }
});
router.put("/categories/:id", async (request: AuthRequest, response, next) => {
  try {
    const input = categorySchema.parse(request.body);
    await pool.execute(
      "UPDATE categories SET name=?, description=?, item_type=?, status=? WHERE id=?",
      [
        input.name,
        input.description ?? null,
        input.itemType,
        input.status,
        String(request.params.id),
      ],
    );
    await audit(
      request.user?.id,
      "UPDATE",
      "categories",
      Number(request.params.id),
      null,
      input,
    );
    return response.json(input);
  } catch (error) {
    return next(error);
  }
});
router.delete(
  "/categories/:id",
  async (request: AuthRequest, response, next) => {
    try {
      await pool.execute("DELETE FROM categories WHERE id=?", [
        String(request.params.id),
      ]);
      await audit(
        request.user?.id,
        "DELETE",
        "categories",
        Number(request.params.id),
        null,
        null,
      );
      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  },
);

router.get("/rooms", async (_request, response, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms ORDER BY name");
    return response.json(rows);
  } catch (error) {
    return next(error);
  }
});
router.post("/rooms", async (request: AuthRequest, response, next) => {
  try {
    const input = roomSchema.parse(request.body);
    const [result] = await pool.execute<any>(
      "INSERT INTO rooms (code, name, building, floor, capacity, status) VALUES (?, ?, ?, ?, ?, ?)",
      [
        input.code,
        input.name,
        input.building,
        input.floor,
        input.capacity,
        input.status,
      ],
    );
    await audit(
      request.user?.id,
      "CREATE",
      "rooms",
      result.insertId,
      null,
      input,
    );
    return response.status(201).json({ id: result.insertId, ...input });
  } catch (error) {
    return next(error);
  }
});
router.put("/rooms/:id", async (request: AuthRequest, response, next) => {
  try {
    const input = roomSchema.parse(request.body);
    await pool.execute(
      "UPDATE rooms SET code=?, name=?, building=?, floor=?, capacity=?, status=? WHERE id=?",
      [
        input.code,
        input.name,
        input.building,
        input.floor,
        input.capacity,
        input.status,
        String(request.params.id),
      ],
    );
    await audit(
      request.user?.id,
      "UPDATE",
      "rooms",
      Number(request.params.id),
      null,
      input,
    );
    return response.json(input);
  } catch (error) {
    return next(error);
  }
});
router.delete("/rooms/:id", async (request: AuthRequest, response, next) => {
  try {
    await pool.execute("DELETE FROM rooms WHERE id=?", [
      String(request.params.id),
    ]);
    await audit(
      request.user?.id,
      "DELETE",
      "rooms",
      Number(request.params.id),
      null,
      null,
    );
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
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
      [String(request.params.id)],
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
        String(request.params.id),
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
      [String(request.params.id)],
    );
    await pool.execute("DELETE FROM items WHERE id = ?", [
      String(request.params.id),
    ]);
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
      [String(request.params.id)],
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
        String(request.params.id),
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
      [String(request.params.id)],
    );
    await pool.execute("DELETE FROM users WHERE id = ?", [
      String(request.params.id),
    ]);
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
