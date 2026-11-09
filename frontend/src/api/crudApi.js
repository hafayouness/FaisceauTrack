import api from "./client";

export const buildCrudApi = (endpoint) => ({
  list: (params) =>
    api.get(`/${endpoint}`, { params }).then((r) => ({
      data: r.data.data,
      pagination: r.data.pagination,
    })),
  // ...
});

export const trailersApi = buildCrudApi("trailers");
export const transportersApi = buildCrudApi("transporters");
export const destinationsApi = buildCrudApi("destinations");
