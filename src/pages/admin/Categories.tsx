import { useState } from "react";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Toast from "../../components/common/Toast";

const categories = [
  {
    name: "คอมพิวเตอร์",
    description: "Notebook และอุปกรณ์คอมพิวเตอร์",
    count: 18,
    status: "ใช้งานอยู่",
    created: "12 มิ.ย. 2565",
  },
  {
    name: "โสตทัศนูปกรณ์",
    description: "อุปกรณ์สำหรับการนำเสนอ",
    count: 12,
    status: "ใช้งานอยู่",
    created: "12 มิ.ย. 2565",
  },
  {
    name: "อุปกรณ์อิเล็กทรอนิกส์",
    description: "บอร์ดและชุดทดลองอิเล็กทรอนิกส์",
    count: 34,
    status: "ใช้งานอยู่",
    created: "20 มิ.ย. 2565",
  },
  {
    name: "เครื่องมือวัด",
    description: "อุปกรณ์วัดทางไฟฟ้าและวิทยาศาสตร์",
    count: 22,
    status: "ใช้งานอยู่",
    created: "02 ก.ค. 2565",
  },
];

export default function Categories() {
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [categoryRows, setCategoryRows] = useState(categories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState("");
  const saveCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCategoryRows((rows) => [
      { name, description, count: 0, status: "ใช้งานอยู่", created: "วันนี้" },
      ...rows,
    ]);
    setName("");
    setDescription("");
    setFormOpen(false);
    setToast(`เพิ่มหมวดหมู่ ${name} แล้ว`);
  };
  return (
    <div>
      <PageHeader
        title="หมวดหมู่อุปกรณ์"
        description="จัดกลุ่มอุปกรณ์เพื่อให้ค้นหาและจัดการได้ง่าย"
        action={
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            + เพิ่มหมวดหมู่
          </button>
        }
      />
      <DataTable
        headers={[
          "ชื่อหมวดหมู่",
          "รายละเอียด",
          "จำนวนอุปกรณ์",
          "สถานะ",
          "วันที่สร้าง",
          "การดำเนินการ",
        ]}
      >
        {categoryRows.map((category) => (
          <tr key={category.name} className="hover:bg-slate-50">
            <td className="px-4 py-3 font-semibold text-slate-800">
              {category.name}
            </td>
            <td className="px-4 py-3 text-slate-600">{category.description}</td>
            <td className="px-4 py-3 text-slate-600">
              {category.count} รายการ
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={category.status} tone="success" />
            </td>
            <td className="px-4 py-3 text-slate-600">{category.created}</td>
            <td className="whitespace-nowrap px-4 py-3">
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="mr-3 text-xs font-semibold text-teal-700"
              >
                แก้ไข
              </button>
              <button
                type="button"
                onClick={() => setSelected(category.name)}
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
        title="ยืนยันการลบหมวดหมู่"
        description={`คุณต้องการลบหมวดหมู่ ${selected} หรือไม่`}
        confirmLabel="ยืนยันการลบ"
        onCancel={() => setSelected(null)}
        onConfirm={() => {
          setCategoryRows((rows) =>
            rows.filter((category) => category.name !== selected),
          );
          setSelected(null);
          setToast("ลบหมวดหมู่แล้ว");
        }}
      />
      {formOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            className="w-full max-w-md border border-slate-200 bg-white p-6 shadow-xl"
            onSubmit={saveCategory}
          >
            <h2 className="text-lg font-bold text-slate-900">เพิ่มหมวดหมู่</h2>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                ชื่อหมวดหมู่
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                รายละเอียด
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700"
                  rows={3}
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
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
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast("")} />
      )}
    </div>
  );
}
