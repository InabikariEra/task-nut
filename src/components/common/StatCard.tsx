interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  tone?: "teal" | "amber" | "red" | "blue" | "green" | "slate";
}

const toneClasses = {
  teal: "border-l-teal-700",
  amber: "border-l-amber-500",
  red: "border-l-red-500",
  blue: "border-l-sky-600",
  green: "border-l-emerald-600",
  slate: "border-l-slate-500",
};

export default function StatCard({
  label,
  value,
  detail,
  tone = "slate",
}: StatCardProps) {
  return (
    <article
      className={`border border-slate-200 border-l-4 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm ${toneClasses[tone]}`}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </article>
  );
}
