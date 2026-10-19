import { Menu, LogOut, User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUiStore } from "../../store/uiStore";
import { initials } from "../../utils/formatters";
import { ROLE_LABELS } from "../../utils/constants";

export default function Topbar() {
  const { user, logout } = useAuth();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

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
            <div className="user-menu-dropdown">
              <div className="user-menu-header">
                <div className="user-menu-name">{user?.name}</div>
                <div className="user-menu-email">{user?.email}</div>
                {user?.role && (
                  <div className="user-menu-role">
                    {ROLE_LABELS[user.role] || user.role}
                  </div>
                )}
              </div>

              <button
                className="user-menu-item"
                onClick={() => handleNavigate("/profile")}
              >
                <User size={16} />
                Mon profil
              </button>

              <button
                className="user-menu-item"
                onClick={() => handleNavigate("/history")}
              >
                <Shield size={16} />
                Mon historique
              </button>

              <div className="user-menu-divider" />

              <button className="user-menu-item danger" onClick={handleLogout}>
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
