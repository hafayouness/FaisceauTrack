/**
 * Middleware centralisé de gestion des erreurs.
 * Format : { success: false, message: "...", errors: [] }
 */
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Erreur :", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erreur interne du serveur";

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

/**
 * Middleware 404.
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée : ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};
