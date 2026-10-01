import { body } from "express-validator";
import { ROLE_VALUES } from "../constants/index.js";
export const createUserValidator = [
  body("name").trim().notEmpty().withMessage("Nom requis"),
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mot de passe: 6 caractères minimum"),
  body("role").isIn(ROLE_VALUES).withMessage("Rôle invalide"),
];
export const updateUserValidator = [
  body("name").optional().trim().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  body("password").optional().isLength({ min: 6 }),
  body("role").optional().isIn(ROLE_VALUES),
  body("isActive").optional().isBoolean(),
];
