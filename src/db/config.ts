import {Sequelize as SQL} from "sequelize";
import dotenv from "dotenv"

dotenv.config()

const { DB_NAME, DB_PASSWORD, DB_USERNAME } = process.env


const SequelizeConfig = new SQL(DB_NAME as string, DB_USERNAME as string, DB_PASSWORD as string, {
    host: "localhost",
    dialect:"mysql",
    logging:false
})


export default SequelizeConfig