const productModel = require("../../model/admin/productModel");

const db = require("../../config/db");

module.exports = {
  getProduct: (req, res) => {
    res.render("./user/userLogin");
  },
  postProduct: (req, res) => {
    const { name, description, category, price, stock_quantity, image } =
      req.body;
    const newProduct = new productModel({
      name,
      description,
      category,
      price,
      stock_quantity,
      image_url: image,
    });
    newProduct.save();
    res.send("hello");
  },
};
