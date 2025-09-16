import { DataTypes } from "sequelize";
import SequelizeConfig from "../db/config";
import { DepartmentInstance } from "../types/Department.types";

const Department = SequelizeConfig.define<DepartmentInstance>("department",{
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    paranoid:true
})

export default Department