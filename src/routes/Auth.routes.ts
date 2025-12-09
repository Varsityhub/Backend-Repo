import { Router } from "express";
import { createNewUser, login, verifyOTP ,requestRegisterOTP,forgotPassword,requestForgotOTP} from "../controllers/Auth.controllers";

const Auth = Router()

//// MAKE SURE YOU RATE LIMIT All of this Auth routes

Auth.post("/register",createNewUser)

Auth.post("/verify",verifyOTP)

Auth.post("/login",login)

Auth.post("/request-registerotp",requestRegisterOTP)

Auth.post("/forgot",forgotPassword)

// Auth.post("/request-forgototp",requestForgotOTP)




export default Auth