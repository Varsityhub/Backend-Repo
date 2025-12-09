const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require:true,
        ca: fs.readFileSync(process.env.CA_PATH) ,
          rejectUnauthorized: false
      }
    }
  }
};
