const bcrypt = require('bcrypt');
const { User, Role } = require('../models');
const { setFlash, consumeFlash } = require('../utils/flash');

async function getLogin(req, res) {
  res.render('auth/login', {
    title: 'Вход',
    flash: consumeFlash(req),
    user: req.session.user || null
  });
}

async function postLogin(req, res) {
  const { login, password } = req.body;

  if (!login || !password) {
    setFlash(req, 'danger', 'Введите логин и пароль.');
    return res.redirect('/login');
  }

  const user = await User.findOne({ where: { login }, include: [Role] });
  if (!user) {
    setFlash(req, 'danger', 'Неверный логин или пароль.');
    return res.redirect('/login');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    setFlash(req, 'danger', 'Неверный логин или пароль.');
    return res.redirect('/login');
  }

  req.session.user = {
    id: user.id,
    fullName: user.fullName,
    role: user.Role.name
  };

  setFlash(req, 'success', 'Вы успешно вошли в систему.');
  return res.redirect('/entities');
}

function postLogout(req, res) {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}

module.exports = { getLogin, postLogin, postLogout };
