import api from "./client";

export const historyApi = {
  list: (params) =>
    api.get("/history", { params }).then((r) => ({
      data: r.data.data.data,
      pagination: r.data.data.pagination,
    })),
};
