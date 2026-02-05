import { Router } from "express";
import { newAdmin,verifyOTP,adminLogin } from "../controllers/Admin.controllers";

const Admin =  Router()

Admin.post("/new",newAdmin)
Admin.post("/verify",verifyOTP)
Admin.post("/login",adminLogin)

export default Admin