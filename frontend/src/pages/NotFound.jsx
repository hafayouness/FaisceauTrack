import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 20,
      }}
    >
      <h1
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: "var(--color-primary-600)",
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
        La page que vous cherchez n'existe pas.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <Home size={16} />
        Retour à l'accueil
      </Link>
    </div>
  );
}
