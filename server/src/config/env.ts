import "dotenv/config";

function required(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  dbHost: required("DB_HOST", "localhost"),
  dbPort: Number(process.env.DB_PORT ?? 3306),
  dbName: required("DB_NAME", "equipment_borrowing"),
  dbUser: required("DB_USER", "root"),
  dbPassword: process.env.DB_PASSWORD ?? "",
  jwtSecret: required("JWT_SECRET", "development-only-change-me"),
  finePerDay: Number(process.env.FINE_PER_DAY ?? 20),
};
