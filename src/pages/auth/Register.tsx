import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("กรุณากรอก Email ให้ถูกต้อง");
      return;
    }
    signIn(email.trim(), "USER", "password");
    navigate("/dashboard");
  };

  return (
    <div className="grid min-h-screen bg-campus-background lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="flex min-h-57.5 flex-col bg-campus-primary px-6 py-7 text-white sm:px-10 lg:min-h-screen lg:px-14 lg:py-10">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-white/15 font-bold">
            B
          </span>
          <span className="text-lg font-bold">BorrowDesk</span>
        </div>
        <div className="mt-auto max-w-md pb-4 pt-16 lg:pb-12">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-teal-100">
            เริ่มต้นใช้งาน
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            พื้นที่เรียนรู้ที่พร้อมสำหรับทุกคน
          </h1>
          <p className="mt-5 text-sm leading-7 text-teal-50">
            สร้างบัญชีเพื่อยืมอุปกรณ์ จองห้อง และติดตามการใช้งานของคุณ
          </p>
        </div>
        <p className="text-xs text-teal-100/80">
          สำหรับนักเรียนและบุคลากรของสถานศึกษา
        </p>
      </aside>
      <main className="grid place-items-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-campus-primary">
            สร้างบัญชีใหม่
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            ลงทะเบียนผู้ใช้งาน
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            ข้อมูลของคุณจะได้รับการตรวจสอบโดยผู้ดูแลระบบ
          </p>
          <form className="mt-8 grid gap-5" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              ชื่อ-นามสกุล
              <input
                required
                placeholder="สมชาย ใจดี"
                className="rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-campus-primary focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="you@campus.ac.th"
                className={`rounded-md border px-3 py-2.5 text-sm outline-none focus:border-campus-primary focus:ring-2 focus:ring-teal-100 ${error ? "border-red-400" : "border-slate-300"}`}
              />
              {error && (
                <span className="text-xs font-normal text-red-700">
                  {error}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              รหัสผ่าน
              <input
                required
                minLength={6}
                type="password"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-campus-primary focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <button
              type="submit"
              className="rounded-md bg-campus-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-campus-primary-hover hover:shadow-md"
            >
              สร้างบัญชี
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              to="/login"
              className="font-semibold text-campus-primary hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
