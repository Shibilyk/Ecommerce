const express = require("express");
const router = express.Router();
// const validation = require('../middleware/validation')
const {
  registerGet,
  registerPost,
  verifyOtpPost,
  resendOtpGet,
  loginGet,
  loginPost,
  forgetPassword,
  postForgetPassword,
  resetPassword,
  postResetPassword,
  myAccount,
  postMyAccount,
  logOut
} = require("../../controller/user/authenticationCtrl");

router
  .get("/register", registerGet)
  .post("/register", registerPost)
  .post("/otp", verifyOtpPost)
  .get("/resendOtp", resendOtpGet)
  .get("/login", loginGet)
  .post("/login", loginPost)
  .get('/forget',forgetPassword)
  .post('/forget',postForgetPassword)
  .get('/reset',resetPassword)
  .post('/reset',postResetPassword)
  .get('/myAccount',myAccount)
  .post('/myAccount',postMyAccount)
  .get('/logOut', logOut)
//   .post('/delete', userController.deleteDetails)

module.exports = router;
