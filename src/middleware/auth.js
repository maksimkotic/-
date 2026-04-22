function isAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  return next();
}

function hasRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }

    if (!allowedRoles.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        title: 'Доступ запрещен',
        message: 'У вас недостаточно прав для выполнения этого действия.',
        user: req.session.user
      });
    }

    return next();
  };
}

module.exports = { isAuth, hasRole };
