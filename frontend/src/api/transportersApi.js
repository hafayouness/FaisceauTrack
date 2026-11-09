import api from "./client";

export const transportersApi = {
  list: (params) =>
    api.get("/transporters", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.pagination,
    })),

  get: (id) => api.get(`/transporters/${id}`).then((r) => r.data.data.data),

  create: (data) =>
    api.post("/transporters", data).then((r) => r.data.data.data),

  update: ({ id, ...data }) =>
    api.put(`/transporters/${id}`, data).then((r) => r.data.data.data),

  remove: (id) => api.delete(`/transporters/${id}`).then((r) => r.data),
};
