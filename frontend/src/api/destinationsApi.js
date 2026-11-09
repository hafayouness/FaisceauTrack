import api from "./client";

export const destinationsApi = {
  list: (params) =>
    api.get("/destinations", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.pagination,
    })),

  get: (id) => api.get(`/destinations/${id}`).then((r) => r.data.data.data),

  create: (data) =>
    api.post("/destinations", data).then((r) => r.data.data.data),

  update: ({ id, ...data }) =>
    api.put(`/destinations/${id}`, data).then((r) => r.data.data).data,

  remove: (id) => api.delete(`/destinations/${id}`).then((r) => r.data),
};
