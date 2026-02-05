import { Model } from "sequelize";


export interface DepartmentAttributes {
    id?:string,
    name:string,
    userId:string
}


export interface DepartmentInstance extends Model<DepartmentAttributes> , DepartmentAttributes {}