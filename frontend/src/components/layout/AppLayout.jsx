import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <div className="main-content" style={{ marginLeft: 0 }}>
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
