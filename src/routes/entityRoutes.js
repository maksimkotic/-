const { Router } = require('express');
const {
  listEntities,
  newEntityForm,
  createEntity,
  editEntityForm,
  updateEntity,
  deleteEntity
} = require('../controllers/entityController');
const { isAuth, hasRole } = require('../middleware/auth');

const router = Router();

router.get('/entities', isAuth, listEntities);
router.get('/entities/new', isAuth, hasRole('admin', 'manager'), newEntityForm);
router.post('/entities', isAuth, hasRole('admin', 'manager'), createEntity);
router.get('/entities/:id/edit', isAuth, hasRole('admin', 'manager'), editEntityForm);
router.post('/entities/:id', isAuth, hasRole('admin', 'manager'), updateEntity);
router.post('/entities/:id/delete', isAuth, hasRole('admin', 'manager'), deleteEntity);

module.exports = router;
