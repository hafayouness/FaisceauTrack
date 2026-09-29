import sequelize from "../config/database.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion PostgreSQL réussie.");
    console.log(`   Base de données : ${process.env.DB_NAME}`);
    console.log(
      `   Hôte            : ${process.env.DB_HOST}:${process.env.DB_PORT}`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Impossible de se connecter à PostgreSQL :");
    console.error(error.message);
    process.exit(1);
  }
})();
