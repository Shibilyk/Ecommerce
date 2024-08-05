const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the directory exists
const dir = path.join(__dirname, "../../public/images");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// File filter to allow only JPEG and PNG
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Controllers
const {
  getcategory,
  postcategory,
  getshowCategory,
  deleteCategory,
  getUpdateCategory,
  postUpdateCategory
} = require("../../controller/admin/categoryCtrl");

router
  .get("/category", getcategory)
  .post("/category", upload.single("image"),postcategory)
  .get("/showCategory", getshowCategory)
  .delete('/deleteCategory/:id',deleteCategory)
  .get("/updateCategory/:id",getUpdateCategory)
  .post("/updateCategory/:id",upload.single("image"),postUpdateCategory)

module.exports = router;
