import SequelizeConfig from "./db/config";
import express from "express"
import { errorHandler } from "./middlewares/errorHandler";

import rootRouter from "./routes";

const app = express()
const PORT:number = 4000

app.use(express.json())

const baseURL = "/api/v1"
app.use(`${baseURL}`,rootRouter)

app.use(errorHandler)

SequelizeConfig.sync().then(()=>{
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
    
})
}).catch((err)=>{
    console.log(err);
    
})