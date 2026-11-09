import api from "./client";

export const referencesApi = {
  list: (params) =>
    api.get("/references", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.pagination,
    })),

  get: (id) => api.get(`/references/${id}`).then((r) => r.data.data.data),

  traceability: (id) =>
    api.get(`/references/${id}/traceability`).then((r) => r.data.data.data),

  create: (data) => api.post("/references", data).then((r) => r.data.data),

  update: ({ id, ...data }) =>
    api.put(`/references/${id}`, data).then((r) => r.data.data),

  remove: (id) => api.delete(`/references/${id}`).then((r) => r.data),
};
