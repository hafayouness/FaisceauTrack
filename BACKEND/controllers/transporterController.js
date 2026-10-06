import { Transporter } from "../models/index.js";
import { buildCrudController } from "./crudController.js";
export const { list, getOne, create, update, remove } = buildCrudController({
  model: Transporter,
  entity: "Transporter",
  searchFields: ["name", "company", "phone", "email"],
});
