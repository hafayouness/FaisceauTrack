import sequelize from "../config/database.js";
import {
  User,
  History,
  Reference,
  Transporter,
  Trailer,
  Destination,
  Delivery,
  DeliveryItem,
  Reception,
} from "../models/index.js";

const run = async () => {
  try {
    console.log("🔌 Connexion à PostgreSQL...");

    await sequelize.authenticate();

    console.log("✅ Connexion PostgreSQL réussie");

    const models = [
      User,
      History,
      Reference,
      Transporter,
      Trailer,
      Destination,
      Delivery,
      DeliveryItem,
      Reception,
    ];

    console.log("\n📦 Modèles chargés :");

    models.forEach((model) => {
      console.log(` - ${model.name} → table "${model.getTableName()}"`);
    });

    console.log("\n📋 Tables avant sync :");

    console.log(await sequelize.getQueryInterface().showAllTables());

    await sequelize.sync({
      alter: true,
    });

    console.log("\n📋 Tables après sync :");

    console.log(await sequelize.getQueryInterface().showAllTables());

    console.log("\n✅ Toutes les tables sont synchronisées.");

    await sequelize.close();

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erreur Sync :");
    console.error(error);

    await sequelize.close();

    process.exit(1);
  }
};

run();
