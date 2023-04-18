const Sequelize = require('sequelize');
require("dotenv").config();

console.log("aaaaaaaaaaaaaaaaaaaa=>",process.env.SQL_PASSWORD)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER_NAME, process.env.SQL_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST
});

module.exports = sequelize;
