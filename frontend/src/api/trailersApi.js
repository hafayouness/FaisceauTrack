import api from "./client";

export const trailersApi = {
  /**
   * GET /api/trailers
   * Params: page, limit, search
   */
  list: (params) =>
    api.get("/trailers", { params }).then((r) => ({
      data: r.data.data,
      pagination: r.data.pagination,
    })),

  /**
   * GET /api/trailers/:id
   */
  get: (id) => api.get(`/trailers/${id}`).then((r) => r.data.data),

  /**
   * POST /api/trailers
   */
  create: (data) => api.post("/trailers", data).then((r) => r.data.data),

  /**
   * PUT /api/trailers/:id
   */
  update: ({ id, ...data }) =>
    api.put(`/trailers/${id}`, data).then((r) => r.data.data),

  /**
   * DELETE /api/trailers/:id
   */
  remove: (id) => api.delete(`/trailers/${id}`).then((r) => r.data),
};
