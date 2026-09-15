import { Link } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import { mockBorrowRequests, mockEquipment } from "../../data/mockData";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader
        title={`สวัสดี, ${user?.name ?? "ผู้ใช้งาน"}`}
        description="สรุปสถานะการยืมอุปกรณ์และการใช้บริการของคุณ"
        action={
          <Link
            to="/equipment"
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            + ยืมอุปกรณ์
          </Link>
        }
      />
      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="อุปกรณ์ที่กำลังยืม"
          value="03"
          detail="อุปกรณ์อยู่กับคุณ"
          tone="teal"
        />
        <StatCard
          label="ใกล้ถึงกำหนดคืน"
          value="01"
          detail="ภายใน 7 วัน"
          tone="amber"
        />
        <StatCard
          label="รายการที่คืนแล้ว"
          value="18"
          detail="ปีการศึกษานี้"
          tone="blue"
        />
        <StatCard
          label="ค่าปรับค้างชำระ"
          value="฿0"
          detail="ไม่มีค่าปรับค้างชำระ"
          tone="green"
        />
      </section>
      <div className="mt-7 grid gap-7 xl:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                รายการยืมล่าสุด
              </h2>
              <p className="text-sm text-slate-500">ติดตามสถานะคำขอของคุณ</p>
            </div>
            <Link
              to="/borrowings"
              className="shrink-0 text-xs font-semibold text-teal-700 hover:underline sm:text-sm"
            >
              ดูประวัติทั้งหมด
            </Link>
          </div>
          <div className="hidden md:block">
            <DataTable
              headers={["รายการอุปกรณ์", "วันที่ยืม", "กำหนดคืน", "สถานะ"]}
            >
              {mockBorrowRequests.slice(0, 3).map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {request.items}
                    <span className="block text-xs font-normal text-slate-500">
                      {request.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {request.borrowedDate}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {request.dueDate}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={request.status}
                      tone={
                        request.status === "รออนุมัติ" ? "warning" : "success"
                      }
                    />
                  </td>
                </tr>
              ))}
            </DataTable>
          </div>
          <div className="divide-y divide-slate-100 border border-slate-200 bg-white md:hidden">
            {mockBorrowRequests.slice(0, 3).map((request) => (
              <div
                key={request.id}
                className="flex items-start justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {request.items}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    คืนภายใน {request.dueDate}
                  </p>
                </div>
                <StatusBadge
                  status={request.status}
                  tone={request.status === "รออนุมัติ" ? "warning" : "success"}
                />
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              อุปกรณ์ที่พร้อมให้ยืม
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm">
              เลือกดูรายละเอียดและส่งคำขอ
            </p>
          </div>
          <div className="divide-y divide-slate-100 border border-slate-200 bg-white shadow-sm">
            {mockEquipment.slice(0, 3).map((item) => (
              <Link
                key={item.code}
                to={`/equipment/${item.code}`}
                className="block p-4 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.category}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-teal-700">
                    พร้อม {item.available} ชิ้น
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
