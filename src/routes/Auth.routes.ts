import { Router } from "express";
import { createNewUser, login, verifyOTP } from "../controllers/Auth.controllers";

const Auth = Router()

//// MAKE SURE YOU RATE LIMIT All of this Auth routes

Auth.post("/register",createNewUser)

Auth.post("/verify",verifyOTP)

Auth.post("/login",login)

//Request otp again if the did not receive the first one 




export default Auth