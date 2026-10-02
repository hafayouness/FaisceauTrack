import { body } from "express-validator";
export const referenceValidator = [
  body("code").trim().notEmpty().withMessage("Code de référence requis"),
  body("description").optional().isString(),
  body("unit").optional().trim().notEmpty(),
  body("isActive").optional().isBoolean(),
];
