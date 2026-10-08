import api from "./client";

export const dashboardApi = {
  /**
   * GET /api/dashboard
   * Retour: { references, deliveries, preparation, transit, arrived,
   *          received, partialReception, anomalies, recentDeliveries }
   */
  get: () => api.get("/dashboard").then((r) => r.data.data),
};
