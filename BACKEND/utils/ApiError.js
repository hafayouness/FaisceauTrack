export default class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
  static badRequest(m = "Requête invalide", e = []) {
    return new ApiError(400, m, e);
  }
  static unauthorized(m = "Non authentifié", e = []) {
    return new ApiError(401, m, e);
  }
  static forbidden(m = "Accès refusé", e = []) {
    return new ApiError(403, m, e);
  }
  static notFound(m = "Ressource introuvable", e = []) {
    return new ApiError(404, m, e);
  }
  static conflict(m = "Conflit de données", e = []) {
    return new ApiError(409, m, e);
  }
  static internal(m = "Erreur interne", e = []) {
    return new ApiError(500, m, e);
  }
}
