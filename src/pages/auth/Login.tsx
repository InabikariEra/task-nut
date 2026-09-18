import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("USER");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      email:
        email.trim() && email.includes("@") ? "" : "กรุณากรอก Email ให้ถูกต้อง",
      password:
        password.length >= 6 ? "" : "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
    };
    setFieldErrors(nextErrors);
    setSubmitError("");
    if (nextErrors.email || nextErrors.password) return;
    setIsLoading(true);
    window.setTimeout(async () => {
      if (email.trim().toLowerCase() === "error@campus.edu") {
        setSubmitError("ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบข้อมูลอีกครั้ง");
        setIsLoading(false);
        return;
      }
      const signedIn = await signIn(email.trim(), role, password);
      if (!signedIn) {
        setSubmitError("Email หรือรหัสผ่านไม่ถูกต้อง");
        setIsLoading(false);
        return;
      }
      navigate(location.state?.from?.pathname ?? "/dashboard");
    }, 600);
  };

  return (
    <div className="grid min-h-screen bg-campus-background lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="relative flex min-h-62.5 flex-col overflow-hidden bg-campus-primary px-6 py-7 text-white sm:px-10 lg:min-h-screen lg:px-14 lg:py-10">
        <div className="relative z-10 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-white/15 font-bold text-white">
            B
          </span>
          <span className="text-lg font-bold tracking-tight">BorrowDesk</span>
        </div>
        <div className="relative z-10 mt-auto max-w-md pb-4 pt-16 lg:pb-12">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-teal-100">
            ระบบบริการการศึกษา
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            ยืมง่าย คืนตรงเวลา เรียนได้เต็มที่
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-teal-50">
            จัดการอุปกรณ์การเรียน ห้องปฏิบัติการ และคำขอยืมทั้งหมดได้ในที่เดียว
          </p>
        </div>
        <p className="relative z-10 text-xs text-teal-100/80">
          ระบบยืม-คืนอุปกรณ์และห้องปฏิบัติการ
        </p>
        <div
          className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full border-32 border-teal-500/20"
          aria-hidden="true"
        />
      </aside>
      <main className="grid place-items-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-campus-primary">
            ยินดีต้อนรับกลับ
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            เข้าสู่ระบบ
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            ใช้บัญชีของสถานศึกษาเพื่อดำเนินการต่อ
          </p>
          <form className="mt-8 grid gap-5" onSubmit={submit} noValidate>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFieldErrors((current) => ({ ...current, email: "" }));
                  setSubmitError("");
                }}
                placeholder="you@campus.ac.th"
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
                className={`rounded-md border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-teal-100 ${fieldErrors.email ? "border-red-400" : "border-slate-300 focus:border-campus-primary"}`}
              />
              {fieldErrors.email && (
                <span className="text-xs font-normal text-red-700">
                  {fieldErrors.email}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              รหัสผ่าน
              <span className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldErrors((current) => ({ ...current, password: "" }));
                    setSubmitError("");
                  }}
                  placeholder="กรอกรหัสผ่าน"
                  autoComplete="current-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  className={`w-full rounded-md border bg-white px-3 py-2.5 pr-16 text-sm outline-none transition focus:ring-2 focus:ring-teal-100 ${fieldErrors.password ? "border-red-400" : "border-slate-300 focus:border-campus-primary"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-semibold text-campus-primary hover:bg-teal-50"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? "ซ่อน" : "แสดง"}
                </button>
              </span>
              {fieldErrors.password && (
                <span className="text-xs font-normal text-red-700">
                  {fieldErrors.password}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              เข้าสู่ระบบในบทบาท
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-campus-primary focus:ring-2 focus:ring-teal-100"
              >
                <option value="USER">นักเรียน / ผู้ใช้งาน</option>
                <option value="STAFF">เจ้าหน้าที่</option>
                <option value="ADMIN">ผู้ดูแลระบบ</option>
              </select>
            </label>
            {submitError && (
              <p
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                role="alert"
              >
                {submitError}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 rounded-md bg-campus-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-campus-primary-hover hover:shadow-md disabled:translate-y-0 disabled:opacity-60"
            >
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            ยังไม่มีบัญชี?{" "}
            <Link
              to="/register"
              className="font-semibold text-campus-primary hover:underline"
            >
              สร้างบัญชีผู้ใช้งาน
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
