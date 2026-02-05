import SequelizeConfig from "../db/config";
import { DataTypes } from "sequelize";
import { AdminInstance } from "../types/Admin.types";

//Admins do not need email verifications

const Admin = SequelizeConfig.define<AdminInstance>(
  "admins",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },    

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    paranoid: true,
  }
);
export default Admin;
