import api from "./client";

export const destinationsApi = {
  /**
   * GET /api/destinations
   * Params: page, limit, search
   */
  list: (params) =>
    api.get("/destinations", { params }).then((r) => ({
      data: r.data.data,
      pagination: r.data.pagination,
    })),

  /**
   * GET /api/destinations/:id
   */
  get: (id) => api.get(`/destinations/${id}`).then((r) => r.data.data),

  /**
   * POST /api/destinations
   */
  create: (data) => api.post("/destinations", data).then((r) => r.data.data),

  /**
   * PUT /api/destinations/:id
   */
  update: ({ id, ...data }) =>
    api.put(`/destinations/${id}`, data).then((r) => r.data.data),

  /**
   * DELETE /api/destinations/:id
   */
  remove: (id) => api.delete(`/destinations/${id}`).then((r) => r.data),
};
