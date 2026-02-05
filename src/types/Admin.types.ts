import { Model } from "sequelize"
export interface AdminAttributes {
    id?:string,
    email:string,
    firstname:string,
    lastname:string,
    password?:string,
    isVerified:boolean,
    deletedAt?:Date
}


export interface AdminInstance extends Model<AdminAttributes>, AdminAttributes {}