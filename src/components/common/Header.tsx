import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "แดชบอร์ด",
  "/equipment": "อุปกรณ์",
  "/borrowings": "การยืมอุปกรณ์",
  "/fines": "ค่าปรับ",
  "/rooms": "จองห้องปฏิบัติการ",
  "/profile": "โปรไฟล์",
  "/staff/dashboard": "แดชบอร์ดเจ้าหน้าที่",
  "/staff/borrow-requests": "คำขอยืม",
  "/staff/returns": "การคืนอุปกรณ์",
  "/admin/dashboard": "แดชบอร์ดผู้ดูแลระบบ",
  "/admin/users": "จัดการผู้ใช้งาน",
  "/admin/equipment": "จัดการอุปกรณ์",
  "/admin/categories": "หมวดหมู่อุปกรณ์",
  "/admin/rooms": "จัดการห้องปฏิบัติการ",
  "/admin/reports": "รายงาน",
};

function getRoleLabel(role: string | undefined) {
  return role === "ADMIN"
    ? "ผู้ดูแลระบบ"
    : role === "STAFF"
      ? "เจ้าหน้าที่"
      : "นักเรียน / ผู้ใช้งาน";
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const initials =
    user?.name
      .split(" ")
      .map((part) => part[0])
      .join("") ?? "U";
  const pageTitle = pageTitles[location.pathname] ?? "ระบบยืม-คืนอุปกรณ์";

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden"
          aria-label="เปิดเมนู"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <p className="text-base font-semibold text-slate-800">{pageTitle}</p>
          <p className="hidden text-xs text-slate-500 sm:block">
            ระบบจัดการอุปกรณ์และห้องปฏิบัติการ
          </p>
        </div>
      </div>
      <div className="relative flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsProfileOpen((open) => !open)}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
          aria-expanded={isProfileOpen}
          aria-haspopup="menu"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
            {initials}
          </span>
          <span className="hidden min-w-0 sm:block">
            <strong className="block max-w-36 truncate text-sm font-semibold text-slate-800">
              {user?.name}
            </strong>
            <small className="block text-xs text-slate-500">
              {getRoleLabel(user?.role)}
            </small>
          </span>
          <svg
            className="hidden h-4 w-4 text-slate-400 sm:block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {isProfileOpen && (
          <div
            className="absolute right-0 top-12 z-30 w-48 animate-[fade-in_150ms_ease-out] rounded-md border border-slate-200 bg-white p-1 shadow-lg"
            role="menu"
          >
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                navigate("/profile");
              }}
              className="w-full rounded px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              role="menuitem"
            >
              ดูโปรไฟล์
            </button>
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                navigate("/profile");
              }}
              className="w-full rounded px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
              role="menuitem"
            >
              ตั้งค่า
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
              role="menuitem"
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
