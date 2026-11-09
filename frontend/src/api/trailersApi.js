import api from "./client";

export const trailersApi = {
  list: (params) =>
    api.get("/trailers", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.pagination,
    })),

  get: (id) => api.get(`/trailers/${id}`).then((r) => r.data.data.data),

  create: (data) => api.post("/trailers", data).then((r) => r.data.data.data),

  update: ({ id, ...data }) =>
    api.put(`/trailers/${id}`, data).then((r) => r.data.data.data),

  remove: (id) => api.delete(`/trailers/${id}`).then((r) => r.data),
};
