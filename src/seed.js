require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Role, User, Status, Type } = require('./models');

async function seed() {
  await sequelize.sync({ alter: true });

  const roleNames = ['admin', 'manager', 'user'];
  const statusNames = ['new', 'in_progress', 'done', 'rejected'];
  const typeNames = ['type_a', 'type_b', 'type_c'];

  const roles = {};
  for (const name of roleNames) {
    const [role] = await Role.findOrCreate({ where: { name } });
    roles[name] = role;
  }

  for (const name of statusNames) {
    await Status.findOrCreate({ where: { name } });
  }

  for (const name of typeNames) {
    await Type.findOrCreate({ where: { name } });
  }

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await User.findOrCreate({
    where: { login: 'admin' },
    defaults: {
      fullName: 'Администратор',
      passwordHash: adminPasswordHash,
      RoleId: roles.admin.id
    }
  });

  console.log('Seed completed. Login: admin / Password: admin123');
  await sequelize.close();
}

seed().catch(async (error) => {
  console.error(error);
  await sequelize.close();
  process.exit(1);
});
