import { Router } from "express";
import { newDept } from "../controllers/Department.controller";
const Department  = Router()

Department.post("/new",newDept)


export default Department