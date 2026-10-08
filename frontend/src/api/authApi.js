import api from "./client";

export const authApi = {
  /**
   * POST /api/auth/login
   * Body: { email, password }
   * Retour: { token, user }
   */
  login: (credentials) =>
    api.post("/auth/login", credentials).then((r) => r.data.data),

  /**
   * GET /api/auth/me
   * Header: Authorization: Bearer <token>
   * Retour: { user }
   */
  me: () => api.get("/auth/me").then((r) => r.data.data),

  /**
   * POST /api/auth/register
   * Body: { name, email, password, role }
   * Retour: { token, user }
   */
  register: (data) => api.post("/auth/register", data).then((r) => r.data.data),

  /**
   * Déconnexion locale (pas d'appel API côté backend)
   */
  logout: () => {
    localStorage.removeItem("faisceautrack-auth");
    return Promise.resolve();
  },
};
