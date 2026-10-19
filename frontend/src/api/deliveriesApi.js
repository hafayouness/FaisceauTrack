import api from "./client";

export const deliveriesApi = {
  list: (params) =>
    api.get("/deliveries", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.pagination,
    })),

  get: (id) => api.get(`/deliveries/${id}`).then((r) => r.data.data.data),

  create: (data) => api.post("/deliveries", data).then((r) => r.data.data.data),

  update: ({ id, ...data }) =>
    api.patch(`/deliveries/${id}`, data).then((r) => r.data.data.data),

  remove: (id) => api.delete(`/deliveries/${id}`).then((r) => r.data),

  exportExcel: (params = {}) => {
    const { page, limit, ...filters } = params;

    const cleanParams = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, v]) => v !== undefined && v !== null && v !== "",
      ),
    );

    return api.get("/deliveries/export", {
      // ⚠️ /deliveries/export
      params: cleanParams,
      responseType: "blob",
    });
  },
};
