import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute";
// import RoleRoute from "./routes/RoleRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Deliveries from "./pages/Deliveries";

// import { ROLES } from "./utils/constants";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: 10,
            background: "#1f2937",
            color: "#fff",
            fontSize: 13.5,
          },
        }}
      />
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deliveries" element={<Deliveries />} />

            {/* Admin uniquement */}
            {/* <Route element={<RoleRoute roles={[ROLES.ADMIN]} />}>
              <Route path="/users" element={<Users />} />
            </Route> */}
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
