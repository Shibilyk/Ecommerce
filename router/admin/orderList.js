const {getOrderList,updateOrderStatus} = require("../../controller/admin/orderList")
const express = require("express")
const router  = express.Router()

router.get("/",getOrderList)
.post("/update-order-status",updateOrderStatus)

module.exports = router