import Joi from "joi";
import { UserAttributes } from "../types/Auth.types";

export const allowedLevels = ["100","200","300","400","500","600"]

export const newUserValidate = Joi.object<UserAttributes>({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  level: Joi.string().valid(...allowedLevels).required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])"))
    .required(),
  departmentId: Joi.number().integer().required(),
});
