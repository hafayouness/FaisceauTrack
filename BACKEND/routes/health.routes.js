import express from "express";
import sequelize from "../config/database.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const router = express.Router();

/**
 * GET /api/health
 */
router.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();

    return successResponse(
      res,
      {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
      },
      "Serveur opérationnel",
    );
  } catch (error) {
    return errorResponse(
      res,
      "Base de données non disponible",
      [error.message],
      503,
    );
  }
});

export default router;
