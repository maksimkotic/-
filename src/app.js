require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const { isAuth } = require('./middleware/auth');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(authRoutes);

app.get('/', isAuth, (req, res) => {
  res.render('home', {
    title: 'Главная',
    user: req.session.user,
    ticketTask: 'Здесь размещается задание билета: предметная область, поля сущности, фильтры и требования к ролям.'
  });
});

app.use((req, res) => {
  res.status(404).send('404');
});

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => app.listen(PORT, () => console.log(`http://localhost:${PORT}`)))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
