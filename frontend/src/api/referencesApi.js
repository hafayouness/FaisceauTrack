import api from "./client";

export const referencesApi = {
  /**
   * GET /api/references
   * Params: page, limit, search, isActive
   */
  list: (params) =>
    api.get("/references", { params }).then((r) => ({
      data: r.data.data,
      pagination: r.data.pagination,
    })),

  /**
   * GET /api/references/:id
   */
  get: (id) => api.get(`/references/${id}`).then((r) => r.data.data),

  /**
   * GET /api/references/:id/traceability
   * Retour: { reference, deliveries: [...] }
   */
  traceability: (id) =>
    api.get(`/references/${id}/traceability`).then((r) => r.data.data),

  /**
   * POST /api/references
   */
  create: (data) => api.post("/references", data).then((r) => r.data.data),

  /**
   * PUT /api/references/:id
   */
  update: ({ id, ...data }) =>
    api.put(`/references/${id}`, data).then((r) => r.data.data),

  /**
   * DELETE /api/references/:id
   */
  remove: (id) => api.delete(`/references/${id}`).then((r) => r.data),
};
