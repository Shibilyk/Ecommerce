const express = require('express');
const router = express.Router()

const {getProductDetail,categoryProduct} = require('../../controller/user/productDetailsCtrl')

router.get("/productDetail/:id",getProductDetail)
.get('/categoryProduct/:id',categoryProduct)

module.exports = router