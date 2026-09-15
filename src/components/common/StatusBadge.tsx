interface StatusBadgeProps {
  status: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

const toneClasses = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-sky-50 text-sky-700",
};

export default function StatusBadge({
  status,
  tone = "neutral",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {status}
    </span>
  );
}
