const express = require('express');
const router = express.Router()

const {getWishlist,addWishlist,getAddWishlist,removeWishlist} = require("../../controller/user/wishListCtrl")

router.get("/wishlist",getWishlist)
.post("/add-wishlist",addWishlist)
.get("/add-wishlist",getAddWishlist)
.post("/remove-wishlish",removeWishlist);

module.exports = router