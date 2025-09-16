import { Request, Response, NextFunction } from "express";
import { validateNewDept } from "../validations/Department.validate";
import Department from "../models/Department.model";
import { DepartmentAttributes } from "../types/Department.types";

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

    // Check if dept exists already
    const foundDept = await Department.findOne({ where: { name } });

    if (foundDept) {
      return res
        .status(400)
        .send({ message: `Department with name: ${name} already exists.` });
    }

    await Department.create({ name });

    return res.status(201).send({
      message: "New Department created successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

