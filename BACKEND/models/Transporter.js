import { DataTypes, Model } from "sequelize";

export default class Transporter extends Model {
  static initModel(sequelize) {
    Transporter.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: { type: DataTypes.STRING(120), allowNull: false },
        company: { type: DataTypes.STRING(160), allowNull: true },
        phone: { type: DataTypes.STRING(40), allowNull: true },
        email: {
          type: DataTypes.STRING(180),
          allowNull: true,
          validate: { isEmail: true },
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      { sequelize, modelName: "Transporter", tableName: "Transporters" },
    );
    return Transporter;
  }
}
