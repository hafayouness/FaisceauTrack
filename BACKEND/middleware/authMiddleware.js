import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/index.js";
import { errorResponse } from "../utils/apiResponse.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Token d'authentification requis",
      });
    }

    const token = header.substring(7);
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return errorResponse(res, {
        statusCode: 401,
        message: "Utilisateur invalide ou désactivé",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return errorResponse(res, {
      statusCode: 401,
      message: "Token invalide ou expiré",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Accès interdit",
        errors: [],
      });
    }

    next();
  };
};
