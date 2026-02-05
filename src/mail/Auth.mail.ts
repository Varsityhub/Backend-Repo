import { sendMail } from "../services/nodemailer.config"
import { generateOTPEmailHTML,generateOTPForForgotPassword } from "../templates/Auth.templates"
export const SendOTP = async(email:string,otp:string,expiry:string)=>{
 await sendMail({
    to:email,
    subject:`Glad to have you join us`,
    from:process.env.APP_EMAIL,
    html:generateOTPEmailHTML(otp,expiry)
 })
}
export const SendForgotPasswordOTP = async(email:string,otp:string,expiry:string)=>{
 await sendMail({
    to:email,
    subject:`Your Password Reset OTP`,
    from:process.env.APP_EMAIL,
    html:generateOTPForForgotPassword(otp,expiry)
 })
}