require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const entityRoutes = require('./routes/entityRoutes');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  return res.redirect('/entities');
});

app.use(authRoutes);
app.use(entityRoutes);

app.use((req, res) => {
  res.status(404).render('error', {
    title: '404',
    message: 'Страница не найдена.',
    user: req.session.user || null
  });
});

app.use((error, req, res, _next) => {
  console.error(error);
  res.status(500).render('error', {
    title: 'Ошибка сервера',
    message: 'Произошла внутренняя ошибка сервера.',
    user: req.session.user || null
  });
});

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('DB connection error:', error.message);
    process.exit(1);
  });
