import api from "./client";

export const historyApi = {
  /**
   * GET /api/history
   * Params: page, limit, action, entity, userId, entityId, search
   *
   * Retour: { data: [...], pagination: {...} }
   */
  list: (params) =>
    api.get("/history", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.data.pagination,
    })),
};
