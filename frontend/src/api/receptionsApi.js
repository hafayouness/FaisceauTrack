import api from "./client";

export const receptionsApi = {
  list: (params) =>
    api.get("/receptions", { params }).then((r) => r.data.data.data),

  create: (data) => api.post("/receptions", data).then((r) => r.data.data),
};
