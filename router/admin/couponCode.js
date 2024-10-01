const express = require("express");
const router = express.Router();
const {
  getCouponCode,
  addCouponCode,
  postAddCouponCode,
  editCoupon,
  postEditCoupon,
  deleteCoupon,
} = require("../../controller/admin/couponCode");

router
  .get("/coupon-code", getCouponCode)
  .get("/addCouponCode", addCouponCode)
  .post("/addCouponCode", postAddCouponCode)
  .get("/editCoupon/:id", editCoupon)
  .post("/editCoupon/:id", postEditCoupon)
  .post("/deleteCoupon/:id", deleteCoupon);

module.exports = router;
