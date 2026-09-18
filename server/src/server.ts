import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import borrowingRoutes from "./routes/borrowings.js";
import catalogRoutes from "./routes/catalog.js";
import returnRoutes from "./routes/returns.js";

const app = express();
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());
app.get("/api/health", (_request, response) =>
  response.json({ ok: true, service: "equipment-borrowing-api" }),
);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/borrowings", borrowingRoutes);
app.use("/api/returns", returnRoutes);
app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    void _next;
    console.error(error);
    const message =
      error instanceof Error ? error.message : "เกิดข้อผิดพลาดภายในระบบ";
    return response.status(400).json({ message });
  },
);

app.listen(env.port, () =>
  console.log(`API listening on http://localhost:${env.port}`),
);
