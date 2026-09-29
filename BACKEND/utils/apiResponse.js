/**
 * Réponse succès standardisée.
 */
export const successResponse = (
  res,
  data = {},
  message = "Operation successful",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Réponse erreur standardisée.
 */
export const errorResponse = (
  res,
  message = "Error message",
  errors = [],
  statusCode = 400,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
