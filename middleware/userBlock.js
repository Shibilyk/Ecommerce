const User = require("../model/user/userModel")
const checkBlock = (req, res, next)=>{
    if (req.session.user ) {
        const user = User.findById(req.session.user._id)
        if (user.status ==="active") {
          return  next();
        }else{
           return res.redirect("/user/login");
        }
    } else {
      if (req.originalUrl !== "/favicon.ico") {
        req.session.prepage = req.originalUrl || req.url;
      }
      res.redirect("/user/login");
    }
  }
  module.exports = checkBlock;