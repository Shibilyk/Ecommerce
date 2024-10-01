const express = require("express");
const router = express.Router();
const {getListUser,userBlock,changeUserType} = require("../../controller/admin/userListCtrl")
router.get("/user",getListUser)
.post("/userBlock",userBlock)
.post("/change-userType",changeUserType)

module.exports = router
