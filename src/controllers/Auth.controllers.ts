import User from "../models/User.model";

import { Request, Response, NextFunction } from "express";
import { newUserValidate } from "../validations/Auth.validate";

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
    const {otp,expiry} = getOtpAndExpiry(otpDuration)
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
      password
    })

    res.status(201).send({message:"Check your mail for an OTP.",success:true})

  } catch (error) {
    next(error);
  }
};
