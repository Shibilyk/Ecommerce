const express = require('express');
const router = express.Router()

const{getHome,getProductDataFromButtonClick,searchFunction}= require('../../controller/user/homeCntrl')

router.get("/user/home",getHome)
.get('/api/productdata/:id',getProductDataFromButtonClick)
.post('/search',searchFunction)
module.exports = router