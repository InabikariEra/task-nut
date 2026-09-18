/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";

const router = Router();
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/login", async (request, response, next) => {
  try {
    const input = loginSchema.parse(request.body);
    const [rows] = await pool.execute<any[]>(
      "SELECT u.id, u.name, u.email, u.password_hash, r.code AS role, u.student_id, u.department, u.status FROM users u JOIN roles r ON r.id = u.role_id WHERE u.email = ? LIMIT 1",
      [input.email],
    );
    const user = rows[0];
    if (
      !user ||
      user.status !== "ACTIVE" ||
      !(await bcrypt.compare(input.password, user.password_hash))
    )
      return response
        .status(401)
        .json({ message: "Email หรือรหัสผ่านไม่ถูกต้อง" });
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      env.jwtSecret,
      { expiresIn: "8h" },
    );
    return response.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.student_id,
        department: user.department,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", async (request, response, next) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token)
      return response.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
    const payload = jwt.verify(token, env.jwtSecret) as { id: number };
    const [rows] = await pool.execute<any[]>(
      "SELECT u.id, u.name, u.email, r.code AS role, u.student_id, u.department FROM users u JOIN roles r ON r.id = u.role_id WHERE u.id = ?",
      [payload.id],
    );
    return rows[0]
      ? response.json({ user: rows[0] })
      : response.status(404).json({ message: "ไม่พบผู้ใช้" });
  } catch (error) {
    return next(error);
  }
});

export default router;
