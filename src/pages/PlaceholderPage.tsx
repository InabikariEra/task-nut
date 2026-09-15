import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PlaceholderPageProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export default function PlaceholderPage({
  title: pageTitle,
  description = "ยังไม่มีข้อมูลสำหรับหน้านี้",
  action,
  children,
}: PlaceholderPageProps) {
  const location = useLocation();
  const routeTitle =
    location.pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ??
    "หน้าเว็บ";
  const title = pageTitle ?? routeTitle;
  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
          BorrowDesk
        </p>
        <h1 className="text-2xl font-bold capitalize text-slate-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children ?? (
        <div className="border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-medium text-slate-700">ยังไม่มีรายการ</p>
          <p className="mt-1 text-sm text-slate-500">
            เมื่อมีข้อมูล ระบบจะแสดงรายละเอียดในหน้านี้
          </p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      )}
    </div>
  );
}
