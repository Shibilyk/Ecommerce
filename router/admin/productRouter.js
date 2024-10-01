const express = require("express");
const app = express();
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const validation = require("../../middleware/dbValidation")


///////////////////////////////////////////

const dir = path.join(__dirname, "../../public/product");
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
    cb(null, "public/product");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

const {
  getAddProduct,
  postProduct,
  getSubCategory,
  showProduct,
  productDelete,
  productUpdate,
  productUpdatePost,
  showImage
} = require("../../controller/admin/productCtrl");

router
  .get("/product",validation, getAddProduct)
  .post(
    "/product",
    upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    postProduct
  )
  .get("/getSubCategory/:id",validation, getSubCategory)
  .get("/showProduct",validation, showProduct)
  .delete("/products/delete/:id", productDelete)
  .get("/updateProduct/:id",validation, productUpdate)
  .post(
    "/updateProduct/:id",
    upload.fields([
      { name: "mainImage", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    productUpdatePost
  )
  .get("/imageShow/:id",validation,showImage)

module.exports = router;
