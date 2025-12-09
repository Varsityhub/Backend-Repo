import SequelizeConfig from "./db/config";
import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";

import rootRouter from "./routes";
import { setupAssociations } from "./models";
import Department from "./models/Department.model";

const app = express();
const PORT: number = 4000;

app.use(express.json());

const baseURL = "/api/v1";
app.use(`${baseURL}`, rootRouter);

app.use(errorHandler);

app.get("/create/:id",async(req:Request,res:Response,next:NextFunction)=>{

  const deptName =req.params.id
  try {
    
    await Department.create({ name:deptName });

    res.status(200).send({message:`${deptName} department created successfully`})

  } catch (error) {
    next(error)
  }
})

SequelizeConfig.sync()
  .then(() => {
    setupAssociations().then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
