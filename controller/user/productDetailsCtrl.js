const categoryModel = require("../../model/admin/categoryModel");
const productModel = require("../../model/admin/productModel");
const subcategoryModel = require("../../model/admin/subCategoryModel");
const SubCategryModel = require("../../model/admin/subCategoryModel");

module.exports = {
  getProductDetail: async (req, res) => {
    const id = req.params.id;
    const product = await productModel.findOne({ "_id": id });
    const relatedProducts = await productModel.find({"subcategory":product.subcategory})
    res.render("./user/product-detail", { product,relatedProducts});
  },
  categoryProduct:async(req,res)=>{
    const id = req.params.id
    const products = await productModel.find({"category":id})
    res.render("./user/product",{products})
  }
};
