import { Router } from "express";
import { createNewUser } from "../controllers/Auth.controllers";

const Auth = Router()

Auth.post("/register",createNewUser)

export default Auth