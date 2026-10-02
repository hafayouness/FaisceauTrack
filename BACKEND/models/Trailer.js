import { DataTypes, Model } from "sequelize";

export default class Trailer extends Model {
  static initModel(sequelize) {
    Trailer.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        registrationNumber: {
          type: DataTypes.STRING(60),
          allowNull: false,
          unique: true,
        },
        type: { type: DataTypes.STRING(80), allowNull: true },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      { sequelize, modelName: "Trailer", tableName: "Trailers" },
    );
    return Trailer;
  }
}
