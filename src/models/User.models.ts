import { DataType, DataTypes } from "sequelize";
import SequelizeConfig from "../db/config";

const User = SequelizeConfig.define("users",{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    level:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    departmentId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

export default User