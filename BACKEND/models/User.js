import { DataTypes, Model } from "sequelize";
import { ROLE_VALUES, ROLES } from "../constants/index.js";

export default class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: { type: DataTypes.STRING(120), allowNull: false },
        email: {
          type: DataTypes.STRING(180),
          allowNull: false,
          unique: true,
          validate: { isEmail: true },
        },
        password: { type: DataTypes.STRING(255), allowNull: false },
        role: {
          type: DataTypes.ENUM(...ROLE_VALUES),
          allowNull: false,
          defaultValue: ROLES.ADMIN,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        lastLoginAt: { type: DataTypes.DATE, allowNull: true },
      },
      { sequelize, modelName: "User", tableName: "Users" },
    );
    return User;
  }
}
