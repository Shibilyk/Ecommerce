const express = require('express');
const router = express.Router()

const{getHome,getProductDataFromButtonClick}= require('../../controller/user/homeCntrl')

router.get("/user/home",getHome)
.get('/api/productdata/:id',getProductDataFromButtonClick)

module.exports = router