const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Status = require('./Status');
const Type = require('./Type');
const Entity = require('./Entity');

Role.hasMany(User, { foreignKey: { allowNull: false } });
User.belongsTo(Role);

Status.hasMany(Entity, { foreignKey: { allowNull: false } });
Entity.belongsTo(Status);

Type.hasMany(Entity, { foreignKey: { allowNull: false } });
Entity.belongsTo(Type);

User.hasMany(Entity, { as: 'assignedEntities', foreignKey: 'assigneeId' });
Entity.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });

User.hasMany(Entity, { as: 'createdEntities', foreignKey: { name: 'createdBy', allowNull: false } });
Entity.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });

module.exports = {
  sequelize,
  Role,
  User,
  Status,
  Type,
  Entity
};
