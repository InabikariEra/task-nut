import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <span
        className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500"
        aria-hidden="true"
      >
        —
      </span>
      <h2 className="mt-4 text-base font-semibold text-slate-800">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
