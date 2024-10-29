const categoryModel = require("../../model/admin/categoryModel");
const productModel = require("../../model/admin/productModel");
const subcategoryModel = require("../../model/admin/subCategoryModel");
const SubCategryModel = require("../../model/admin/subCategoryModel");
const Cart = require("../../model/user/cartModel");
const Wishlist = require("../../model/user/wishList");
const { ObjectId } = require("mongodb");

module.exports = {
  getProductDetail: async (req, res) => {
    const id = req.params.id;
    let cartCheck = false;

    let cartCount = 0;
    let cart = [];
    let user = false;
    var WishlistCount = 0;

    if (req.session.user) {
      const userId = req.session.user._id;
      const userIdObj = new ObjectId(userId);
      const productIdObj = new ObjectId(id);

      const fCart = await Cart.aggregate([
        {
          $match: {
            userId: userIdObj,
            "items.productId": productIdObj,
          },
        },
      ]);
      cartCheck = fCart.length > 0;
      user = true;
      cart = await Cart.find({ userId });
      cartCount = cart.length;
      var checkWishlist = await Wishlist.findOne({ products: productIdObj });
      const wishlist = await Wishlist.findOne({ user: userIdObj });
      if (wishlist && wishlist.products.length > 0) {
        wishlistCount = wishlist.products.length;
      }
    }

    const product = await productModel.findOne({ _id: id });

    const relatedProducts = await productModel.find({
      subcategory: product.subcategory,
    });
    res.render("./user/product-detail", {
      WishlistCount,
      checkWishlist,
      product,
      relatedProducts,
      cartCheck,
      cartCount: cartCount,
      cart: cart,
      user: user,
    });
  },
  categoryProduct: async (req, res) => {
    const id = req.params.id;
    const products = await productModel.find({ category: new ObjectId(id) });
    res.render("./user/product", { products });
  },
  getProducts: async (req, res) => {
    const products = await productModel.find();
    res.render("./user/product", { products });
  },
};
