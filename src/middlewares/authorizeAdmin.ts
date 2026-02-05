import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/requests/middlwares";
import { JWTAdmin } from "../types/JWT.types";

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTAdmin;

    if(!decoded.isAdmin){
        return res.status(400).send({message:"Unauthorized access"})
    }


    (req as AuthRequest).user = decoded; // contains id, role, etc.
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
