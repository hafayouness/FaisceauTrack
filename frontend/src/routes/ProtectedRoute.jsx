import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute() {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  console.log("🔒 ProtectedRoute - isAuth:", isAuth); // 👈 AJOUTEZ CE LOG

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
