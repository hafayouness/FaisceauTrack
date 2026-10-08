import { Inbox } from "lucide-react";

export default function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}) {
  return (
    <div className="empty-state">
      <Icon size={48} strokeWidth={1.5} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
