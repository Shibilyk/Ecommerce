const mongoose = require("mongoose");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require('path')
const categoryModel = require("../../model/admin/categoryModel");
const subCategoryModel = require("../../model/admin/subCategoryModel");

module.exports = {
  getSubCategory: async (req, res) => {
    try {
      const category = await categoryModel.find({});
      res.render("./admin/subCategory", { category, error: "", success: "" });
    } catch (error) {
      console.error(error);
      res.render("./admin/subCategory", {
        category: [],
        error: "Failed to load categories.",
        success: "",
      });
    }
  },

  postSubCategory: async (req, res) => {
    try {
      const { category, subCategory } = req.body;
      const image = req.file;
      const categoryList = await categoryModel.find({});

      const fcategory = await categoryModel.findOne({ category: category });
      if (!fcategory) {
        req.flash("error_msg", "Category not found");
        return res.redirect("/subCategory");
      }

      const alReadyExist = await subCategoryModel.findOne({
        category: fcategory._id,
        subCategory: subCategory,
      });

      if (alReadyExist) {
        req.flash("error_msg", "Sub category already exists");
        return res.redirect("/subCategory");
      }

      if (
        image &&
        (image.mimetype === "image/jpeg" || image.mimetype === "image/png")
      ) {
        const newSubCategory = new subCategoryModel({
          subCategory,
          category: fcategory._id,
          img: image.filename,
        });
        await newSubCategory.save();
        return res.render("./admin/subCategory", {
          category: categoryList,
          error: "",
          success: "New sub category added",
        });
      } else {
        return res.render("./admin/subCategory", {
          category: categoryList,
          error: "Please upload a PNG or JPEG file.",
          success: "",
        });
      }
    } catch (error) {
      console.error(error);
      const categoryList = await categoryModel.find({});
      return res.render("./admin/subCategory", {
        category: categoryList,
        error: "An error occurred while adding the sub category.",
        success: "",
      });
    }
  },
  subCategoryDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const fdata = await subCategoryModel.findOne({ _id: id });
      const imgPath = path.join(__dirname, "../../public/images", fdata.img);
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
        }
        console.log("File deleted successfully");
      });
      console.log(`Attempting to delete item with id: ${id}`);
      const result = await subCategoryModel.deleteOne({ _id: id });

      if (result.deletedCount > 0) {
        res
          .status(200)
          .send({ success: true, message: "Item deleted successfully" });
      } else {
        res.status(404).send({ error: "Item not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ error: "Failed to delete the item" });
    }
  },
  editSubCategotyGet: async (req, res) => {
    try {
      const categoryId = req.params.argu;
      const findCategory = await subCategoryModel.findById(categoryId);
      req.session.category = findCategory;
      if (findCategory) {
        res.render("./admin/updateCategories", {
          id: findCategory._id,
          oldImage: findCategory.img,
          oldName: findCategory.subCategory,
        });
      } else {
        res.status(404).send("Subcategory not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  },
  editSubCategotypost: async (req, res) => {
    const { subCategory } = req.body;
    const image = req.file;
    if (
      image &&
      (image.mimetype === "image/jpeg" || image.mimetype === "image/png")
    ) {
      const updatedCategory = await subCategoryModel.findOneAndUpdate(
        { _id: req.params.id },
        { subCategory, img: image.filename }
      );
      const imgPath = path.join(
        __dirname,
        "../../public/images",
        req.session.category.img
      );

      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
          return;
        }
        console.log("File deleted successfully");
      });
      delete req.session.category
    } else {
      const updatedCategory = await subCategoryModel.findOneAndUpdate(
        { _id: req.params.id },
        { subCategory }
      );
    }
    res.redirect("/showCategory");
  },
};
