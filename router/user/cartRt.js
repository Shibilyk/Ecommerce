const express = require("express");
const router = express.Router();

const { addToCart, viewCart,quantity,cartRemove,getAddToCart } = require("../../controller/user/cartCtrl");

router.get("/add/:id", getAddToCart).post("/add/:id", addToCart)
.get("/", viewCart)
.post("/quantity/:id",quantity)
.post('/remove/:productId',cartRemove)

module.exports = router;
