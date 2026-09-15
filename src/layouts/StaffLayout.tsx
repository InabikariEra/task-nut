import AppLayout from "./AppLayout";

const staffNavigation = [
  { label: "แดชบอร์ด", path: "/staff/dashboard", icon: "grid" },
  { label: "คำขอยืม", path: "/staff/borrow-requests", icon: "swap" },
  { label: "การคืนอุปกรณ์", path: "/staff/returns", icon: "receipt" },
];

export default function StaffLayout() {
  return <AppLayout navItems={staffNavigation} />;
}
