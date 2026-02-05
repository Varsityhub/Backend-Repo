import { Model } from "sequelize";

export interface AdminTokensAttributes {
    id?:string,
    adminId:string,
    token:string,
    type:"verify_mail" | "forgot_password" | "reset_password",
    expiresAt:Date

}

export interface AdminTokensInstance
  extends Model<AdminTokensAttributes>,
    AdminTokensAttributes {}
