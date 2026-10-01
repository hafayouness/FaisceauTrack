import sequelize from "../config/database.js";
import User from "./User.js";
import History from "./History.js";

const models = {
  User,
  History,
};

Object.values(models).forEach((model) => {
  model.initModel(sequelize);
});

User.hasMany(History, {
  foreignKey: "userId",
  as: "histories",
});

History.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { User, History, sequelize };

export const initModels = async () => models;
