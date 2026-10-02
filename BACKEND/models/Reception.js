import { DataTypes, Model } from "sequelize";
import {
  RECEPTION_STATUS,
  RECEPTION_STATUS_VALUES,
} from "../constants/index.js";

export default class Reception extends Model {
  static initModel(sequelize) {
    Reception.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        deliveryId: { type: DataTypes.UUID, allowNull: false },
        referenceId: { type: DataTypes.UUID, allowNull: false },
        quantityExpected: { type: DataTypes.DECIMAL(14, 3), allowNull: false },
        quantityReceived: {
          type: DataTypes.DECIMAL(14, 3),
          allowNull: false,
          validate: { min: 0 },
        },
        status: {
          type: DataTypes.ENUM(...RECEPTION_STATUS_VALUES),
          allowNull: false,
          defaultValue: RECEPTION_STATUS.PENDING,
        },
        comment: { type: DataTypes.TEXT, allowNull: true },
        receivedBy: { type: DataTypes.UUID, allowNull: false },
        receivedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { sequelize, modelName: "Reception", tableName: "Receptions" },
    );
    return Reception;
  }

  get discrepancy() {
    return Number(this.quantityExpected) - Number(this.quantityReceived);
  }
}
