const {getOrderList} = require("../../controller/admin/orderList")
const express = require("express")
const router  = express.Router()

router.get("/",getOrderList);

module.exports = router