import AppLayout from "./AppLayout";

const adminNavigation = [
  { label: "แดชบอร์ด", path: "/admin/dashboard", icon: "grid" },
  { label: "จัดการผู้ใช้งาน", path: "/admin/users", icon: "users" },
  { label: "จัดการอุปกรณ์", path: "/admin/equipment", icon: "box" },
  { label: "หมวดหมู่อุปกรณ์", path: "/admin/categories", icon: "grid" },
  { label: "จัดการห้องปฏิบัติการ", path: "/admin/rooms", icon: "room" },
  { label: "รายงาน", path: "/admin/reports", icon: "chart" },
];

export default function AdminLayout() {
  return <AppLayout navItems={adminNavigation} />;
}
