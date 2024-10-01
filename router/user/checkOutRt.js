// routes/payment.js
const express = require('express');
const router = express.Router();
const {checkOutPage,addressForm,razorpayPost,editAddress,couponCode,verifyPayment} = require("../../controller/user/checkOutCtrl")

router.get('/check-out',checkOutPage)
.post('/address-form',addressForm)
.post('/validate-coupon',couponCode)
.post('/edit-address/:id',editAddress)
.post('/createOrder',razorpayPost)
.post('/verifyPayment', verifyPayment)


module.exports = router;

