import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);
  const hasRole = useAuthStore((s) => s.hasRole);

  return {
    user,
    token,
    isAuthenticated,
    logout,
    setUser,
    hasRole,
  };
};
