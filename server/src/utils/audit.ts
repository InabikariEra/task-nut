import type { ResultSetHeader } from "mysql2";
import { pool } from "../config/db.js";

export async function audit(
  userId: number | undefined,
  action: string,
  entityType: string,
  entityId: number | undefined,
  beforeData: unknown,
  afterData: unknown,
) {
  await pool.execute<ResultSetHeader>(
    "INSERT INTO audit_logs (user_id, action, entity_type, entity_id, before_data, after_data) VALUES (?, ?, ?, ?, ?, ?)",
    [
      userId ?? null,
      action,
      entityType,
      entityId ?? null,
      beforeData ? JSON.stringify(beforeData) : null,
      afterData ? JSON.stringify(afterData) : null,
    ],
  );
}
