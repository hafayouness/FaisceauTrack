import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),

  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Mot de passe invalide"),
];

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères"),

  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),

  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),

  body("role")
    .isIn(["ADMIN", "LOGISTIC_MANAGER", "RECEPTION", "VIEWER"])
    .withMessage("Rôle invalide"),
];
