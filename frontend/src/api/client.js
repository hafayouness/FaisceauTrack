import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Une erreur est survenue";

    // 401 — Non authentifié → déconnexion + redirection
    if (status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      toast.error("Vous n'avez pas les permissions nécessaires");
    } else if (status === 409) {
      toast.error(message);
    } else if (status === 422) {
      toast.error(message);
    }
    // 5xx — Erreur serveur
    else if (status >= 500) {
      toast.error("Erreur serveur. Veuillez réessayer plus tard.");
    }
    // Autres erreurs
    else if (!error.config?.silent) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
