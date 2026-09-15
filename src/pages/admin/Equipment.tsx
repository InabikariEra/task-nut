import { useMemo, useState } from "react";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Toast from "../../components/common/Toast";
import { type EquipmentRecord } from "../../data/mockData";
import {
  getEquipmentRecords,
  saveEquipmentRecords,
} from "../../data/mockStore";

export default function Equipment() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const [selected, setSelected] = useState<string | null>(null);
  const [equipment, setEquipment] = useState(() => getEquipmentRecords());
  const [editing, setEditing] = useState<EquipmentRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<EquipmentRecord>({
    code: "",
    name: "",
    category: "คอมพิวเตอร์",
    total: 1,
    available: 1,
    status: "พร้อมใช้งาน",
    location: "",
  });
  const [toast, setToast] = useState("");
  const filtered = useMemo(
    () =>
      equipment.filter(
        (item) =>
          (category === "ทั้งหมด" || item.category === category) &&
          `${item.code} ${item.name}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [equipment, search, category],
  );
  const confirmDelete = () => {
    if (!selected) return;
    const next = equipment.filter((item) => item.name !== selected);
    setEquipment(next);
    saveEquipmentRecords(next);
    setSelected(null);
    setToast(`ลบ ${selected} จากข้อมูลจำลองแล้ว`);
  };
  const openCreate = () => {
    setEditing(null);
    setForm({
      code: `EQ-NEW-${String(Date.now()).slice(-3)}`,
      name: "",
      category: "คอมพิวเตอร์",
      total: 1,
      available: 1,
      status: "พร้อมใช้งาน",
      location: "",
    });
    setFormOpen(true);
  };
  const openEdit = (item: EquipmentRecord) => {
    setEditing(item);
    setForm(item);
    setFormOpen(true);
  };
  const saveForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = editing
      ? equipment.map((item) => (item.code === editing.code ? form : item))
      : [form, ...equipment];
    setEquipment(next);
    saveEquipmentRecords(next);
    setFormOpen(false);
    setToast(editing ? "แก้ไขข้อมูลอุปกรณ์แล้ว" : "เพิ่มอุปกรณ์แล้ว");
  };
  return (
    <div>
      <PageHeader
        title="จัดการอุปกรณ์"
        description="จัดการข้อมูล จำนวน และสถานะอุปกรณ์สำหรับการยืมใช้งาน"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            + เพิ่มอุปกรณ์
          </button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 border border-slate-200 bg-white p-4 md:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหารหัสอุปกรณ์หรือชื่ออุปกรณ์"
          className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          <option>ทั้งหมด</option>
          <option>คอมพิวเตอร์</option>
          <option>โสตทัศนูปกรณ์</option>
          <option>อุปกรณ์อิเล็กทรอนิกส์</option>
          <option>เครื่องมือวัด</option>
        </select>
        <select className="rounded border border-slate-300 px-3 py-2 text-sm">
          <option>ทุกสถานะ</option>
          <option>พร้อมใช้งาน</option>
          <option>กำลังซ่อม</option>
        </select>
        <select className="rounded border border-slate-300 px-3 py-2 text-sm">
          <option>ทุกสถานที่</option>
          <option>อาคาร A ชั้น 2</option>
          <option>อาคาร B ชั้น 1</option>
        </select>
      </div>
      <DataTable
        headers={[
          "รูป",
          "รหัสอุปกรณ์",
          "ชื่อ",
          "หมวดหมู่",
          "จำนวนทั้งหมด",
          "พร้อมให้ยืม",
          "สถานะ",
          "การดำเนินการ",
        ]}
      >
        {filtered.map((item) => (
          <tr key={item.code} className="hover:bg-slate-50">
            <td className="px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded bg-slate-100 text-xs font-bold text-slate-500">
                EQ
              </span>
            </td>
            <td className="px-4 py-3 font-medium text-slate-800">
              {item.code}
            </td>
            <td className="px-4 py-3 text-slate-700">
              {item.name}
              <span className="block text-xs text-slate-500">
                {item.location}
              </span>
            </td>
            <td className="px-4 py-3 text-slate-600">{item.category}</td>
            <td className="px-4 py-3 text-slate-600">{item.total}</td>
            <td className="px-4 py-3 text-slate-600">{item.available}</td>
            <td className="px-4 py-3">
              <StatusBadge
                status={item.status}
                tone={item.status === "พร้อมใช้งาน" ? "success" : "warning"}
              />
            </td>
            <td className="whitespace-nowrap px-4 py-3">
              <button
                type="button"
                className="mr-3 text-xs font-semibold text-slate-600"
              >
                ดู
              </button>
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="mr-3 text-xs font-semibold text-teal-700"
              >
                แก้ไข
              </button>
              <button
                type="button"
                onClick={() => setSelected(item.name)}
                className="text-xs font-semibold text-red-700"
              >
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
      <ConfirmModal
        open={Boolean(selected)}
        title="ยืนยันการลบอุปกรณ์"
        description={`คุณต้องการลบ ${selected} ออกจากระบบหรือไม่`}
        confirmLabel="ยืนยันการลบ"
        onCancel={() => setSelected(null)}
        onConfirm={confirmDelete}
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
              {editing ? "แก้ไขอุปกรณ์" : "เพิ่มอุปกรณ์"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                รหัสอุปกรณ์
                <input
                  required
                  value={form.code}
                  onChange={(event) =>
                    setForm({ ...form, code: event.target.value })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                ชื่ออุปกรณ์
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
                หมวดหมู่
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                >
                  <option>คอมพิวเตอร์</option>
                  <option>โสตทัศนูปกรณ์</option>
                  <option>อุปกรณ์อิเล็กทรอนิกส์</option>
                  <option>เครื่องมือวัด</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium">
                สถานที่จัดเก็บ
                <input
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                จำนวนทั้งหมด
                <input
                  type="number"
                  min="1"
                  required
                  value={form.total}
                  onChange={(event) =>
                    setForm({ ...form, total: Number(event.target.value) })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                พร้อมให้ยืม
                <input
                  type="number"
                  min="0"
                  max={form.total}
                  required
                  value={form.available}
                  onChange={(event) =>
                    setForm({ ...form, available: Number(event.target.value) })
                  }
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
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
