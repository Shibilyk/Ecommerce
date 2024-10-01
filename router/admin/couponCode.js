const express = require("express");
const router = express.Router();
const { getCouponCode ,addCouponCode,postAddCouponCode} = require("../../controller/admin/couponCode");

router.get("/coupon-code", getCouponCode)
.get("/addCouponCode",addCouponCode)
.post("/addCouponCode",postAddCouponCode)


module.exports = router;
