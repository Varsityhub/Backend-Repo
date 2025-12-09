const fs = require("fs");
// const dotenv = require("dotenv");
// dotenv.config();

// module.exports = {
//   development: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 4000,
//     dialect: "mysql",
//     dialectOptions: {
//       ssl: {
//         require:true,
//         ca: fs.readFileSync(process.env.CA_PATH) ,
//           rejectUnauthorized: false
//       }
//     }
//   }
// };




const dotenv = require("dotenv")
const detectEnvironment = process.env.NODE_ENV
dotenv.config()
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        //Set the property to true on deployment and false if locally
        // rejectUnauthorized:  (!detectEnvironment || detectEnvironment === "production") ? false : true,
                ca: fs.readFileSync(process.env.CA_PATH) ,
        rejectUnauthorized: true
      },
    },
  },
};


require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // use false for local migrations
                ca: fs.readFileSync(process.env.CA_PATH) ,
      },
    },
  },
  // test: {
  //   username: process.env.DB_USER,
  //   password: process.env.DB_PASS,
  //   database: process.env.DB_NAME,
  //   host: process.env.DB_HOST,
  //   dialect: 'mysql',
  //   port: process.env.DB_PORT || 3306,
  // },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
                ca: fs.readFileSync(process.env.CA_PATH) ,
        rejectUnauthorized: false, // use false for local migrations
      },
    },
  },
};