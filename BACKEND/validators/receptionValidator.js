import { body } from "express-validator";
export const receptionValidator = [
  body("deliveryId").isUUID(),
  body("referenceId").isUUID(),
  body("quantityReceived").isFloat({ min: 0 }),
  body("comment").optional().isString(),
];
