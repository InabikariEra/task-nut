import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type Role = "ADMIN" | "STAFF" | "USER";
export interface AuthRequest extends Request {
  user?: { id: number; role: Role; email: string };
}

export function requireAuth(
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) {
  const token = request.headers.authorization?.replace("Bearer ", "");
  if (!token) return response.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
  try {
    request.user = jwt.verify(token, env.jwtSecret) as AuthRequest["user"];
    return next();
  } catch {
    return response
      .status(401)
      .json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
}

export function requireRole(...roles: Role[]) {
  return (request: AuthRequest, response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.role))
      return response.status(403).json({ message: "ไม่มีสิทธิ์ดำเนินการ" });
    return next();
  };
}
