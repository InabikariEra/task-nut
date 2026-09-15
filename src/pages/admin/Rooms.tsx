import { useMemo, useState } from "react";
import ConfirmModal from "../../components/common/ConfirmModal";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { mockRooms } from "../../data/mockData";

export default function Rooms() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = useMemo(
    () =>
      mockRooms.filter((room) =>
        `${room.code} ${room.name} ${room.building}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );
  return (
    <div>
      <PageHeader
        title="จัดการห้องปฏิบัติการ"
        description="จัดการข้อมูลห้อง ความจุ และสถานะการเปิดใช้งาน"
        action={
          <button
            type="button"
            className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            + เพิ่มห้อง
          </button>
        }
      />
      <div className="mb-4 flex gap-3 border border-slate-200 bg-white p-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหารหัสห้อง ชื่อห้อง หรืออาคาร"
          className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
        />
        <select className="rounded border border-slate-300 px-3 py-2 text-sm">
          <option>ทุกสถานะ</option>
          <option>พร้อมใช้งาน</option>
          <option>ปิดปรับปรุง</option>
        </select>
      </div>
      <DataTable
        headers={[
          "รหัสห้อง",
          "ชื่อห้อง",
          "อาคาร",
          "ชั้น",
          "ความจุ",
          "สถานะ",
          "การดำเนินการ",
        ]}
      >
        {filtered.map((room) => (
          <tr key={room.code} className="hover:bg-slate-50">
            <td className="px-4 py-3 font-medium text-slate-800">
              {room.code}
            </td>
            <td className="px-4 py-3 text-slate-700">{room.name}</td>
            <td className="px-4 py-3 text-slate-600">{room.building}</td>
            <td className="px-4 py-3 text-slate-600">{room.floor}</td>
            <td className="px-4 py-3 text-slate-600">{room.capacity} คน</td>
            <td className="px-4 py-3">
              <StatusBadge
                status={room.status}
                tone={room.status === "พร้อมใช้งาน" ? "success" : "warning"}
              />
            </td>
            <td className="whitespace-nowrap px-4 py-3">
              <button
                type="button"
                className="mr-3 text-xs font-semibold text-slate-600"
              >
                ดู
              </button>
              <button
                type="button"
                className="mr-3 text-xs font-semibold text-teal-700"
              >
                แก้ไข
              </button>
              <button
                type="button"
                onClick={() => setSelected(room.name)}
                className="text-xs font-semibold text-red-700"
              >
                ลบ
              </button>
            </td>
          </tr>
        ))}
      </DataTable>
      <ConfirmModal
        open={Boolean(selected)}
        title="ยืนยันการลบห้อง"
        description={`คุณต้องการลบ ${selected} หรือไม่`}
        confirmLabel="ยืนยันการลบ"
        onCancel={() => setSelected(null)}
        onConfirm={() => setSelected(null)}
      />
    </div>
  );
}
