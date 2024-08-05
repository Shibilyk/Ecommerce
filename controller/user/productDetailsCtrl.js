const categoryModel = require("../../model/admin/categoryModel");
const productModel = require("../../model/admin/productModel");
const subcategoryModel = require("../../model/admin/subCategoryModel");
const SubCategryModel = require("../../model/admin/subCategoryModel");
const cart = require("../../model/user/cartModel");
const { ObjectId } = require("mongodb");

module.exports = {
  getProductDetail: async (req, res) => {
    const id = req.params.id;
    let cartCheck = false; 

    if (req.session.user) {
      const userId = req.session.user._id;
      const userIdObj = new ObjectId(userId);
      const productIdObj = new ObjectId(id);
      
      const fCart = await cart.aggregate([
        {
          $match: {
            userId: userIdObj,
            "items.productId": productIdObj,
          },
        },
      ]);
      cartCheck = fCart.length > 0;
        }
         const product = await productModel.findOne({ _id: id });
    const relatedProducts = await productModel.find({
      subcategory: product.subcategory,
    });
    res.render("./user/product-detail", { product, relatedProducts,cartCheck });
  },
  categoryProduct: async (req, res) => {
    const id = req.params.id;
    const products = await productModel.find({ category: id });
    res.render("./user/product", { products });
  },
};
