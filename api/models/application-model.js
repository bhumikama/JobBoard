import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user-model.js";
import Job from "./job-model.js";
import Sequelize from "sequelize";
const Application = sequelize.define(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Job,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    resumeKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "Applications",
  }
);

User.belongsToMany(Job, {
  through: Application,
  foreignKey: "userId",
  as: "applications", 
});

Job.belongsToMany(User, {
  through: Application,
  foreignKey: "jobId",
  as: "applicants", 
});

Application.belongsTo(User, { foreignKey: "userId", as: "user" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

// sequelize
//   .sync({ alter: false })
//   .then(() => {
//     console.log("Application model is synchronized.");
//   })
//   .catch((err) => {
//     console.error("Error syncing the Application model:", err);
//   });

export default Application;
