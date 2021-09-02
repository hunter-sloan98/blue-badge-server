const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:12de02d9ace2444ca76afc1805370941@localhost:5432/blue-badge-server");

module.exports = sequelize;

