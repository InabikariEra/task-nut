import { useMemo, useState } from "react";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Toast from "../../components/common/Toast";
import { type ReturnRecord } from "../../data/mockData";
import { completeReturn, getReturnRecords } from "../../data/mockStore";

export default function Returns() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ทั้งหมด");
  const [selected, setSelected] = useState<ReturnRecord | null>(null);
  const [records, setRecords] = useState(() => getReturnRecords());
  const [condition, setCondition] = useState<"สภาพปกติ" | "ชำรุด" | "สูญหาย">(
    "สภาพปกติ",
  );
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");
  const filtered = useMemo(
    () =>
      records.filter(
        (record) =>
          (status === "ทั้งหมด" || record.status === status) &&
          `${record.id} ${record.borrower} ${record.equipment}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [records, search, status],
  );
  const confirmReturn = () => {
    if (!selected) return;
    completeReturn(selected.id, condition, note);
    setRecords(getReturnRecords());
    setSelected(null);
    setNote("");
    setCondition("สภาพปกติ");
    setToast("รับคืนอุปกรณ์และบันทึกข้อมูลแล้ว");
  };
  return (
    <div>
      <PageHeader
        title="การคืนอุปกรณ์"
        description="รับคืน ตรวจสอบสภาพ และบันทึกค่าปรับเบื้องต้น"
      />
      <div className="mb-4 flex flex-col gap-3 border border-slate-200 bg-white p-4 md:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาเลขที่รายการ ผู้ยืม หรืออุปกรณ์"
          className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700"
        >
          <option>ทั้งหมด</option>
          <option>รอคืน</option>
          <option>รับคืนแล้ว</option>
          <option>เกินกำหนด</option>
        </select>
        <input
          type="date"
          className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-600"
          aria-label="กรองตามวันที่"
        />
      </div>
      <DataTable
        headers={[
          "เลขที่รายการ",
          "ผู้ยืม",
          "อุปกรณ์",
          "วันที่ยืม",
          "กำหนดคืน",
          "วันที่คืน",
          "สถานะ",
          "ค่าปรับ",
          "การดำเนินการ",
        ]}
      >
        {filtered.map((record) => (
          <tr key={record.id} className="hover:bg-slate-50">
            <td className="px-4 py-3 font-medium text-slate-800">
              {record.id}
            </td>
            <td className="px-4 py-3 text-slate-700">{record.borrower}</td>
            <td className="px-4 py-3 text-slate-600">{record.equipment}</td>
            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
              {record.borrowedDate}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
              {record.dueDate}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
              {record.returnedDate}
            </td>
            <td className="px-4 py-3">
              <StatusBadge
                status={record.status}
                tone={
                  record.status === "เกินกำหนด"
                    ? "danger"
                    : record.status === "รอคืน"
                      ? "warning"
                      : "success"
                }
              />
            </td>
            <td className="px-4 py-3 text-slate-700">{record.fine}</td>
            <td className="px-4 py-3">
              {record.status === "รอคืน" && (
                <button
                  type="button"
                  onClick={() => setSelected(record)}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  รับคืน
                </button>
              )}
            </td>
          </tr>
        ))}
      </DataTable>
      <ConfirmModal
        open={Boolean(selected)}
        title="ยืนยันรับคืนอุปกรณ์"
        description={`ตรวจสอบข้อมูลการคืนของ ${selected?.borrower} รายการ ${selected?.equipment}`}
        confirmLabel="ยืนยันรับคืน"
        onCancel={() => setSelected(null)}
        onConfirm={confirmReturn}
      >
        <div className="mt-4 grid gap-3 rounded bg-slate-50 p-3 text-sm text-slate-600">
          <p>
            <strong>จำนวน:</strong> 1 ชิ้น
          </p>
          <p>
            <strong>กำหนดคืน:</strong> {selected?.dueDate}
          </p>
          <label className="grid gap-1">
            <span className="font-medium">สภาพอุปกรณ์</span>
            <select
              value={condition}
              onChange={(event) =>
                setCondition(event.target.value as typeof condition)
              }
              className="rounded border border-slate-300 bg-white px-2 py-2"
            >
              <option>สภาพปกติ</option>
              <option>ชำรุด</option>
              <option>สูญหาย</option>
            </select>
          </label>
          <label className="grid gap-1">
            <span className="font-medium">หมายเหตุ</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-2"
              rows={2}
              placeholder="ระบุหมายเหตุเพิ่มเติม"
            />
          </label>
          <p className="font-semibold text-amber-700">ค่าปรับจำลอง: ฿0</p>
        </div>
      </ConfirmModal>
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast("")} />
      )}
    </div>
  );
}
