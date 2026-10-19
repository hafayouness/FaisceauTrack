import api from "./client";

export const transportersApi = {
  /**
   * GET /api/transporters
   * Params: page, limit, search
   */
  list: (params) =>
    api.get("/transporters", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.pagination,
    })),

  /**
   * GET /api/transporters/:id
   */
  get: (id) => api.get(`/transporters/${id}`).then((r) => r.data.data.data),

  /**
   * POST /api/transporters
   */
  create: (data) =>
    api.post("/transporters", data).then((r) => r.data.data.data),

  /**
   * PUT /api/transporters/:id
   */
  update: ({ id, ...data }) =>
    api.put(`/transporters/${id}`, data).then((r) => r.data.data.data),

  /**
   * DELETE /api/transporters/:id
   */
  remove: (id) => api.delete(`/transporters/${id}`).then((r) => r.data),
};
