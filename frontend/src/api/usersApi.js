import api from "./client";

export const usersApi = {
  /**
   * GET /api/users
   * Params: page, limit, search, role, isActive
   */
  list: (params) =>
    api.get("/users", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.pagination,
    })),

  /**
   * GET /api/users/:id
   */
  get: (id) => api.get(`/users/${id}`).then((r) => r.data.data.data),

  /**
   * POST /api/users
   */
  create: (data) => api.post("/users", data).then((r) => r.data.data.data),

  /**
   * PUT /api/users/:id
   */
  update: ({ id, ...data }) =>
    api.put(`/users/${id}`, data).then((r) => r.data.data.data),

  /**
   * PATCH /api/users/:id/deactivate
   */
  deactivate: (id) => api.patch(`/users/${id}/deactivate`).then((r) => r.data),
};
