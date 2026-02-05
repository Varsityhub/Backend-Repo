import { Router } from "express";
import { newDept,getAllDepartments } from "../controllers/Department.controller";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
const Department  = Router()

Department.get("/all",getAllDepartments)
Department.post("/new",authorizeAdmin,newDept)


export default Department