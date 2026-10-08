import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Building2,
  MapPin,
  History,
  PackageCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { initials } from "../../utils/formatters";
import { ROLE_LABELS } from "../../utils/constants";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/deliveries", label: "Livraisons", icon: Truck },
  { to: "/receptions", label: "Réceptions", icon: PackageCheck },
  { to: "/references", label: "Références", icon: Package },
  { section: "Logistique" },
  { to: "/trailers", label: "Remorques", icon: Truck },
  { to: "/transporters", label: "Transporteurs", icon: Building2 },
  { to: "/destinations", label: "Destinations", icon: MapPin },
  { section: "Administration" },
  { to: "/users", label: "Utilisateurs", icon: Users, adminOnly: true },
  { to: "/history", label: "Historique", icon: History },
];

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const { isAdmin } = usePermissions();

  const classes = [
    "sidebar",
    collapsed ? "collapsed" : "",
    mobileOpen ? "mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={classes}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">FT</div>
        {!collapsed && <div className="sidebar-brand">FaisceauTrack</div>}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item, idx) => {
          if (item.section) {
            return (
              <div key={idx} className="sidebar-section">
                {!collapsed ? item.section : "—"}
              </div>
            );
          }

          if (item.adminOnly && !isAdmin) return null;

          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Profil utilisateur */}
      {!collapsed && user && (
        <div className="sidebar-footer">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <div className="avatar">{initials(user.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 11 }}>
                {ROLE_LABELS[user.role] || user.role}
              </div>
            </div>
          </div>

          <button
            className="sidebar-link"
            style={{ width: "100%" }}
            onClick={logout}
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      )}
    </aside>
  );
}
