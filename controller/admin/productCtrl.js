const mongoose = require("mongoose");
const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const productModel = require("../../model/admin/productModel");
const categoryModel = require("../../model/admin/categoryModel");
const subCategoryModel = require("../../model/admin/subCategoryModel");

module.exports = {
  getAddProduct: async (req, res) => {
    const category = await categoryModel.find();

    res.render("./admin/product", { category });
  },
  getSubCategory: async (req, res) => {
    try {
      const subCategories = await subCategoryModel.find({
        category: req.params.id,
      });
      res.json(subCategories);
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching subcategories",
        error: error.message,
      });
    }
  },
  postProduct: async (req, res) => {
    const {
      name,
      description,
      category,
      price,
      offerPrice,
      subcategory,
      stock_quantity,
      colors,
      sizes,
    } = req.body;
    const mainImage = req.files["mainImage"][0].filename;
    const images = req.files["images"].map((file) => file.filename);
    try {
      // Create new product instance
      const newProduct = new productModel({
        name,
        description,
        category,
        price,
        offerPrice,
        subcategory,
        stock_quantity,
        colors: colors || [],
        sizes: sizes || [],
        images,
        mainImage,
      });

      await newProduct.save();
      res.redirect("/showProduct");
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).send("Error creating product");
    }
  },
  showProduct: async (req, res) => {
    const products = await productModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryArr",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategory",
          foreignField: "_id",
          as: "subCategoryArr",
        },
      },
     
    ]);    
    res.render("./admin/productShow", { products });
  },
  productDelete: async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }
      // Define the paths for the images
      const mainImagePath = path.join(
        __dirname,
        "../../",
        "public",
        "product",
        product.mainImage
      );
      const additionalImagePaths = product.images.map((image) =>
        path.join(__dirname, "../../", "public", "product", image)
      );

      // Delete the main image
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
      }

      // Delete additional images
      additionalImagePaths.forEach((imagePath) => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      await productModel.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.json({ success: false });
    }
  },
  productUpdate: async (req, res) => {
    const product = await productModel.findById(req.params.id);
    const category = await categoryModel.find();
    const oldCategory = await categoryModel.findById(product.category);
    const oldSubCategory = await subCategoryModel.findById(product.subcategory);
    res.render("./admin/updateProduct", {
      product,
      category,
      oldCategory,
      oldSubCategory,
    });
  },
  productUpdatePost: async (req, res) => {
    try {
      const productId = req.params.id;
      const {
        name,
        description,
        category,
        price,
        offerPrice,
        subcategory,
        sizes,
        colors,
        stock_quantity,
      } = req.body;

      // Handle file uploads if any
      const mainImage = req.files["mainImage"]
        ? req.files["mainImage"][0].filename
        : null;
      const images = req.files["images"]
        ? req.files["images"].map((file) => file.filename)
        : [];

      // Find and update the product
      const updateData = {
        name,
        description,
        category,
        price,
        offerPrice,
        subcategory,
        sizes: Array.isArray(sizes) ? sizes : [sizes], // Ensure sizes is an array
        colors: Array.isArray(colors) ? colors : [colors], // Ensure colors is an array
        stock_quantity,
      };
      const product = await productModel.findById(req.params.id);
      // Add file paths if they were uploaded
      if (mainImage) {
        updateData.mainImage = mainImage;
        const mainImagePath = path.join(
          __dirname,
          "../../",
          "public",
          "product",
          product.mainImage
        );
        if (fs.existsSync(mainImagePath)) {
          fs.unlinkSync(mainImagePath);
        }
      }
      if (images.length > 0) {
        const additionalImagePaths = product.images.map((image) =>
          path.join(__dirname, "../../", "public", "product", image)
        );
        additionalImagePaths.forEach((imagePath) => {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
        updateData.images = images;
      }

      await productModel.updateOne({ _id: productId }, updateData);

      res.redirect(`/showProduct`);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while updating the product");
    }
  }, 
  showImage:(req,res)=>{
    const image = req.params.id
    res.render('./admin/showImage',{image})
  }
};
