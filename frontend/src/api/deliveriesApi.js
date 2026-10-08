import api from "./client";

export const deliveriesApi = {
  /**
   * GET /api/deliveries
   * Params: page, limit, search, status, destinationId, transporterId, trailerId
   */
  list: (params) =>
    api.get("/deliveries", { params }).then((r) => ({
      data: r.data.data,
      pagination: r.data.pagination,
    })),

  /**
   * GET /api/deliveries/:id
   */
  get: (id) => api.get(`/deliveries/${id}`).then((r) => r.data.data),

  /**
   * POST /api/deliveries
   */
  create: (data) => api.post("/deliveries", data).then((r) => r.data.data),

  /**
   * PUT /api/deliveries/:id
   */
  update: ({ id, ...data }) =>
    api.put(`/deliveries/${id}`, data).then((r) => r.data.data),

  /**
   * DELETE /api/deliveries/:id
   */
  remove: (id) => api.delete(`/deliveries/${id}`).then((r) => r.data),

  /**
   * GET /api/export/deliveries
   */
  exportExcel: (params) =>
    api.get("/export/deliveries", {
      params,
      responseType: "blob",
    }),
};
