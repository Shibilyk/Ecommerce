const express = require("express");
const app = express();
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const validation = require("../../middleware/dbValidation");

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

const {
  getSubCategory,
  postSubCategory,
  subCategoryDelete,
  editSubCategotyGet,
  editSubCategotypost,
} = require("../../controller/admin/subCategoryCtrl");

router
  .get("/subCategory", validation, getSubCategory)
  .post("/subCategory", upload.single("image"), postSubCategory)
  .delete("/subCetagoryDelete/:id", subCategoryDelete)
  .get("/subCategoryUpdate/:argu", validation, editSubCategotyGet)
  .post("/subCategoryUpdate/:id", upload.single("image"), editSubCategotypost);

module.exports = router;
