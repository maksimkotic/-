const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entity = sequelize.define('Entity', {
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  priceOrBudget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
});

module.exports = Entity;
