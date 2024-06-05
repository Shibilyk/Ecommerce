const productModel = require("../../model/admin/productModel");

module.exports = {
  getProduct: (req, res) => {
    res.render("./admin/product");
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
    console.log(newProduct);
    newProduct.save();
    res.send("hello");
  },
};
 
