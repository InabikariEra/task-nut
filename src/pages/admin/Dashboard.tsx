import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";
import {
  mockBorrowRequests,
  mockEquipment,
  mockReturnRecords,
} from "../../data/mockData";

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="แดชบอร์ดผู้ดูแลระบบ"
        description="ภาพรวมการใช้งานอุปกรณ์และห้องปฏิบัติการของสถานศึกษา"
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="ผู้ใช้งานทั้งหมด"
          value="1,248"
          detail="เพิ่มขึ้น 24 คนเดือนนี้"
          tone="blue"
        />
        <StatCard
          label="อุปกรณ์ทั้งหมด"
          value="86"
          detail="พร้อมใช้งาน 68 ชิ้น"
          tone="teal"
        />
        <StatCard
          label="อุปกรณ์กำลังถูกยืม"
          value="42"
          detail="คิดเป็น 49% ของทั้งหมด"
          tone="amber"
        />
        <StatCard
          label="คำขอยืมรออนุมัติ"
          value="08"
          detail="รายการใหม่วันนี้ 3 รายการ"
          tone="amber"
        />
        <StatCard
          label="รายการเกินกำหนด"
          value="03"
          detail="ต้องติดตามภายในวันนี้"
          tone="red"
        />
        <StatCard
          label="ค่าปรับค้างชำระ"
          value="฿1,240"
          detail="จากผู้ใช้งาน 7 คน"
          tone="red"
        />
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-slate-900">คำขอยืมล่าสุด</h2>
            <p className="text-sm text-slate-500">รายการล่าสุดจากผู้ใช้งาน</p>
          </div>
          <DataTable headers={["เลขที่คำขอ", "ผู้ยืม", "รายการ", "สถานะ"]}>
            {mockBorrowRequests.slice(0, 3).map((request) => (
              <tr key={request.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {request.id}
                </td>
                <td className="px-4 py-3 text-slate-700">{request.borrower}</td>
                <td className="px-4 py-3 text-slate-600">{request.items}</td>
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
        </section>
        <section>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-slate-900">
              อุปกรณ์ที่ถูกยืมบ่อย
            </h2>
            <p className="text-sm text-slate-500">
              สรุปจากการใช้งานในภาคเรียนนี้
            </p>
          </div>
          <div className="divide-y divide-slate-100 border border-slate-200 bg-white">
            {mockEquipment.slice(0, 3).map((item, index) => (
              <div key={item.code} className="flex items-center gap-3 p-4">
                <span className="grid h-8 w-8 place-items-center rounded bg-slate-100 text-sm font-bold text-slate-600">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500">{item.category}</p>
                </div>
                <span className="text-sm font-semibold text-teal-700">
                  {[38, 31, 24][index]} ครั้ง
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-6">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-slate-900">รายการเกินกำหนด</h2>
          <p className="text-sm text-slate-500">รายการที่ต้องติดตาม</p>
        </div>
        <DataTable headers={["ผู้ยืม", "อุปกรณ์", "กำหนดคืน", "ค่าปรับ"]}>
          {mockReturnRecords
            .filter((record) => record.status === "เกินกำหนด")
            .map((record) => (
              <tr key={record.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-700">{record.borrower}</td>
                <td className="px-4 py-3 text-slate-600">{record.equipment}</td>
                <td className="px-4 py-3 text-slate-600">{record.dueDate}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={record.fine} tone="danger" />
                </td>
              </tr>
            ))}
        </DataTable>
      </section>
    </div>
  );
}
