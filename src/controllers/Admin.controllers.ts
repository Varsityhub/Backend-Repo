import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { validateAdminLogin } from "../validations/Admin.validate";
import bcrypt from "bcrypt";
import { generateAdminPassword } from "../utils/passwordGen";
import { getOtpAndExpiry } from "../utils/otpAndExpiry";
import { AdminAttributes } from "../types/Admin.types";
import Admin from "../models/Admin.model";
import AdminTokens from "../models/Admintokens.model";
import { sendAdminOTP, sendAdminPassword } from "../mail/Admin.mail";
import { newAdminValidate } from "../validations/Admin.validate";
import { validateVerifyOTP } from "../validations/Auth.validate";
import { WhereOptions } from "sequelize";
import { AdminTokensAttributes } from "../types/AdminToken";
import dayjs from "dayjs";
import { JWTAdmin } from "../types/JWT.types";
export const newAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Validation here
  const { error, value } = newAdminValidate.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }
  const { email, firstname, lastname } = req.body as AdminAttributes;

  try {
    //Check if admin with that email exists
    const foundUser = await Admin.findOne({
      where: {
        email,
      },
    });

    if (foundUser) {
      res.status(400).send({ message: "Email is already in use" });
      return;
    }

    /// If the mail is not found, create the user
    const createdAdmin = await Admin.create({
      firstname,
      email,
      lastname,
      isVerified: false,

      //Password would be mailed to them
    });

    const otpValidityInMinutes = 10;
    const { expiry, otp } = getOtpAndExpiry(otpValidityInMinutes);

    await AdminTokens.create({
      adminId: createdAdmin.id!,
      expiresAt: expiry,
      token: otp,
      type: "verify_mail",
    });

    //Send otp to user
    await sendAdminOTP(email, otp, otpValidityInMinutes.toString());

    res.status(201).send({
      message: "Admin registered succesfully. Check your mail for an OTP.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "No payload provided." });
    return;
  }

  const { error } = validateVerifyOTP.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }

  const { email, otp } = req.body;

  try {
    const foundUser = await Admin.findOne({ where: { email } });

    // User exists?
    if (!foundUser) {
      res.status(400).send({ message: "Invalid email" });
      return;
    }

    // Already verified?
    if (foundUser.isVerified) {
      res.status(400).send({ message: "Admin is already verified" });
      return;
    }

    // Check tokens table
    const respectiveToken = await AdminTokens.findOne({
      where: {
        adminId: foundUser.id,
        type: "verify_mail",
      } as WhereOptions<AdminTokensAttributes>,
    });

    if (!respectiveToken) {
      res.status(400).send({ message: "User did not request for an OTP." });
      return;
    }

    // OTP expired?
    if (dayjs(respectiveToken.expiresAt).isBefore(dayjs())) {
      res.status(400).send({ message: "OTP has expired" });
      return;
    }

    // OTP matches?
    if (respectiveToken.token !== otp) {
      res.status(400).send({ message: "OTP is invalid." });
      return;
    }
    const genPass = generateAdminPassword();
    const hashedGenPass = await bcrypt.hash(genPass, 10);

    //Delete that record
    await respectiveToken.destroy();
    foundUser.isVerified = true;
    //Add auto generated
    foundUser.password = hashedGenPass;
    await foundUser.save();

    //Send them confirmation mail with their password
    await sendAdminPassword(foundUser.email, genPass);

    res.status(200).send({
      message: "Account Verified Successfully,check mail for your password",
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = validateAdminLogin.validate(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    //Check if admin exists
    const foundAdmin = await Admin.findOne({ where: { email } });
    if (!foundAdmin) {
      res.status(400).send({ message: "Invalid admin email" });
      return;
    }

    //Check if password is valid
    const passwordMatches = await bcrypt.compare(
      password,
      foundAdmin?.password!,
    );

    if (!passwordMatches) {
      res.status(400).send({ message: "Invalid password." });
      return;
    }

    let JWT_content: JWTAdmin = {
      id: foundAdmin.id!,
      isAdmin: true,
    };

    // JWT generation
    const token = jwt.sign(JWT_content, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
    const {
      password: pw,

      isVerified,
      deletedAt,
      ...userWithoutPassword
    } = foundAdmin.toJSON();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
