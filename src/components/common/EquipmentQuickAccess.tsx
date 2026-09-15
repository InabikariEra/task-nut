import { Link } from "react-router-dom";

interface EquipmentQuickAccessProps {
  name: string;
  category: string;
  availability: string;
  icon: string;
  tone: "teal" | "amber" | "blue";
}

export default function EquipmentQuickAccess({
  name,
  category,
  availability,
  icon,
  tone,
}: EquipmentQuickAccessProps) {
  return (
    <Link className="equipment-quick-card" to="/equipment">
      <span className={`equipment-icon ${tone}-bg`}>{icon}</span>
      <span className="equipment-quick-copy">
        <strong>{name}</strong>
        <small>{category}</small>
      </span>
      <span className="equipment-availability">{availability}</span>
      <span className="quick-arrow" aria-hidden="true">
        &rarr;
      </span>
    </Link>
  );
}
