const express = require('express');
const router = express.Router()

const {getProductDetail,categoryProduct,getProducts} = require('../../controller/user/productDetailsCtrl')

router.get("/productDetail/:id",getProductDetail)
.get('/categoryProduct/:id',categoryProduct)
.get('/products',getProducts)

module.exports = router