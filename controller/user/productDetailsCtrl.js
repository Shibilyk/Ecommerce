const categoryModel = require("../../model/admin/categoryModel");
const productModel = require("../../model/admin/productModel");
const subcategoryModel = require("../../model/admin/subCategoryModel");
const SubCategryModel = require("../../model/admin/subCategoryModel");
<<<<<<< HEAD
const cart = require("../../model/user/cartModel");
const { ObjectId } = require("mongodb");
=======
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3

module.exports = {
  getProductDetail: async (req, res) => {
    const id = req.params.id;
<<<<<<< HEAD
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
=======
    const product = await productModel.findOne({ "_id": id });
    const relatedProducts = await productModel.find({"subcategory":product.subcategory})
    res.render("./user/product-detail", { product,relatedProducts});
  },
  categoryProduct:async(req,res)=>{
    const id = req.params.id
    const products = await productModel.find({"category":id})
    res.render("./user/product",{products})
  }
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3
};
