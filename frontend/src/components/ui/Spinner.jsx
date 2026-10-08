export default function Spinner({ size = "md", text }) {
  return (
    <div className="loading-page">
      <div className={`spinner ${size === "lg" ? "lg" : ""}`} />
      {text && <p>{text}</p>}
    </div>
  );
}
