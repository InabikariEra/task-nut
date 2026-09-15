import AppLayout from "./AppLayout";

const userNavigation = [
  { label: "แดชบอร์ด", path: "/dashboard", icon: "grid" },
  { label: "อุปกรณ์", path: "/equipment", icon: "box" },
  { label: "การยืมอุปกรณ์", path: "/borrowings", icon: "swap" },
  { label: "ค่าปรับ", path: "/fines", icon: "receipt" },
  { label: "จองห้องปฏิบัติการ", path: "/rooms", icon: "room" },
  { label: "โปรไฟล์", path: "/profile", icon: "user" },
];

export default function UserLayout() {
  return <AppLayout navItems={userNavigation} />;
}
