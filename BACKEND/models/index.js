import sequelize from "../config/database.js";
import User from "./User.js";
import Reference from "./Reference.js";
import Transporter from "./Transporter.js";
import Trailer from "./Trailer.js";
import Destination from "./Destination.js";
import Delivery from "./Delivery.js";
import DeliveryItem from "./DeliveryItem.js";
import Reception from "./Reception.js";
import History from "./History.js";

const models = {
  User,
  Reference,
  Transporter,
  Trailer,
  Destination,
  Delivery,
  DeliveryItem,
  Reception,
  History,
};

Object.values(models).forEach((model) => model.initModel(sequelize));

User.hasMany(Delivery, { foreignKey: "createdBy", as: "createdDeliveries" });
User.hasMany(Delivery, { foreignKey: "updatedBy", as: "updatedDeliveries" });
User.hasMany(Reception, { foreignKey: "receivedBy", as: "receptions" });
User.hasMany(History, { foreignKey: "userId", as: "histories" });

Delivery.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
Delivery.belongsTo(User, { foreignKey: "updatedBy", as: "updater" });
Delivery.belongsTo(Destination, {
  foreignKey: "destinationId",
  as: "destination",
});
Delivery.belongsTo(Transporter, {
  foreignKey: "transporterId",
  as: "transporter",
});
Delivery.belongsTo(Trailer, { foreignKey: "trailerId", as: "trailer" });
Delivery.hasMany(DeliveryItem, {
  foreignKey: "deliveryId",
  as: "items",
  onDelete: "CASCADE",
});
Delivery.hasMany(Reception, {
  foreignKey: "deliveryId",
  as: "receptions",
  onDelete: "CASCADE",
});

DeliveryItem.belongsTo(Delivery, { foreignKey: "deliveryId", as: "delivery" });
DeliveryItem.belongsTo(Reference, {
  foreignKey: "referenceId",
  as: "reference",
});
Reference.hasMany(DeliveryItem, {
  foreignKey: "referenceId",
  as: "deliveryItems",
});

Reception.belongsTo(Delivery, { foreignKey: "deliveryId", as: "delivery" });
Reception.belongsTo(Reference, { foreignKey: "referenceId", as: "reference" });
Reception.belongsTo(User, { foreignKey: "receivedBy", as: "receiver" });

Destination.hasMany(Delivery, {
  foreignKey: "destinationId",
  as: "deliveries",
});
Transporter.hasMany(Delivery, {
  foreignKey: "transporterId",
  as: "deliveries",
});
Trailer.hasMany(Delivery, { foreignKey: "trailerId", as: "deliveries" });

History.belongsTo(User, { foreignKey: "userId", as: "user" });

export {
  User,
  Reference,
  Transporter,
  Trailer,
  Destination,
  Delivery,
  DeliveryItem,
  Reception,
  History,
  sequelize,
};

export const initModels = async () => models;
