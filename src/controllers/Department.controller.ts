import { Request, Response, NextFunction } from "express";
import { validateNewDept } from "../validations/Department.validate";
import Department from "../models/Department.model";
import { DepartmentAttributes } from "../types/Department.types";
import { AuthRequest } from "../types/requests/middlwares";

export const newDept = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Joi validation
    const { error, value } = validateNewDept.validate(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { name } = req.body as DepartmentAttributes;
    const user =  (req as AuthRequest).user

    // Check if dept exists already
    const foundDept = await Department.findOne({ where: { name } });

    if (foundDept) {
      return res
        .status(400)
        .send({ message: `Department with name: ${name} already exists.` });
    }

    await Department.create({ name ,userId:user.id});

    return res.status(201).send({
      message: "New Department created successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDepartments = async(req:Request,res:Response,next:NextFunction)=>{

  try {
    const allDepartments = await Department.findAll()

    res.status(200).send({message:"Departments fetched succesfully",departments:allDepartments})

  } catch (error) {
    next(error)
  }

}