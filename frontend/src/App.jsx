import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Deliveries from "./pages/Deliveries";
import References from "./pages/References";
import ReferenceDetail from "./pages/ReferenceDetail";

import Transporters from "./pages/Transporters";

import { ROLES } from "./utils/constants";
import Users from "./pages/Users";
import Trailers from "./pages/Trailers";
import Destinations from "./pages/Destinations";
import History from "./pages/History";
import Receptions from "./pages/Receptions";
import DeliveryDetail from "./pages/DeliveryDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "var(--text-primary)",
            borderRadius: 12,
            padding: "14px 18px",
            fontSize: 14,
            fontWeight: 500,
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
            border: "1px solid var(--border-color)",
            maxWidth: 420,
            minWidth: 320,
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
            style: {
              background: "#f0fdf4",
              color: "#065f46",
              border: "1px solid #86efac",
              borderRadius: 12,
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 500,
              boxShadow:
                "0 10px 40px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(16, 185, 129, 0.1)",
            },
          },

          error: {
            duration: 4500,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fca5a5",
              borderRadius: 12,
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 500,
              boxShadow:
                "0 10px 40px rgba(239, 68, 68, 0.15), 0 4px 12px rgba(239, 68, 68, 0.1)",
            },
          },

          loading: {
            style: {
              background: "#eff6ff",
              color: "#1e40af",
              border: "1px solid #93c5fd",
              borderRadius: 12,
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 500,
            },
          },

          blank: {
            style: {
              background: "#ffffff",
              border: "1px solid var(--border-color)",
              borderRadius: 12,
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 500,
            },
          },
        }}
      />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deliveries" element={<Deliveries />} />
            <Route path="/references" element={<References />} />
            <Route path="/references/:id" element={<ReferenceDetail />} />
            <Route path="/transporters" element={<Transporters />} />
            <Route path="/trailers" element={<Trailers />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/history" element={<History />} />
            <Route path="/receptions" element={<Receptions />} />
            <Route path="/deliveries/:id" element={<DeliveryDetail />} />

            <Route element={<RoleRoute roles={[ROLES.ADMIN]} />}>
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
