// routes/payment.js
const express = require('express');
const router = express.Router();
const razorpayInstance = require('../../config/razorpay');
const {checkOutPage,addressForm,razorpayPost} = require("../../controller/user/checkOutCtrl")

router.get('/check-out',checkOutPage)
.post('/address-form',addressForm)
router.post('/create-order',razorpayPost);
// routes/payment.js
router.post('/capture-payment', async (req, res) => {
    const { payment_id, order_id, signature } = req.body;

    // Verify signature (optional but recommended)
    const crypto = require('crypto');
    const generatedSignature = crypto.createHmac('sha256', razorpayInstance.key_secret)
                                     .update(order_id + '|' + payment_id)
                                     .digest('hex');

    if (generatedSignature !== signature) {
        return res.status(400).send('Signature verification failed');
    }

    try {
        const payment = await razorpayInstance.payments.capture(payment_id, req.body.amount);
        res.json(payment);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;

