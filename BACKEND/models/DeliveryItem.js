import { DataTypes, Model } from "sequelize";
import { DEFAULT_UNIT } from "../constants/index.js";

export default class DeliveryItem extends Model {
  static initModel(sequelize) {
    DeliveryItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        deliveryId: { type: DataTypes.UUID, allowNull: false },
        referenceId: { type: DataTypes.UUID, allowNull: false },
        quantity: {
          type: DataTypes.DECIMAL(14, 3),
          allowNull: false,
          validate: { min: 0.001 },
        },
        unit: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: DEFAULT_UNIT,
        },
        notes: { type: DataTypes.TEXT, allowNull: true },
      },
      { sequelize, modelName: "DeliveryItem", tableName: "DeliveryItems" },
    );
    return DeliveryItem;
  }
}
