import { initModels } from "../models/index.js";
import sequelize from "../config/database.js";

const run = async () => {
  const mode = process.argv[2] || "safe";
  try {
    await sequelize.authenticate();
    const db = await initModels();
    const models = Object.keys(db).filter(
      (k) => k !== "sequelize" && k !== "Sequelize",
    );
    console.log("📦 Modèles :", models.join(", "));
    const options = {};
    if (mode === "alter") options.alter = true;
    if (mode === "force") options.force = true;
    await sequelize.sync(options);
    console.log(`✅ Sync (${mode}) OK`);
    process.exit(0);
  } catch (e) {
    console.error("❌", e.message);
    process.exit(1);
  }
};
run();
