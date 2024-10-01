const express = require("express");
const validation = require("../../middleware/dbValidation")
const router = express.Router();
const {
  getProduct,
  postProduct,
} = require("../../controller/admin/adminController");

router.get("/home", validation,getProduct).post("/home",validation, postProduct);

module.exports = router;

