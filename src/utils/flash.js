function setFlash(req, type, text) {
  req.session.flash = { type, text };
}

function consumeFlash(req) {
  const flash = req.session.flash;
  req.session.flash = null;
  return flash;
}

module.exports = { setFlash, consumeFlash };
