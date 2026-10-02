import { DataTypes, Model } from "sequelize";

export default class Destination extends Model {
  static initModel(sequelize) {
    Destination.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: { type: DataTypes.STRING(150), allowNull: false },
        address: { type: DataTypes.STRING(255), allowNull: true },
        city: { type: DataTypes.STRING(100), allowNull: true },
        country: { type: DataTypes.STRING(100), allowNull: true },
        contactName: { type: DataTypes.STRING(120), allowNull: true },
        contactPhone: { type: DataTypes.STRING(40), allowNull: true },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      { sequelize, modelName: "Destination", tableName: "Destinations" },
    );
    return Destination;
  }
}
