import User from "../models/User.model";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import {
  newUserValidate,
  validateLogin,
  validateVerifyOTP,
} from "../validations/Auth.validate";
import UserTokens from "../models/Usertokens.model";
import Department from "../models/Department.model";
import { SendForgotPasswordOTP, SendOTP } from "../mail/Auth.mail";
import { getOtpAndExpiry } from "../utils/otpAndExpiry";
import { UserTokensAttributes } from "../types/UserTokens";
import { WhereOptions } from "sequelize";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, email, level, password, departmentId } =
      req.body;

    //Joi Validation here

    const { error } = newUserValidate.validate(req.body);
    if (error) {
      return res.status(400).send({
        success: true,
        message: error.details[0].message,
      });
    }

    //Check if user exists
    const foundUser = await User.findOne({ where: { email } });
    if (foundUser) {
      return res
        .status(400)
        .send({ message: "User already exits", success: false });
    }

    //Check if department is valid
    const foundDept = await Department.findByPk(departmentId);
    if (!foundDept) {
      res.status(400).send({ message: "Department does not exist." });
      return;
    }

    const otpDuration = 10;
    const saltRounds: number = 10;
    const { otp, expiry } = getOtpAndExpiry(otpDuration);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdUser = await User.create({
      departmentId,
      email,
      firstname,
      lastname,
      level,
      password: hashedPassword,
    });

    //Create token
    await UserTokens.create({
      token: otp,
      expiresAt: expiry,
      userId: createdUser.id!,
      type: "verify_mail",
    });

    //Send OTP email
    await SendOTP(email, otp, otpDuration.toString());

    res
      .status(201)
      .send({ message: "Check your mail for an OTP.", success: true });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    const foundUser = await User.findOne({ where: { email } });

    // User exists?
    if (!foundUser) {
      res.status(400).send({ message: "Invalid email" });
      return;
    }

    // Already verified?
    if (foundUser.isVerified) {
      res.status(400).send({ message: "User is already verified" });
      return;
    }

    // Check tokens table
    const respectiveToken = await UserTokens.findOne({
      where: {
        userId: foundUser.id,
        type: "verify_mail",
      } as WhereOptions<UserTokensAttributes>,
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

    //Delete that record
    await respectiveToken.destroy();
    foundUser.isVerified = true;
    await foundUser.save();

    res.status(200).send({ message: "Account Verified Successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "No payload provided." });
    return;
  }

  const { error } = validateLogin.validate(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message });
    return;
  }

  const { email, password } = req.body;

  try {
    //Check if user exists
    const foundUser = await User.findOne({ where: { email } });

    if (!foundUser) {
      res.status(400).send({ message: "Invalid Email" });
      return;
    }

    if (!foundUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatches) {
      res.status(400).send({ message: "Invalid Password" });
      return;
    }

    // JWT generation
    const token = jwt.sign(
      {
        id: foundUser.id,
        // email: foundUser.email,
        // phone: foundUser.phone,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    const {
      password: pw,

      isVerified,
      deletedAt,
      ...userWithoutPassword
    } = foundUser.toJSON();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const requestRegisterOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Joi Validation
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "No payload provided." });
    return;
  }

  if (!req.body.email) {
    res.status(400).send({ message: "Kindly provide an email." });
    return;
  }

  const { email } = req.body;
  const otpDuration = 10;
  try {
    //Check if user exists
    const foundUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!foundUser) {
      res.status(400).send({ message: "User not found." });
      return;
    }

    //Check if user has already been verified
    if (foundUser.isVerified) {
      res.status(400).send({ message: "User has been verified already." });
      return;
    }

    //Check if token specific token exist
    const foundToken = await UserTokens.findOne({
      where: {
        userId: foundUser.id,
        type: "verify_mail",
      },
    });

    const { otp: newOTP, expiry } = getOtpAndExpiry(otpDuration);
    if (!foundToken) {
      //Create one for them if it was not created
      await UserTokens.create({
        userId: foundUser.id!,
        expiresAt: expiry,
        token: newOTP,
        type: "verify_mail",
      });

      //Send OTP email
      await SendOTP(email, newOTP, otpDuration.toString());

      res.status(200).send({ message: "OTP sent to your mail", success: true });
      return;
    } else {
      //Update the token
      foundToken.token = newOTP;
      foundToken.expiresAt = expiry;
      foundToken.type = "verify_mail";
      await foundToken.save();

      ///Send the updated token
      await SendOTP(email, newOTP, otpDuration.toString());

      res.status(200).send({ message: "OTP sent to your mail", success: true });
    }
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "No payload provided." });
    return;
  }

  if (!req.body.email) {
    res.status(400).send({ message: "Provide an email." });
    return;
  }

  const { email } = req.body;

  try {
    const foundUser = await User.findOne({
      where: { email, isVerified: true },
    });

    if (!foundUser) {
      res.status(400).send({ message: "Invalid Email" });
      return;
    }
    const limitDuration: number = 10;
    const { expiry, otp } = getOtpAndExpiry(limitDuration);

    // create a forgot password token otp
    const existing = await UserTokens.findOne({
      where: { userId: foundUser.id, type: "forgot_password" },
    });
    if (existing) {
      existing.token = otp;
      existing.expiresAt = expiry;
      await existing.save();
    } else {
      await UserTokens.create({
        token: otp,
        expiresAt: expiry,
        type: "forgot_password",
        userId: foundUser.id!,
      });
    }

    //Send Mail for OTP
    await SendForgotPasswordOTP(email, otp, limitDuration.toString());

    res
      .status(200)
      .send({
        message: "Submitted Successfully! , Check your email for confirmation.",
      });
  } catch (error) {
    next(error);
  }
};

export const requestForgotOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Joi Validation
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "No payload provided." });
    return;
  }

  if (!req.body.email) {
    res.status(400).send({ message: "Kindly provide an email." });
    return;
  }

  const { email } = req.body;
  const otpDuration = 10;
  try {
    //Check if user exists
    const foundUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!foundUser) {
      res.status(400).send({ message: "User not found." });
      return;
    }

    //Check if user has already been verified
    if (foundUser.isVerified) {
      res.status(400).send({ message: "User has been verified already." });
      return;
    }

    //Check if token specific token exist
    const foundToken = await UserTokens.findOne({
      where: {
        userId: foundUser.id,
        type: "forgot_password",
      },
    });

    const { otp: newOTP, expiry } = getOtpAndExpiry(otpDuration);
    if (!foundToken) {
      //Create one for them if it was not created
      await UserTokens.create({
        userId: foundUser.id!,
        expiresAt: expiry,
        token: newOTP,
        type: "forgot_password",
      });

      //Send OTP email
      await SendOTP(email, newOTP, otpDuration.toString());

      res.status(200).send({ message: "OTP sent to your mail", success: true });
      return;
    } else {
      //Update the token
      foundToken.token = newOTP;
      foundToken.expiresAt = expiry;
      foundToken.type = "forgot_password";
      await foundToken.save();

      ///Send the updated token
      await SendOTP(email, newOTP, otpDuration.toString());

      res.status(200).send({ message: "OTP sent to your mail", success: true });
    }
  } catch (error) {
    next(error);
  }
};