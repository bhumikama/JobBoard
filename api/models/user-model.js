import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Sequelize from "sequelize";
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM("job_seeker", "recruiter"),
      allowNull: false,
      field: "role",
      enumName: "CustomRoleEnum",
    },
  },
  {
    tableName: "Users",
  }
);

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("user model is synchronized.");
//   })
//   .catch((err) => {
//     console.error("Error syncing the model:", err);
//   });

export default User;
