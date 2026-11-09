import api from "./client";

export const usersApi = {
  list: (params) =>
    api.get("/users", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.pagination,
    })),

  get: (id) => api.get(`/users/${id}`).then((r) => r.data.data.data),

  create: (data) => api.post("/users", data).then((r) => r.data.data.data),

  update: ({ id, ...data }) =>
    api.put(`/users/${id}`, data).then((r) => r.data.data.data),

  deactivate: (id) => api.patch(`/users/${id}/deactivate`).then((r) => r.data),
};
