import User from "../models/User.model";
import dayjs from "dayjs";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request, Response, NextFunction } from "express";
import { newUserValidate, validateLogin, validateVerifyOTP } from "../validations/Auth.validate";

import Department from "../models/Department.model";
import { SendOTP } from "../mail/Auth.mail";
import { getOtpAndExpiry } from "../utils/otpAndExpiry";

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
    if(foundUser){
        return res.status(400).send({message:"User already exits",success:false})
    }


    //Check if department is valid
    const foundDept = await Department.findByPk(departmentId)
    if(!foundDept){
        res.status(400).send({message:"Department does not exist."})
        return
    }

    const otpDuration =  10
    const saltRounds:number = 10
    const {otp,expiry} = getOtpAndExpiry(otpDuration)
    const hashedPassword  = await bcrypt.hash(password,saltRounds)

    //Send OTP email
    await SendOTP(email,otp,otpDuration.toString())

    await User.create({
      departmentId,
      email,
      firstname,
      lastname,
      level,
      otp,
      otpExpires:expiry,
      password:hashedPassword
    })

    res.status(201).send({message:"Check your mail for an OTP.",success:true})

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

    // OTP expired?
    if (dayjs(foundUser.otpExpires).isBefore(dayjs())) {
      res.status(400).send({ message: "OTP has expired" });
      return;
    }

    // OTP matches?
    if (foundUser.otp !== otp) {
      res.status(400).send({ message: "OTP is invalid." });
      return;
    }

    // Update verification
    foundUser.isVerified = true;
    (foundUser.otp = null), (foundUser.otpExpires = null);
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
      otp,
      otpExpires,
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
