import sequelize from "./config/database.js";
import "./models/index.js"; // charge tous les modèles

async function syncTables() {
  try {
    console.log("🔄 Connexion à la base...");
    await sequelize.authenticate();
    console.log("✅ Connexion OK");

    console.log("🔄 Création des tables...");
    await sequelize.sync({ force: true }); // ⚠️ SUPPRIME TOUT et recrée

    console.log("✅ Toutes les tables ont été créées !");

    // Afficher les tables créées
    const [tables] = await sequelize.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `);
    console.log("\n📋 Tables dans la base :");
    tables.forEach((t) => console.log(`   - ${t.tablename}`));

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur :", error);
    process.exit(1);
  }
}

syncTables();
