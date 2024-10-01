function validation(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    if (req.originalUrl !== "/favicon.ico") {
      const requestedUrl = req.originalUrl || req.url;
      req.session.prepage = requestedUrl;
    }
    res.redirect("/user/login");
  }
}
module.exports = validation;
