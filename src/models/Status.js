const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Status = sequelize.define('Status', {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
});

module.exports = Status;
