import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import sequelize from "./config/database.js";
import config from "./config/config.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// ===============================
// MIDDLEWARES GLOBAUX
// ===============================
app.use(helmet());

app.use(
  cors({
    origin: config.cors.clientUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (config.server.env === "development") {
  app.use(morgan("dev"));
}

// ===============================
// ROUTES
// ===============================
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Traçabilité Faisceaux — Backend opérationnel",
    data: {
      version: "1.0.0",
      documentation: "/api/health",
    },
  });
});

// ===============================
// GESTION DES ERREURS
// ===============================
app.use(notFound);
app.use(errorHandler);

// ===============================
// DÉMARRAGE DU SERVEUR
// ===============================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion PostgreSQL établie avec succès.");

    app.listen(config.server.port, () => {
      console.log("====================================================");
      console.log(`🚀 Serveur démarré sur le port ${config.server.port}`);
      console.log(`🌍 Environnement : ${config.server.env}`);
      console.log(`🔗 URL : http://localhost:${config.server.port}`);
      console.log(
        `❤️  Health : http://localhost:${config.server.port}/api/health`,
      );
      console.log("====================================================");
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur :", error.message);
    process.exit(1);
  }
};

startServer();
