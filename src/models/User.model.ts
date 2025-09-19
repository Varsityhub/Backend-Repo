import SequelizeConfig from "../db/config";
import { DataTypes } from "sequelize";
import { UserInstance } from "../types/Auth.types";

const User = SequelizeConfig.define<UserInstance>(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey:true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp:{
        type:DataTypes.STRING,
        allowNull:true
    },
    otpExpires:{
        type:DataTypes.DATE,
        allowNull:true
    },
    isVerified:{
        type:DataTypes.BOOLEAN,
      defaultValue:false,
      allowNull:false
    }
  },
  {
    paranoid: true,
  }
);
export default User