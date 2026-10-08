export default function Badge({ children, variant = "default" }) {
  return (
    <span className={`badge ${variant}`}>
      <span className="badge-dot" />
      {children}
    </span>
  );
}
