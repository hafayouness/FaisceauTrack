import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useUiStore } from "../../store/uiStore";

export default function AppLayout() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileSidebarOpen);
  const closeMobile = useUiStore((s) => s.closeMobileSidebar);

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />
      <div className={`main-content ${collapsed ? "sidebar-collapsed" : ""}`}>
        <Topbar />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
