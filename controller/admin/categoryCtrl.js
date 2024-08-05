const categoryModel = require("../../model/admin/categoryModel");
// const multer=require("multer")
const subcategories = require("../../model/admin/subCategoryModel");
const path = require("path");
const fs = require("fs");

module.exports = {
  getcategory: (req, res) => {
    res.render("./admin/category", { error: "" });
  },
  postcategory: async (req, res) => {
    try {
      const { category } = req.body;
      if (
        req.file &&
        (req.file.mimetype === "image/jpeg" ||
          req.file.mimetype === "image/png")
      ) {
        const image = req.file.filename;
        const newCategory = new categoryModel({
          category,
          image,
        });
        await newCategory.save();
        res.redirect("/showCategory");
      } else {
        return res.render("./admin/category", {
          error: "Please upload a PNG or JPEG file.",
        });
      }
    } catch (error) {
      console.error(error);
      return res.render("./admin/category", {
        error: "An error occurred while processing your request.",
      });
    }
  },
  getshowCategory: async (req, res) => {
    try {
      const category = await categoryModel.aggregate([
        {
          $lookup: {
            from: "subcategories",
            localField: "_id",
            foreignField: "category",
            as: "subCategory",
          },
        },
      ]);
      res.render("./admin/showCategory", { category });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const id = req.params.id;

      // Find subcategories to delete
      const subcategoriesToDelete = await subcategories.find({ category: id });

      // Delete subcategories
      const del = await subcategories.deleteMany({ category: id });

      if (del.deletedCount > 0) {
        // Delete subcategory images
        await Promise.all(
          subcategoriesToDelete.map(async (element) => {
            const imgPath = path.join(
              __dirname,
              "../../public/images",
              element.img
            );
            try {
              await fs.promises.unlink(imgPath);
              console.log("File deleted successfully:", imgPath);
            } catch (err) {
              console.error(`Error deleting file: ${err}`);
            }
          })
        );
      }

      // Delete the category itself
      const delCategory = await categoryModel.findByIdAndDelete(id);
      if (delCategory && delCategory.image) {
        const imgPath = path.join(
          __dirname,
          "../../public/images",
          delCategory.image
        );
        try {
          await fs.promises.unlink(imgPath);
          console.log("File deleted successfully:", imgPath);
        } catch (err) {
          console.error(`Error deleting file: ${err}`);
        }
      }

      res.status(200).send({ message: "Category deleted successfully" });
    } catch (err) {
      console.error(`Error deleting category: ${err}`);
      res
        .status(500)
        .send({ message: "Error deleting category", error: err.message });
    }
  },

  getUpdateCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const findCategory = await categoryModel.findById(categoryId);
      req.session.category = findCategory;
      if (findCategory) {
        res.render("./admin/updateCategory", {
          id: findCategory._id,
          oldImage: findCategory.image,
          oldName: findCategory.category,
        });
      } else {
        res.status(404).send("category not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  },
  postUpdateCategory: async (req, res) => {
    const { category } = req.body;
    const image = req.file;
    if (
      image &&
      (image.mimetype === "image/jpeg" || image.mimetype === "image/png")
    ) {
      const updatedCategory = await categoryModel.findOneAndUpdate(
        { _id: req.params.id },
        { category, image: image.filename }
      );
      const imgPath = path.join(
        __dirname,
        "../../public/images",
        req.session.category.image
      );
      delete req.session.category;

      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
          return;
        }
        console.log("File deleted successfully");
      });
    } else {
      const updatedCategory = await categoryModel.findOneAndUpdate(
        { _id: req.params.id },
        { category }
      );
    }
    res.redirect("/showCategory");
  },
};
