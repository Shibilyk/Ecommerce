const express = require("express");
const product = require("../../model/admin/productModel");
const categoryModel = require("../../model/admin/categoryModel");
const subCategoryModel = require("../../model/admin/subCategoryModel");
const productModel = require("../../model/admin/productModel");
const Cart = require("../../model/user/cartModel");
module.exports = {
  getHome: async (req, res) => {
    const category = await categoryModel.find();
    const subCategory = await subCategoryModel.find().limit(5);
    let cartCount = 0;
    let cart = [];
    let user = false;
    if (req.session.user) {
      user = true;
      const userId = req.session.user._id;
      cart = await Cart.find({ userId });
      cartCount = cart.length;
    }

    res.render("./user/index", {
      category,
      subCategory,
      cartCount: cartCount,
      cart: cart,
      user:user
    });
  },
  getProductDataFromButtonClick: async (req, res) => {
    if (req.params.id == 10) {
      const fProduct = await productModel.find().limit(16);
      return res.json(fProduct);
    }
    const fProduct = await productModel
      .find({ subcategory: req.params.id })
      .limit(16);
    res.json(fProduct);
  },
};
