import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import sequelize from "./config/database.js";
import config from "./config/config.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import rateLimit from "express-rate-limit";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Trop de tentatives de connexion, veuillez réessayer après 15 minutes.",
  skipSuccessfulRequests: true,
});

app.use(
  cors({
    origin: config.cors.clientUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (config.server.env === "development") {
  app.use(morgan("dev"));
}
// app.use("/api/auth/login", authLimiter);
// app.use("/api/auth/register", authLimiter);
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

app.use(notFound);
app.use(errorHandler);

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
      (console.log("🛡️  Helmet + Rate Limiting activés"),
        console.log("===================================================="));
    });
  } catch (error) {
    console.error("❌ Impossible de démarrer le serveur :", error.message);
    process.exit(1);
  }
};

startServer();
