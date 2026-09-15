import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import BorrowEquipmentModal from "../../components/common/BorrowEquipmentModal";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Toast from "../../components/common/Toast";
import { mockEquipment, type EquipmentRecord } from "../../data/mockData";
import { addBorrowRequest } from "../../data/mockStore";
import { useAuth } from "../../hooks/useAuth";

export default function Equipment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentRecord | null>(null);
  const [toast, setToast] = useState("");
  const filtered = useMemo(
    () =>
      mockEquipment.filter(
        (item) =>
          (category === "ทั้งหมด" || item.category === category) &&
          `${item.code} ${item.name}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [search, category],
  );
  return (
    <div>
      <PageHeader
        title="อุปกรณ์"
        description="ค้นหาอุปกรณ์ที่พร้อมให้ยืมสำหรับการเรียนและการทำงาน"
      />
      <div className="mb-4 flex flex-col gap-3 border border-slate-200 bg-white p-4 md:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหารหัสหรือชื่ออุปกรณ์"
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
      </div>
      <DataTable
        headers={[
          "รูป",
          "รหัสอุปกรณ์",
          "ชื่ออุปกรณ์",
          "หมวดหมู่",
          "พร้อมให้ยืม",
          "สถานะ",
          "รายละเอียด",
        ]}
      >
        {filtered.map((item) => (
          <tr key={item.code} className="hover:bg-slate-50">
            <td className="px-4 py-3">
              <span className="grid h-10 w-10 place-items-center rounded bg-slate-100 text-xs font-bold text-slate-500">
                EQ
              </span>
            </td>
            <td className="px-4 py-3 font-medium text-slate-800">
              {item.code}
            </td>
            <td className="px-4 py-3 text-slate-700">
              {item.name}
              <span className="block text-xs text-slate-500">
                ทั้งหมด {item.total} ชิ้น
              </span>
            </td>
            <td className="px-4 py-3 text-slate-600">{item.category}</td>
            <td className="px-4 py-3 text-slate-600">{item.available} ชิ้น</td>
            <td className="px-4 py-3">
              <StatusBadge
                status={item.status}
                tone={item.status === "พร้อมใช้งาน" ? "success" : "warning"}
              />
            </td>
            <td className="whitespace-nowrap px-4 py-3">
              <Link
                to={`/equipment/${item.code}`}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                ดูรายละเอียด
              </Link>
              <button
                type="button"
                disabled={item.status !== "พร้อมใช้งาน" || item.available === 0}
                onClick={() => setSelectedEquipment(item)}
                className="ml-3 rounded bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                ยืมอุปกรณ์
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
      <BorrowEquipmentModal
        equipment={selectedEquipment}
        open={Boolean(selectedEquipment)}
        onClose={() => setSelectedEquipment(null)}
        onConfirm={({ quantity, borrowedDate, dueDate, purpose }) => {
          if (!selectedEquipment) return;
          addBorrowRequest({
            id: `BR-2026-${String(Date.now()).slice(-4)}`,
            borrower: user?.name ?? "ผู้ใช้งาน",
            borrowedDate,
            dueDate,
            items: selectedEquipment.name,
            quantity,
            purpose,
            status: "รออนุมัติ",
          });
          setSelectedEquipment(null);
          setToast("ส่งคำขอยืมเรียบร้อยแล้ว");
          window.setTimeout(() => navigate("/borrowings"), 500);
        }}
      />
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast("")} />
      )}
    </div>
  );
}
