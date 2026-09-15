import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { mockRooms } from "../../data/mockData";

export default function Rooms() {
  const [search, setSearch] = useState("");
  const rooms = mockRooms.filter((room) =>
    `${room.code} ${room.name} ${room.building}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div>
      <PageHeader
        title="จองห้องปฏิบัติการ"
        description="ค้นหาและส่งคำขอจองห้องสำหรับการเรียนหรือกิจกรรม"
      />
      <div className="mb-4 flex gap-3 border border-slate-200 bg-white p-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาชื่อห้อง อาคาร หรือรหัสห้อง"
          className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-700"
        />
        <input
          type="date"
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          aria-label="วันที่ต้องการจอง"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {rooms.map((room) => (
          <article
            key={room.code}
            className="border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {room.code}
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {room.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {room.building} · ชั้น {room.floor} · รองรับ {room.capacity}{" "}
                  คน
                </p>
              </div>
              <StatusBadge
                status={room.status}
                tone={room.status === "พร้อมใช้งาน" ? "success" : "warning"}
              />
            </div>
            <button
              type="button"
              disabled={room.status !== "พร้อมใช้งาน"}
              className="mt-5 w-full rounded border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-700 enabled:hover:bg-teal-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              จองห้องนี้
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
