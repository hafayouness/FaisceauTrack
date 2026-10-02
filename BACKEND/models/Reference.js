import { DataTypes, Model } from "sequelize";
import { DEFAULT_UNIT } from "../constants/index.js";

export default class Reference extends Model {
  static initModel(sequelize) {
    Reference.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        unit: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: DEFAULT_UNIT,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      { sequelize, modelName: "Reference", tableName: "References" },
    );
    return Reference;
  }
}
