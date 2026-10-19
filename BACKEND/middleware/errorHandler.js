import {
  UniqueConstraintError,
  ValidationError,
  ForeignKeyConstraintError,
} from "sequelize";
import { errorResponse } from "../utils/apiResponse.js";

export const notFound = (req, res) => {
  return errorResponse(
    res,
    `Route introuvable: ${req.method} ${req.originalUrl}`,
    [],
    404,
  );
};

export const errorHandler = (err, req, res, next) => {
  console.error("❌ Erreur:", err.message);

  if (err instanceof UniqueConstraintError) {
    return errorResponse(
      res,
      "Une valeur existe déjà",
      err.errors.map((e) => ({ field: e.path, message: e.message })),
      409,
    );
  }

  if (err instanceof ForeignKeyConstraintError) {
    return errorResponse(
      res,
      "Référence associée introuvable ou invalide",
      [],
      400,
    );
  }

  if (err instanceof ValidationError) {
    return errorResponse(
      res,
      "Erreur de validation",
      err.errors.map((e) => ({ field: e.path, message: e.message })),
      422,
    );
  }

  return errorResponse(
    res,
    err.message || "Erreur interne du serveur",
    err.errors || [],
    err.statusCode || 500,
  );
};
