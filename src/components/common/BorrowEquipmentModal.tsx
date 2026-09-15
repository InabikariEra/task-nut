import { useState, type FormEvent } from "react";
import type { EquipmentRecord } from "../../data/mockData";

interface BorrowEquipmentModalProps {
  equipment: EquipmentRecord | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (values: {
    quantity: number;
    borrowedDate: string;
    dueDate: string;
    purpose: string;
  }) => void;
}

export default function BorrowEquipmentModal({
  equipment,
  open,
  onClose,
  onConfirm,
}: BorrowEquipmentModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [borrowedDate, setBorrowedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [purpose, setPurpose] = useState("");
  if (!open || !equipment) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConfirm({ quantity, borrowedDate, dueDate, purpose });
    setQuantity(1);
    setBorrowedDate("");
    setDueDate("");
    setPurpose("");
  };

  return (
    <div
      className="fixed inset-0 z-50 grid animate-[fade-in_150ms_ease-out] place-items-center bg-slate-950/40 p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <form
        onSubmit={submit}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-lg animate-[modal-in_180ms_ease-out] border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="borrow-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              สร้างคำขอยืม
            </p>
            <h2
              id="borrow-modal-title"
              className="mt-1 text-lg font-bold text-slate-900"
            >
              {equipment.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              รหัส {equipment.code} · พร้อมให้ยืม {equipment.available} ชิ้น
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="ปิดหน้าต่าง"
          >
            ×
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            จำนวน
            <input
              type="number"
              min="1"
              max={equipment.available}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              required
              className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <div className="hidden sm:block" />
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            วันที่ยืม
            <input
              type="date"
              value={borrowedDate}
              onChange={(event) => setBorrowedDate(event.target.value)}
              required
              className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            กำหนดคืน
            <input
              type="date"
              value={dueDate}
              min={borrowedDate || undefined}
              onChange={(event) => setDueDate(event.target.value)}
              required
              className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
            วัตถุประสงค์
            <textarea
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              required
              rows={3}
              placeholder="ระบุวัตถุประสงค์การใช้งาน"
              className="rounded border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            ยืนยันคำขอยืม
          </button>
        </div>
      </form>
    </div>
  );
}
