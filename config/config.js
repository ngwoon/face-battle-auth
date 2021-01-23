const dotenv = require("dotenv");
const path = require("path");

if(process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.join(__dirname, "../env/development.env")});
} else if(process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(__dirname, "../env/production.env")});
}

module.exports = {
  development: {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "operatorAliases":false
  },
  test: {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mariadb",
    "operatorAliases":false
  },
  production: {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mariadb",
    "operatorAliases":false
  }
}
