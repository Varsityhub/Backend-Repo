import { Model } from "sequelize"
export interface UserAttributes {
    id?:string,
    email:string,
    firstname:string,
    lastname:string,
    departmentId:string,
    level:string,
    password:string,
    otp:string,
    otpExpires:Date,
}


export interface UserInstance extends Model<UserAttributes>, UserAttributes {}