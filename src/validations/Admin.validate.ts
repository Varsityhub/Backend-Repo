import Joi from "joi";
import { AdminAttributes } from "../types/Admin.types";

export const newAdminValidate = Joi.object<AdminAttributes>({
   firstname: Joi.string().required(),
   lastname: Joi.string().required(),
   email: Joi.string().email().required(),
   
   //No password because admin would be mailed their password to them
}).min(1).required()

export const validateAdminLogin = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().required()
}).min(1).required()