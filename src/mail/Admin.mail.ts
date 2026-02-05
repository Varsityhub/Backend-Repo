import { sendMail } from "../services/nodemailer.config";
import { generateOTPEmailHTML,adminPasswordTemplate } from "../templates/Auth.templates";

export const sendAdminOTP = async (
  email: string,
  otp: string,
  expiry: string
) => {
  try {
    await sendMail({
      to: email,
      subject: `Glad to have you join us`,
      from: process.env.APP_EMAIL,
      html: generateOTPEmailHTML(otp, expiry),
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const sendAdminPassword = async (
  email: string,
  
  ADMIN_PASSWORD:string
) => {
  try {
    await sendMail({
      to: email,
      subject: `Admin Access Credentials`,
      from: process.env.APP_EMAIL,
      html: adminPasswordTemplate(ADMIN_PASSWORD)
    });
  } catch (error: any) {
    throw new Error(error);
  }
};


