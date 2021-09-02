const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:" + process.env.password + "@localhost:5432/blue-badge-server");

module.exports = sequelize;