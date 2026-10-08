import { Menu, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUiStore } from "../../store/uiStore";
import { initials } from "../../utils/formatters";

export default function Topbar() {
  const { user, logout } = useAuth();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-toggle"
          onClick={toggleSidebar}
          title="Réduire / agrandir"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="topbar-right">
        <div
          className="topbar-user"
          ref={menuRef}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <div className="avatar">{initials(user?.name)}</div>
          <div style={{ fontSize: 13 }}>
            <div style={{ fontWeight: 600 }}>{user?.name}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 11 }}>
              {user?.email}
            </div>
          </div>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: 56,
                right: 0,
                background: "white",
                border: "1px solid var(--border-color)",
                borderRadius: 10,
                boxShadow: "var(--shadow-lg)",
                minWidth: 200,
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <button
                className="sidebar-link"
                style={{
                  color: "var(--text-primary)",
                  width: "100%",
                  borderRadius: 0,
                }}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
              >
                <User size={16} /> Mon profil
              </button>
              <button
                className="sidebar-link"
                style={{
                  color: "var(--color-danger)",
                  width: "100%",
                  borderRadius: 0,
                }}
                onClick={logout}
              >
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
