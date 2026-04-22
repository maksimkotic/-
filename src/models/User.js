const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  login: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'user'
  }
});

module.exports = User;
