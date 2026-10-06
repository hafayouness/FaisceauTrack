import { Destination } from "../models/index.js";
import { buildCrudController } from "./crudController.js";
export const { list, getOne, create, update, remove } = buildCrudController({
  model: Destination,
  entity: "Destination",
  searchFields: ["name", "city", "country", "contactName"],
});
