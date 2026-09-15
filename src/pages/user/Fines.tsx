import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";

const fines = [
  {
    id: "FN-2026-003",
    item: "Projector Epson",
    reason: "คืนอุปกรณ์ล่าช้า 5 วัน",
    amount: "฿100",
    status: "ยังไม่ชำระ",
    date: "09 ก.ย. 2569",
  },
  {
    id: "FN-2026-001",
    item: "HDMI Cable",
    reason: "คืนอุปกรณ์ล่าช้า 2 วัน",
    amount: "฿40",
    status: "ชำระแล้ว",
    date: "15 ส.ค. 2569",
  },
];

export default function Fines() {
  return (
    <div>
      <PageHeader
        title="ค่าปรับ"
        description="ตรวจสอบค่าปรับและประวัติการชำระเงินของคุณ"
      />
      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <StatCard
          label="ค่าปรับค้างชำระ"
          value="฿100"
          detail="กรุณาติดต่อชำระเงินที่เคาน์เตอร์"
          tone="red"
        />
        <StatCard
          label="ชำระแล้วทั้งหมด"
          value="฿40"
          detail="ในปีการศึกษานี้"
          tone="green"
        />
      </section>
      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">ประวัติค่าปรับ</h2>
            <p className="mt-1 text-sm text-slate-500">
              ตรวจสอบรายการและสถานะการชำระเงิน
            </p>
          </div>
          <span className="text-xs text-slate-500">{fines.length} รายการ</span>
        </div>
        <div className="hidden md:block">
          <DataTable
            headers={[
              "เลขที่",
              "อุปกรณ์",
              "สาเหตุ",
              "จำนวนเงิน",
              "สถานะ",
              "วันที่",
            ]}
          >
            {fines.map((fine) => (
              <tr key={fine.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {fine.id}
                </td>
                <td className="px-4 py-3 text-slate-700">{fine.item}</td>
                <td className="px-4 py-3 text-slate-600">{fine.reason}</td>
                <td className="px-4 py-3 font-semibold text-slate-700">
                  {fine.amount}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={fine.status}
                    tone={fine.status === "ยังไม่ชำระ" ? "danger" : "success"}
                  />
                </td>
                <td className="px-4 py-3 text-slate-600">{fine.date}</td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div className="divide-y divide-slate-100 border border-slate-200 bg-white md:hidden">
          {fines.map((fine) => (
            <article key={fine.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {fine.item}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {fine.id} · {fine.date}
                  </p>
                </div>
                <StatusBadge
                  status={fine.status}
                  tone={fine.status === "ยังไม่ชำระ" ? "danger" : "success"}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">{fine.reason}</span>
                <strong className="text-slate-800">{fine.amount}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
