import type { ReactNode } from "react";

interface DataTableProps {
  headers: string[];
  children: ReactNode;
  emptyMessage?: string;
}

export default function DataTable({
  headers,
  children,
  emptyMessage = "ยังไม่มีข้อมูล",
}: DataTableProps) {
  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-600"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 [&>tr]:transition-colors [&>tr:hover]:bg-slate-50">
          {children || (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-12 text-center text-sm text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
