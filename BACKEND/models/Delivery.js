import { DataTypes, Model } from "sequelize";
import { DELIVERY_STATUS, DELIVERY_STATUS_VALUES } from "../constants/index.js";

export default class Delivery extends Model {
  static initModel(sequelize) {
    Delivery.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        deliveryNumber: {
          type: DataTypes.STRING(80),
          allowNull: false,
          unique: true,
        },
        destinationId: { type: DataTypes.UUID, allowNull: false },
        transporterId: { type: DataTypes.UUID, allowNull: false },
        trailerId: { type: DataTypes.UUID, allowNull: false },
        status: {
          type: DataTypes.ENUM(...DELIVERY_STATUS_VALUES),
          allowNull: false,
          defaultValue: DELIVERY_STATUS.PREPARATION,
        },
        preparationDate: { type: DataTypes.DATE, allowNull: true },
        departureDate: { type: DataTypes.DATE, allowNull: true },
        arrivalDate: { type: DataTypes.DATE, allowNull: true },
        notes: { type: DataTypes.TEXT, allowNull: true },
        createdBy: { type: DataTypes.UUID, allowNull: false },
        updatedBy: { type: DataTypes.UUID, allowNull: true },
      },
      { sequelize, modelName: "Delivery", tableName: "Deliveries" },
    );
    return Delivery;
  }
}
