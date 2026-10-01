import { DataTypes, Model } from "sequelize";
import { HISTORY_ACTIONS, HISTORY_ENTITIES } from "../constants/index.js";

export default class History extends Model {
  static initModel(sequelize) {
    History.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: { type: DataTypes.UUID, allowNull: true },
        action: {
          type: DataTypes.ENUM(...Object.values(HISTORY_ACTIONS)),
          allowNull: false,
        },
        entity: {
          type: DataTypes.ENUM(...Object.values(HISTORY_ENTITIES)),
          allowNull: false,
        },
        entityId: { type: DataTypes.UUID, allowNull: true },
        details: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
        ipAddress: { type: DataTypes.STRING(64), allowNull: true },
      },
      {
        sequelize,
        modelName: "History",
        tableName: "Histories",
        updatedAt: false,
      },
    );
    return History;
  }
}
