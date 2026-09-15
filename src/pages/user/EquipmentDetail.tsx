import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Toast from "../../components/common/Toast";
import { mockEquipment } from "../../data/mockData";
import { addBorrowRequest } from "../../data/mockStore";

export default function EquipmentDetail() {
  const { id } = useParams();
  const equipment =
    mockEquipment.find((item) => item.code === id) ?? mockEquipment[0];
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addBorrowRequest({
      id: `BR-2026-${String(Date.now()).slice(-4)}`,
      borrower: "memm",
      borrowedDate: borrowDate,
      dueDate,
      items: equipment.name,
      quantity,
      status: "รออนุมัติ",
    });
    setSubmitted(true);
    setShowToast(true);
    void purpose;
  };
  return (
    <div>
      <PageHeader
        title="รายละเอียดอุปกรณ์"
        description="ตรวจสอบข้อมูลและส่งคำขอยืมอุปกรณ์"
        action={
          <Link
            to="/equipment"
            className="text-sm font-semibold text-teal-700 hover:underline"
          >
            กลับไปหน้าอุปกรณ์
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="grid h-36 w-full shrink-0 place-items-center rounded bg-slate-100 text-2xl font-bold text-slate-400 sm:w-44">
              EQ
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {equipment.code}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {equipment.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                หมวดหมู่: {equipment.category}
              </p>
              <div className="mt-4">
                <StatusBadge
                  status={equipment.status}
                  tone={
                    equipment.status === "พร้อมใช้งาน" ? "success" : "warning"
                  }
                />
              </div>
            </div>
          </div>
          <dl className="mt-8 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-slate-500">จำนวนทั้งหมด</dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {equipment.total} ชิ้น
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">พร้อมให้ยืม</dt>
              <dd className="mt-1 font-semibold text-teal-700">
                {equipment.available} ชิ้น
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">สถานที่จัดเก็บ</dt>
              <dd className="mt-1 font-semibold text-slate-800">
                {equipment.location}
              </dd>
            </div>
          </dl>
        </section>
        <section className="border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">ขอยืมอุปกรณ์</h2>
          {submitted ? (
            <div className="mt-6 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              ส่งคำขอยืมเรียบร้อยแล้ว เจ้าหน้าที่จะตรวจสอบคำขอของคุณ
            </div>
          ) : (
            <form className="mt-5 grid gap-4" onSubmit={submitRequest}>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                จำนวน
                <input
                  type="number"
                  min="1"
                  max={equipment.available}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                วันที่ต้องการยืม
                <input
                  type="date"
                  required
                  value={borrowDate}
                  onChange={(event) => setBorrowDate(event.target.value)}
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                กำหนดคืน
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                วัตถุประสงค์
                <textarea
                  required
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  rows={3}
                  placeholder="ระบุวัตถุประสงค์การใช้งาน"
                  className="rounded border border-slate-300 px-3 py-2 font-normal"
                />
              </label>
              <button
                type="submit"
                className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
              >
                ส่งคำขอยืม
              </button>
            </form>
          )}
        </section>
      </div>
      {showToast && (
        <Toast
          message="ส่งคำขอยืมเรียบร้อยแล้ว"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
