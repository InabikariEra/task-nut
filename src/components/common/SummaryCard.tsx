interface SummaryCardProps {
  label: string;
  value: string;
  detail: string;
  tone: "teal" | "amber" | "blue" | "green";
}

export default function SummaryCard({
  label,
  value,
  detail,
  tone,
}: SummaryCardProps) {
  return (
    <article className={`stat-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
