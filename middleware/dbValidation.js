function validation(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    if (req.originalUrl !== "/favicon.ico") {
      req.session.prepage = req.originalUrl || req.url;
    }
    res.redirect("/user/login");
  }
}
module.exports = validation;
