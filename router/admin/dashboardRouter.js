const express = require("express");
const router = express.Router();
const {
    getDashboard
} = require("../../controller/admin/dashboardCtrl");

router.get("/",getDashboard )

module.exports = router;
