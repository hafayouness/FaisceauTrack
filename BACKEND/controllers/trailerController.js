import { Trailer } from "../models/index.js";
import { buildCrudController } from "./crudController.js";
export const { list, getOne, create, update, remove } = buildCrudController({
  model: Trailer,
  entity: "Trailer",
  searchFields: ["registrationNumber", "type"],
});
