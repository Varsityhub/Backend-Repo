import { Router } from "express";
import { newDept,getAllDepartments } from "../controllers/Department.controller";
const Department  = Router()

Department.get("/all",getAllDepartments)
Department.post("/new",newDept)


export default Department