import { useMemo, useState } from "react";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Toast from "../../components/common/Toast";
import { type UserRecord } from "../../data/mockData";
import { getUserRecords, saveUserRecords } from "../../data/mockStore";

export default function Users() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ทั้งหมด");
  const [selected, setSelected] = useState<string | null>(null);
  const [users, setUsers] = useState(() => getUserRecords());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [form, setForm] = useState<UserRecord>({
    name: "",
    studentId: "",
    email: "",
    department: "",
    role: "นักเรียน",
    status: "ใช้งานอยู่",
    joined: "วันนี้",
  });
  const [toast, setToast] = useState("");
  const filtered = useMemo(
    () =>
      users.filter(
        (user) =>
          (role === "ทั้งหมด" || user.role === role) &&
          `${user.name} ${user.studentId} ${user.email}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [users, search, role],
  );
  const confirmAction = () => {
    if (!selected) return;
    const next = users.filter((user) => user.name !== selected);
    setUsers(next);
    saveUserRecords(next);
    setSelected(null);
    setToast(`ดำเนินการกับบัญชี ${selected} ในข้อมูลจำลองแล้ว`);
  };
  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      studentId: "",
      email: "",
      department: "",
      role: "นักเรียน",
      status: "ใช้งานอยู่",
      joined: "วันนี้",
    });
    setFormOpen(true);
  };
  const openEdit = (user: UserRecord) => {
    setEditing(user);
    setForm(user);
    setFormOpen(true);
  };
  const saveForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = editing
      ? users.map((user) => (user.email === editing.email ? form : user))
      : [form, ...users];
    setUsers(next);
    saveUserRecords(next);
    setFormOpen(false);
    setToast(editing ? "แก้ไขข้อมูลผู้ใช้งานแล้ว" : "เพิ่มผู้ใช้งานแล้ว");
  };
  return (
    <div>
      <PageHeader
        title="จัดการผู้ใช้งาน"
        description="ดูแลบัญชีผู้ใช้งาน บทบาท และสิทธิ์การเข้าใช้งานระบบ"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            + เพิ่มผู้ใช้งาน
          </button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 border border-slate-200 bg-white p-4 md:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาชื่อ รหัสนักเรียน หรือ Email"
          className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
        />
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          <option>ทั้งหมด</option>
          <option>นักเรียน</option>
          <option>เจ้าหน้าที่</option>
        </select>
        <select className="rounded border border-slate-300 px-3 py-2 text-sm">
          <option>ทุกสถานะ</option>
          <option>ใช้งานอยู่</option>
          <option>ถูกระงับ</option>
        </select>
      </div>
      <DataTable
        headers={[
          "ผู้ใช้งาน",
          "รหัสนักเรียน",
          "Email",
          "แผนก/สาขา",
          "บทบาท",
          "สถานะ",
          "วันที่สมัคร",
          "การดำเนินการ",
        ]}
      >
        {filtered.map((user) => (
          <tr key={user.email} className="hover:bg-slate-50">
            <td className="px-4 py-3 font-medium text-slate-800">
              {user.name}
            </td>
            <td className="px-4 py-3 text-slate-600">{user.studentId}</td>
            <td className="px-4 py-3 text-slate-600">{user.email}</td>
            <td className="px-4 py-3 text-slate-600">{user.department}</td>
            <td className="px-4 py-3 text-slate-600">{user.role}</td>
            <td className="px-4 py-3">
              <StatusBadge
                status={user.status}
                tone={user.status === "ถูกระงับ" ? "danger" : "success"}
              />
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
              {user.joined}
            </td>
            <td className="whitespace-nowrap px-4 py-3">
              <button
                type="button"
                className="mr-3 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                ดู
              </button>
              <button
                type="button"
                onClick={() => openEdit(user)}
                className="mr-3 text-xs font-semibold text-teal-700 hover:underline"
              >
                แก้ไข
              </button>
              <button
                type="button"
                onClick={() => setSelected(user.name)}
                className="text-xs font-semibold text-red-700 hover:underline"
              >
                {user.status === "ถูกระงับ" ? "ลบ" : "ระงับ"}
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
      <ConfirmModal
        open={Boolean(selected)}
        title="ยืนยันการดำเนินการ"
        description={`คุณต้องการระงับหรือลบบัญชี ${selected} ใช่หรือไม่`}
        confirmLabel="ยืนยัน"
        onCancel={() => setSelected(null)}
        onConfirm={confirmAction}
      />
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast("")} />
      )}
      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form
            onSubmit={saveForm}
            className="w-full max-w-lg space-y-4 border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-900">
              {editing ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                ชื่อ-นามสกุล
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                รหัสนักเรียน
                <input
                  value={form.studentId}
                  onChange={(event) =>
                    setForm({ ...form, studentId: event.target.value })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                แผนก/สาขา
                <input
                  value={form.department}
                  onChange={(event) =>
                    setForm({ ...form, department: event.target.value })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                บทบาท
                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                >
                  <option>นักเรียน</option>
                  <option>เจ้าหน้าที่</option>
                  <option>ผู้ดูแลระบบ</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded border border-slate-300 px-4 py-2 text-sm"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
