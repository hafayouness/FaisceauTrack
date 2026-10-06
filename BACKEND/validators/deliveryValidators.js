import { body } from "express-validator";
import { DELIVERY_STATUS_VALUES } from "../constants/index.js";

const item = body("items")
  .isArray({ min: 1 })
  .withMessage("Au moins une référence est requise");
export const createDeliveryValidator = [
  body("deliveryNumber")
    .trim()
    .notEmpty()
    .withMessage("Numéro de livraison requis"),
  body("destinationId").isUUID().withMessage("destinationId invalide"),
  body("transporterId").isUUID().withMessage("transporterId invalide"),
  body("trailerId").isUUID().withMessage("trailerId invalide"),
  body("status").optional().isIn(DELIVERY_STATUS_VALUES),
  item,
  body("items.*.referenceId").isUUID().withMessage("referenceId invalide"),
  body("items.*.quantity")
    .isFloat({ gt: 0 })
    .withMessage("quantity doit être > 0"),
  body("items.*.unit").optional().isString(),
  body("items.*.notes").optional().isString(),
];
export const updateDeliveryValidator = [
  body("deliveryNumber").optional().trim().notEmpty(),
  body("destinationId").optional().isUUID(),
  body("transporterId").optional().isUUID(),
  body("trailerId").optional().isUUID(),
  body("status").optional().isIn(DELIVERY_STATUS_VALUES),
  body("items").optional().isArray({ min: 1 }),
  body("items.*.referenceId").optional().isUUID(),
  body("items.*.quantity").optional().isFloat({ gt: 0 }),
];
