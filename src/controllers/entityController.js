const { Op } = require('sequelize');
const { Entity, Status, Type, User } = require('../models');
const { setFlash, consumeFlash } = require('../utils/flash');

async function listEntities(req, res) {
  const { statusId, typeId, assigneeId, dateFrom, dateTo } = req.query;

  const where = {};

  if (statusId) where.StatusId = statusId;
  if (typeId) where.TypeId = typeId;
  if (assigneeId) where.assigneeId = assigneeId;

  if (dateFrom || dateTo) {
    where.startDate = {};
    if (dateFrom) where.startDate[Op.gte] = dateFrom;
    if (dateTo) where.startDate[Op.lte] = dateTo;
  }

  const [entities, statuses, types, users] = await Promise.all([
    Entity.findAll({
      where,
      include: [Status, Type, { model: User, as: 'assignee' }, { model: User, as: 'creator' }],
      order: [['createdAt', 'DESC']]
    }),
    Status.findAll({ order: [['name', 'ASC']] }),
    Type.findAll({ order: [['name', 'ASC']] }),
    User.findAll({ order: [['fullName', 'ASC']] })
  ]);

  return res.render('entities/index', {
    title: 'Список сущностей',
    entities,
    statuses,
    types,
    users,
    filters: { statusId, typeId, assigneeId, dateFrom, dateTo },
    flash: consumeFlash(req),
    user: req.session.user
  });
}

async function newEntityForm(req, res) {
  const [statuses, types, users] = await Promise.all([
    Status.findAll({ order: [['name', 'ASC']] }),
    Type.findAll({ order: [['name', 'ASC']] }),
    User.findAll({ order: [['fullName', 'ASC']] })
  ]);

  res.render('entities/form', {
    title: 'Новая запись',
    entity: null,
    statuses,
    types,
    users,
    flash: consumeFlash(req),
    user: req.session.user
  });
}

async function createEntity(req, res) {
  const { title, description, startDate, endDate, priceOrBudget, statusId, typeId, assigneeId } = req.body;

  if (!title || !description || !startDate || !endDate || !statusId || !typeId) {
    setFlash(req, 'danger', 'Заполните обязательные поля.');
    return res.redirect('/entities/new');
  }

  await Entity.create({
    title,
    description,
    startDate,
    endDate,
    priceOrBudget: priceOrBudget || null,
    StatusId: statusId,
    TypeId: typeId,
    assigneeId: assigneeId || null,
    createdBy: req.session.user.id
  });

  setFlash(req, 'success', 'Запись успешно создана.');
  return res.redirect('/entities');
}

async function editEntityForm(req, res) {
  const entity = await Entity.findByPk(req.params.id);
  if (!entity) {
    return res.status(404).render('error', {
      title: 'Не найдено',
      message: 'Запись не найдена.',
      user: req.session.user
    });
  }

  const [statuses, types, users] = await Promise.all([
    Status.findAll({ order: [['name', 'ASC']] }),
    Type.findAll({ order: [['name', 'ASC']] }),
    User.findAll({ order: [['fullName', 'ASC']] })
  ]);

  return res.render('entities/form', {
    title: 'Редактирование записи',
    entity,
    statuses,
    types,
    users,
    flash: consumeFlash(req),
    user: req.session.user
  });
}

async function updateEntity(req, res) {
  const entity = await Entity.findByPk(req.params.id);
  if (!entity) {
    return res.status(404).render('error', {
      title: 'Не найдено',
      message: 'Запись не найдена.',
      user: req.session.user
    });
  }

  const { title, description, startDate, endDate, priceOrBudget, statusId, typeId, assigneeId } = req.body;

  await entity.update({
    title,
    description,
    startDate,
    endDate,
    priceOrBudget: priceOrBudget || null,
    StatusId: statusId,
    TypeId: typeId,
    assigneeId: assigneeId || null
  });

  setFlash(req, 'success', 'Запись успешно обновлена.');
  return res.redirect('/entities');
}

async function deleteEntity(req, res) {
  const entity = await Entity.findByPk(req.params.id);
  if (!entity) {
    setFlash(req, 'danger', 'Запись не найдена.');
    return res.redirect('/entities');
  }

  await entity.destroy();
  setFlash(req, 'success', 'Запись удалена.');
  return res.redirect('/entities');
}

module.exports = {
  listEntities,
  newEntityForm,
  createEntity,
  editEntityForm,
  updateEntity,
  deleteEntity
};
