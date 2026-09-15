import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { NavItem } from "../../types";

interface SidebarProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    box: "M4 7.5 12 3l8 4.5v9L12 21l-8-4.5zM4 7.5l8 4.5 8-4.5M12 12v9",
    swap: "M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3-3m-3 3 3 3",
    receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
    room: "M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M8 21v-5h8v5M9 8h.01M15 8h.01",
    user: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
    users:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    chart: "M4 19V5M4 19h17M8 16v-4M12 16V8M16 16v-7M20 16v-3",
  };
  return (
    <svg
      className="h-5 w-5 shrink-0 fill-none stroke-current stroke-[1.7]"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={paths[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Sidebar({ items, isOpen, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initials =
    user?.name
      .split(" ")
      .map((part) => part[0])
      .join("") ?? "U";

  const handleSignOut = () => {
    signOut();
    onClose();
    navigate("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/35 transition-opacity md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-xl transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="เมนูหลัก"
      >
        <div className="flex items-center gap-3 px-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-teal-700 font-bold text-white">
            B
          </span>
          <span className="font-[Space_Grotesk] text-lg font-bold text-slate-800">
            BorrowDesk
          </span>
        </div>
        <p className="mt-10 px-3 text-[11px] font-bold tracking-[0.14em] text-slate-400">
          เมนูหลัก
        </p>
        <nav className="mt-3 flex-1 space-y-1" aria-label="เมนูระบบ">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${isActive ? "bg-teal-50 font-semibold text-teal-800 before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:bg-teal-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`
              }
            >
              <Icon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 px-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role === "ADMIN"
                  ? "ผู้ดูแลระบบ"
                  : user?.role === "STAFF"
                    ? "เจ้าหน้าที่"
                    : "นักเรียน / ผู้ใช้งาน"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>
    </>
  );
}
