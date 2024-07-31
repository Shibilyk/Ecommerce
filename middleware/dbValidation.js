
function validation(req,res,next){
    if (req.session.user) {
        next()
      }
      else{
        req.session.prepage = `/cart${req.url}`;
        res.redirect("/user/login");
      }
}
module.exports = validation