import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Company from "./company-model.js";
import Sequelize from "sequelize";

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.ENUM("Engineering & Technology", "Management", "IT"),
      allowNull: false,
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM("remote", "in-office"),
      allowNull: false,
    },
  },
  {
    tableName: "Jobs",
  }
);

Job.belongsTo(Company, { as: "company", foreignKey: "companyId" }); 
Company.hasMany(Job, { as: "jobs", foreignKey: "companyId" });


// sequelize
//   .sync({ alter: false })
//   .then(() => {
//     console.log("Job model is synchronized.");
//   })
//   .catch((err) => {
//     console.error("Error syncing the Job model:", err);
//   });

export default Job;
