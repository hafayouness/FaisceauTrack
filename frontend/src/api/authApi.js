import api from "./client";

export const authApi = {
  login: (credentials) =>
    api.post("/auth/login", credentials).then((r) => r.data.data),

  me: () => api.get("/auth/me").then((r) => r.data.data),

  register: (data) => api.post("/auth/register", data).then((r) => r.data.data),

  logout: () => {
    localStorage.removeItem("faisceautrack-auth");
    return Promise.resolve();
  },
};
