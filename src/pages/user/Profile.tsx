import { useState, type FormEvent } from "react";
import PageHeader from "../../components/common/PageHeader";
import Toast from "../../components/common/Toast";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [studentId, setStudentId] = useState(user?.studentId ?? "");
  const [department, setDepartment] = useState(user?.department ?? "");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes("@")) {
      setError("กรุณากรอกชื่อและ Email ให้ถูกต้อง");
      setToast("");
      return;
    }

    updateUser({
      name: name.trim(),
      email: email.trim(),
      studentId: studentId.trim(),
      department: department.trim(),
    });
    setError("");
    setToast("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว");
  };

  const initials =
    user?.name
      .split(" ")
      .map((part) => part[0])
      .join("") ?? "U";
  const roleLabel =
    user?.role === "ADMIN"
      ? "ผู้ดูแลระบบ"
      : user?.role === "STAFF"
        ? "เจ้าหน้าที่"
        : "นักเรียน / ผู้ใช้งาน";

  return (
    <div>
      <PageHeader
        title="โปรไฟล์"
        description="ตรวจสอบและแก้ไขข้อมูลบัญชีของคุณ"
      />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="border border-slate-200 bg-white p-6 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-teal-100 text-2xl font-bold text-teal-800">
            {initials}
          </span>
          <h2 className="mt-4 font-bold text-slate-900">{user?.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{roleLabel}</p>
          <p className="mt-3 text-xs text-slate-400">ข้อมูลจากระบบจำลอง</p>
        </aside>
        <form
          className="border border-slate-200 bg-white p-5 sm:p-6"
          onSubmit={submit}
          noValidate
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                ข้อมูลส่วนตัว
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                แก้ไขข้อมูลแล้วกดบันทึกเพื่ออัปเดตในระบบจำลอง
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              ชื่อ-นามสกุล
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              รหัสนักเรียน
              <input
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              แผนก/สาขา
              <input
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>
          </div>
          {error && (
            <p
              className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 hover:shadow-sm"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast("")} />
      )}
    </div>
  );
}
