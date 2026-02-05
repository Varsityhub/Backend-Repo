import { Sequelize as SQL } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const { DB_NAME, DB_PASSWORD, DB_USERNAME, DB_HOST, CA_PATH } = process.env;
let ca;

if (!CA_PATH) {
  console.log("CA_PATH is not in the environment variables");
} else {
  let ca = fs.readFileSync(process.env.CA_PATH!, "utf8");
}

const SequelizeConfig = new SQL(
  DB_NAME as string,
  DB_USERNAME as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ...(CA_PATH && {
        ssl: {
          ca, // <<-- CA certificate content
          //  Optional: requestCert: true, rejectUnauthorized: true // default secure behavior
        },
      }),
    },
  }
);

export default SequelizeConfig;
