import SequelizeConfig from "./db/config";
import express from "express"

const app = express()
const PORT:number = 4000


SequelizeConfig.sync().then(()=>{
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
    
})
}).catch((err)=>{
    console.log(err);
    
})