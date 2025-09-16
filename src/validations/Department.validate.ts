import Joi from "joi";
import { DepartmentAttributes } from "../types/Department.types";

export const validateNewDept =  Joi.object<DepartmentAttributes>({
name:Joi.string().required()
}).min(1).required()