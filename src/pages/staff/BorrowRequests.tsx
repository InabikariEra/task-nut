import { useMemo, useState } from "react";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Toast from "../../components/common/Toast";
import { type BorrowRequest } from "../../data/mockData";
import { getBorrowRequests, updateBorrowRequest } from "../../data/mockStore";

const toneForStatus = (status: string) =>
  status === "รออนุมัติ"
    ? "warning"
    : status === "ปฏิเสธ"
      ? "danger"
      : status === "ยกเลิก"
        ? "neutral"
        : "success";

export default function BorrowRequests() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ทั้งหมด");
  const [selected, setSelected] = useState<BorrowRequest | null>(null);
  const [modalAction, setModalAction] = useState<"อนุมัติ" | "ปฏิเสธ">(
    "อนุมัติ",
  );
  const [requests, setRequests] = useState(() => getBorrowRequests());
  const [toast, setToast] = useState("");
  const filtered = useMemo(
    () =>
      requests.filter(
        (request) =>
          (status === "ทั้งหมด" || request.status === status) &&
          `${request.id} ${request.borrower} ${request.items}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [requests, search, status],
  );
  const confirmAction = () => {
    if (!selected) return;
    updateBorrowRequest(
      selected.id,
      modalAction === "อนุมัติ" ? "อนุมัติแล้ว" : "ปฏิเสธ",
    );
    setRequests(getBorrowRequests());
    setSelected(null);
    setToast(`${modalAction}คำขอ ${selected.id} เรียบร้อยแล้ว`);
  };
  return (
    <div>
      <PageHeader
        title="คำขอยืมอุปกรณ์"
        description="ตรวจสอบและจัดการคำขอยืมจากนักเรียนและผู้ใช้งาน"
      />
      <div className="mb-4 flex flex-col gap-3 border border-slate-200 bg-white p-4 md:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาเลขที่คำขอ ผู้ยืม หรืออุปกรณ์"
          className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-700"
        >
          <option>ทั้งหมด</option>
          <option>รออนุมัติ</option>
          <option>อนุมัติแล้ว</option>
          <option>ปฏิเสธ</option>
          <option>ยกเลิก</option>
        </select>
        <input
          type="date"
          className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-600"
          aria-label="กรองตามวันที่"
        />
      </div>
      <DataTable
        headers={[
          "เลขที่คำขอ",
          "ผู้ยืม",
          "วันที่ยืม",
          "กำหนดคืน",
          "รายการอุปกรณ์",
          "จำนวน",
          "สถานะ",
          "การดำเนินการ",
        ]}
      >
        {filtered.map((request) => (
          <tr key={request.id} className="hover:bg-slate-50">
            <td className="px-4 py-3 font-medium text-slate-800">
              {request.id}
            </td>
            <td className="px-4 py-3 text-slate-700">{request.borrower}</td>
            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
              {request.borrowedDate}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
              {request.dueDate}
            </td>
            <td className="px-4 py-3 text-slate-600">{request.items}</td>
            <td className="px-4 py-3 text-slate-600">{request.quantity}</td>
            <td className="px-4 py-3">
              <StatusBadge
                status={request.status}
                tone={toneForStatus(request.status)}
              />
            </td>
            <td className="whitespace-nowrap px-4 py-3">
              <button
                type="button"
                className="mr-3 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                รายละเอียด
              </button>
              {request.status === "รออนุมัติ" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(request);
                      setModalAction("อนุมัติ");
                    }}
                    className="mr-3 text-xs font-semibold text-teal-700 hover:underline"
                  >
                    อนุมัติ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(request);
                      setModalAction("ปฏิเสธ");
                    }}
                    className="text-xs font-semibold text-red-700 hover:underline"
                  >
                    ปฏิเสธ
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </DataTable>
      <ConfirmModal
        open={Boolean(selected)}
        title={`${modalAction}คำขอยืม`}
        description={`ยืนยันการ${modalAction}คำขอ ${selected?.id} ของ ${selected?.borrower} หรือไม่`}
        confirmLabel={modalAction}
        onCancel={() => setSelected(null)}
        onConfirm={confirmAction}
      />
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast("")} />
      )}
    </div>
  );
}
