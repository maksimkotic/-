const bcrypt = require('bcrypt');
const { User } = require('../models');

function getRegister(req, res) {
  res.render('register', { title: 'Регистрация', error: null });
}

async function postRegister(req, res) {
  const { fullName, login, password } = req.body;

  if (!fullName || !login || !password) {
    return res.render('register', { title: 'Регистрация', error: 'Заполните все поля.' });
  }

  const existing = await User.findOne({ where: { login } });
  if (existing) {
    return res.render('register', { title: 'Регистрация', error: 'Логин уже занят.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ fullName, login, passwordHash, role: 'user' });
  return res.redirect('/login');
}

function getLogin(req, res) {
  res.render('login', { title: 'Авторизация', error: null });
}

async function postLogin(req, res) {
  const { login, password } = req.body;
  const user = await User.findOne({ where: { login } });

  if (!user) {
    return res.render('login', { title: 'Авторизация', error: 'Неверный логин или пароль.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.render('login', { title: 'Авторизация', error: 'Неверный логин или пароль.' });
  }

  req.session.user = { id: user.id, fullName: user.fullName, role: user.role };
  return res.redirect('/');
}

function logout(req, res) {
  req.session.destroy(() => res.redirect('/login'));
}

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  logout
};
