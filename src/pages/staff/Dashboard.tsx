import { Link } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { mockBorrowRequests, mockReturnRecords } from "../../data/mockData";

const toneForStatus = (status: string) =>
  status === "รออนุมัติ" || status === "รอคืน"
    ? "warning"
    : status === "ปฏิเสธ" || status === "เกินกำหนด"
      ? "danger"
      : "success";

export default function Dashboard() {
  const overdue = mockReturnRecords.filter(
    (record) => record.status === "เกินกำหนด",
  );
  return (
    <div>
      <PageHeader
        title="แดชบอร์ดเจ้าหน้าที่"
        description="ภาพรวมงานยืม-คืนอุปกรณ์ที่ต้องดำเนินการวันนี้"
        action={
          <Link
            to="/staff/borrow-requests"
            className="inline-flex rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            ดูคำขอยืมทั้งหมด
          </Link>
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="คำขอยืมรออนุมัติ"
          value="08"
          detail="รายการที่ต้องตรวจสอบ"
          tone="amber"
        />
        <StatCard
          label="อุปกรณ์กำลังถูกยืม"
          value="42"
          detail="จากอุปกรณ์ทั้งหมด 86 ชิ้น"
          tone="teal"
        />
        <StatCard
          label="รายการเกินกำหนด"
          value="03"
          detail="ควรติดตามภายในวันนี้"
          tone="red"
        />
        <StatCard
          label="รายการรอคืน"
          value="12"
          detail="รอตรวจสอบสภาพอุปกรณ์"
          tone="blue"
        />
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                คำขอยืมล่าสุด
              </h2>
              <p className="text-sm text-slate-500">
                รายการที่รอการพิจารณาจากเจ้าหน้าที่
              </p>
            </div>
            <Link
              className="text-sm font-semibold text-teal-700 hover:text-teal-800"
              to="/staff/borrow-requests"
            >
              ดูทั้งหมด
            </Link>
          </div>
          <DataTable
            headers={[
              "ผู้ยืม",
              "วันที่ยืม",
              "กำหนดคืน",
              "จำนวน",
              "สถานะ",
              "การดำเนินการ",
            ]}
          >
            {mockBorrowRequests.slice(0, 3).map((request) => (
              <tr key={request.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {request.borrower}
                  <span className="block text-xs font-normal text-slate-500">
                    {request.id}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {request.borrowedDate}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {request.dueDate}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {request.quantity} ชิ้น
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={request.status}
                    tone={toneForStatus(request.status)}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    to="/staff/borrow-requests"
                    className="text-xs font-semibold text-teal-700 hover:underline"
                  >
                    ดูรายละเอียด
                  </Link>
                </td>
              </tr>
            ))}
          </DataTable>
        </section>
        <section>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-slate-900">
              รายการเกินกำหนด
            </h2>
            <p className="text-sm text-slate-500">
              รายการที่ควรติดตามและประสานผู้ยืม
            </p>
          </div>
          <div className="divide-y divide-slate-100 border border-slate-200 bg-white">
            {overdue.map((record) => (
              <div key={record.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {record.borrower}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {record.equipment}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      กำหนดคืน {record.dueDate} · เกินกำหนด 5 วัน
                    </p>
                  </div>
                  <StatusBadge
                    status={`ค่าปรับ ${record.fine}`}
                    tone="danger"
                  />
                </div>
              </div>
            ))}
            {overdue.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-500">
                ไม่มีรายการเกินกำหนด
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
