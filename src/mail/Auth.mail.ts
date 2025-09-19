import { sendMail } from "../services/nodemailer.config"
import { generateOTPEmailHTML,generateOTPForForgotPassword } from "../templates/Auth.templates"
export const SendOTP = async(email:string,otp:string,expiry:string)=>{
 await sendMail({
    to:email,
    subject:`Welcome to the family.`,
    from:process.env.APP_EMAIL,
    html:generateOTPEmailHTML(otp,expiry)
 })
}