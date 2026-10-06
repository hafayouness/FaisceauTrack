import { body } from "express-validator";
export const transporterValidator = [
  body("name").trim().notEmpty(),
  body("company").optional().isString(),
  body("phone").optional().isString(),
  body("email").optional().isEmail(),
  body("isActive").optional().isBoolean(),
];
export const trailerValidator = [
  body("registrationNumber").trim().notEmpty(),
  body("type").optional().isString(),
  body("isActive").optional().isBoolean(),
];
export const destinationValidator = [
  body("name").trim().notEmpty(),
  body("address").optional().isString(),
  body("city").optional().isString(),
  body("country").optional().isString(),
  body("contactName").optional().isString(),
  body("contactPhone").optional().isString(),
  body("isActive").optional().isBoolean(),
];
