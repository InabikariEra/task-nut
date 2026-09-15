import { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import Toast from "../../components/common/Toast";
import { mockBorrowRequests } from "../../data/mockData";
import { cancelBorrowRequest, getBorrowRequests } from "../../data/mockStore";

export default function Borrowings() {
  const [status, setStatus] = useState("ทั้งหมด");
  const [recordsSource, setRecordsSource] = useState(() =>
    getBorrowRequests().length ? getBorrowRequests() : mockBorrowRequests,
  );
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const records = recordsSource.filter(
    (record) => status === "ทั้งหมด" || record.status === status,
  );
  return (
    <div>
      <PageHeader
        title="การยืมอุปกรณ์"
        description="ติดตามคำขอ รายการที่กำลังยืม และประวัติการยืมของคุณ"
        action={
          <Link
            to="/equipment"
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            + ยืมอุปกรณ์
          </Link>
        }
      />
      <div className="mb-4 flex justify-end">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          <option>ทั้งหมด</option>
          <option>รออนุมัติ</option>
          <option>อนุมัติแล้ว</option>
          <option>ปฏิเสธ</option>
          <option>ยกเลิก</option>
        </select>
      </div>
      <DataTable
        headers={[
          "เลขที่คำขอ",
          "รายการอุปกรณ์",
          "วันที่ยืม",
          "กำหนดคืน",
          "จำนวน",
          "สถานะ",
          "การดำเนินการ",
        ]}
      >
        {records.map((record) => (
          <tr key={record.id} className="hover:bg-slate-50">
            <td className="px-4 py-3 font-medium text-slate-800">
              {record.id}
            </td>
            <td className="px-4 py-3 text-slate-700">{record.items}</td>
            <td className="px-4 py-3 text-slate-600">{record.borrowedDate}</td>
            <td className="px-4 py-3 text-slate-600">{record.dueDate}</td>
            <td className="px-4 py-3 text-slate-600">{record.quantity}</td>
            <td className="px-4 py-3">
              <StatusBadge
                status={record.status}
                tone={
                  record.status === "รออนุมัติ"
                    ? "warning"
                    : record.status === "ปฏิเสธ"
                      ? "danger"
                      : "success"
                }
              />
            </td>
            <td className="px-4 py-3">
              <button
                type="button"
                onClick={() => setDetailsId(record.id)}
                className="mr-3 text-xs font-semibold text-teal-700 hover:underline"
              >
                ดูรหัสการยืม
              </button>
              {(record.status === "รออนุมัติ" ||
                record.status === "อนุมัติแล้ว") && (
                <button
                  type="button"
                  onClick={() => setCancelId(record.id)}
                  className="text-xs font-semibold text-red-700 hover:underline"
                >
                  ยกเลิกการยืม
                </button>
              )}
            </td>
          </tr>
        ))}
      </DataTable>
      <ConfirmModal
        open={Boolean(detailsId)}
        title="รายละเอียดการยืม"
        description={`รหัสการยืม: ${detailsId}`}
        confirmLabel="ปิด"
        onCancel={() => setDetailsId(null)}
        onConfirm={() => setDetailsId(null)}
      />
      <ConfirmModal
        open={Boolean(cancelId)}
        title="ยืนยันยกเลิกการยืม"
        description={`คุณต้องการยกเลิกคำขอ ${cancelId} หรือไม่`}
        confirmLabel="ยืนยันยกเลิก"
        onCancel={() => setCancelId(null)}
        onConfirm={() => {
          if (!cancelId) return;
          cancelBorrowRequest(cancelId);
          setRecordsSource(getBorrowRequests());
          setCancelId(null);
          setToast("ยกเลิกการยืมเรียบร้อยแล้ว");
        }}
      />
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast("")} />
      )}
    </div>
  );
}
