import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user-model.js";

const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    recruiterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Companies",
  }
);

Company.belongsTo(User, { as: "recruiter", foreignKey: "recruiterId" });
User.hasMany(Company, { as: "companies", foreignKey: "recruiterId" });

// sequelize
//   .sync({ alter: false })
//   .then(() => {
//     console.log("Company model is synchronized.");
//   })
//   .catch((err) => {
//     console.error("Error syncing the Company model:", err);
//   });

export default Company;
