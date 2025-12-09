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


