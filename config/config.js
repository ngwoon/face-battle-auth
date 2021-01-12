module.exports = {
  development: {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.HOST,
    "dialect": "mysql",
    "operatorAliases":false
  },
  test: {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.HOST,
    "dialect": "mysql",
    "operatorAliases":false
  },
  production: {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.HOST,
    "dialect": "mysql",
    "operatorAliases":false
  }
}
