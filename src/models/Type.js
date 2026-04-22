const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Type = sequelize.define('Type', {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
});

module.exports = Type;
