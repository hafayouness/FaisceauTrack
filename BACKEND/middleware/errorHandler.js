import {
  UniqueConstraintError,
  ValidationError,
  ForeignKeyConstraintError,
} from "sequelize";
import { errorResponse } from "../utils/apiResponse.js";

export const notFound = (req, res) =>
  errorResponse(res, {
    statusCode: 404,
    message: `Route introuvable: ${req.method} ${req.originalUrl}`,
  });

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof UniqueConstraintError) {
    return errorResponse(res, {
      statusCode: 409,
      message: "Une valeur existe déjà",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }
  if (err instanceof ForeignKeyConstraintError) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Référence associée introuvable ou invalide",
    });
  }
  if (err instanceof ValidationError) {
    return errorResponse(res, {
      statusCode: 422,
      message: "Erreur de validation",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }
  return errorResponse(res, {
    statusCode: err.statusCode || 500,
    message: err.message || "Erreur interne du serveur",
  });
};
