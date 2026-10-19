import api from "./client";

export const receptionsApi = {
  /**
   * GET /api/receptions
   * Params: deliveryId, referenceId, status
   * Retour: { data: [...] }  (pas de pagination côté backend)
   */
  list: (params) =>
    api.get("/receptions", { params }).then((r) => r.data.data.data),

  /**
   * POST /api/receptions
   * Body: { deliveryId, referenceId, quantityReceived, comment, status }
   */
  create: (data) => api.post("/receptions", data).then((r) => r.data.data),
};
