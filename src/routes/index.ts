import express, { Router } from "express";
import Department from "./Department.routes";
import Auth from "./Auth.routes";

const rootRouter = Router();

rootRouter.use("/auth",Auth)
rootRouter.use("/departments", Department);

export default rootRouter;
