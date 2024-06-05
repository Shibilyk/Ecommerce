const express = require('express');
const router = express.Router();
const {getProduct,postProduct} =require('../../controller/admin/adminController');


router.get('/home',getProduct)
.post('/home',postProduct)

module.exports  = router