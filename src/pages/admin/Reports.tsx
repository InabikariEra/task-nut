import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";

const reportRows = [
  {
    id: "BR-2026-0018",
    borrower: "สมชาย ใจดี",
    equipment: "Notebook Lenovo",
    category: "คอมพิวเตอร์",
    borrowed: "10 ก.ย. 2569",
    returned: "-",
    status: "กำลังยืม",
  },
  {
    id: "BR-2026-0017",
    borrower: "สมหญิง ใจงาม",
    equipment: "Projector Epson",
    category: "โสตทัศนูปกรณ์",
    borrowed: "09 ก.ย. 2569",
    returned: "09 ก.ย. 2569",
    status: "คืนแล้ว",
  },
  {
    id: "BR-2026-0016",
    borrower: "กิตติพงษ์ ทองดี",
    equipment: "Arduino UNO",
    category: "อิเล็กทรอนิกส์",
    borrowed: "08 ก.ย. 2569",
    returned: "-",
    status: "เกินกำหนด",
  },
];

export default function Reports() {
  return (
    <div>
      <PageHeader
        title="รายงาน"
        description="ดูภาพรวมและค้นหาข้อมูลการยืม-คืนตามช่วงเวลาที่ต้องการ"
      />
      <section className="border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            ประเภทรายงาน
            <select className="rounded border border-slate-300 px-3 py-2 font-normal">
              <option>รายงานการยืม-คืน</option>
              <option>รายงานอุปกรณ์</option>
              <option>รายงานค่าปรับ</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            วันที่เริ่มต้น
            <input
              type="date"
              className="rounded border border-slate-300 px-3 py-2 font-normal"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            วันที่สิ้นสุด
            <input
              type="date"
              className="rounded border border-slate-300 px-3 py-2 font-normal"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            สถานะ
            <select className="rounded border border-slate-300 px-3 py-2 font-normal">
              <option>ทั้งหมด</option>
              <option>กำลังยืม</option>
              <option>คืนแล้ว</option>
              <option>เกินกำหนด</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            ค้นหารายงาน
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            รีเซ็ต
          </button>
        </div>
      </section>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="จำนวนรายการยืม"
          value="248"
          detail="ในช่วงเวลาที่เลือก"
          tone="teal"
        />
        <StatCard
          label="จำนวนรายการคืน"
          value="192"
          detail="คืนตรงเวลา 94%"
          tone="blue"
        />
        <StatCard
          label="รายการเกินกำหนด"
          value="12"
          detail="ต้องติดตาม"
          tone="red"
        />
        <StatCard
          label="ค่าปรับรวม"
          value="฿3,420"
          detail="จากรายการทั้งหมด"
          tone="amber"
        />
      </section>
      <section className="mt-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              ผลรายงานการยืม-คืน
            </h2>
            <p className="text-sm text-slate-500">
              ข้อมูลตัวอย่างสำหรับเตรียมเชื่อมต่อระบบรายงาน
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              ส่งออก Excel
            </button>
            <button
              type="button"
              className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              ส่งออก PDF
            </button>
          </div>
        </div>
        <DataTable
          headers={[
            "เลขที่รายการ",
            "ผู้ยืม",
            "อุปกรณ์",
            "หมวดหมู่",
            "วันที่ยืม",
            "วันที่คืน",
            "สถานะ",
          ]}
        >
          {reportRows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{row.id}</td>
              <td className="px-4 py-3 text-slate-700">{row.borrower}</td>
              <td className="px-4 py-3 text-slate-600">{row.equipment}</td>
              <td className="px-4 py-3 text-slate-600">{row.category}</td>
              <td className="px-4 py-3 text-slate-600">{row.borrowed}</td>
              <td className="px-4 py-3 text-slate-600">{row.returned}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  status={row.status}
                  tone={
                    row.status === "เกินกำหนด"
                      ? "danger"
                      : row.status === "กำลังยืม"
                        ? "warning"
                        : "success"
                  }
                />
              </td>
            </tr>
          ))}
        </DataTable>
      </section>
    </div>
  );
}
