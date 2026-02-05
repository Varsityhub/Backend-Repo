import express, { Router } from "express";
import Department from "./Department.routes";
import Auth from "./Auth.routes";
import Admin from "./Admin.routes";

const rootRouter = Router();

rootRouter.use("/auth",Auth)
rootRouter.use("/admin",Admin)
rootRouter.use("/departments", Department);

export default rootRouter;
