const { findOne } = require("../../model/user/cartModel");
const Wishlist = require("../../model/user/wishList");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  getAddWishlist: (req, res) => {
    res.redirect("/wishlist/wishlist");
  },
  getWishlist: async (req, res) => {
    const userId = new ObjectId(req.session.user._id);
    const product =await Wishlist.aggregate([
      { $match: { user: userId } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products", 
          localField: "products",
          foreignField: "_id",
          as: "productDetails", 
        },
      },
      { $unwind: "$productDetails" },
    ]);
    
    res.render("./user/wishlist",{product});
  },
  addWishlist: async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.session.user._id;
      var wishlistCheck;

      const wishlist = await Wishlist.findOne({ user: new ObjectId(userId) });

      if (!wishlist) {
        wishlistCheck = true; 
        const newWishlist = new Wishlist({
          user: new mongoose.Types.ObjectId(userId),
          products: [new mongoose.Types.ObjectId(productId)],
        });
        await newWishlist.save();
      } else {
        if (!wishlist.products.includes(productId)) {
          wishlistCheck = true;
          wishlist.products.push(new mongoose.Types.ObjectId(productId));
          await wishlist.save();
        } else {
          wishlistCheck = false;
          const productIndex = wishlist.products.indexOf(
            new mongoose.Types.ObjectId(productId)
          );
          wishlist.products.splice(productIndex, 1);
          await wishlist.save();
        }
      }

      return res.status(200).json({ wishlistCheck });
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    
  },
  removeWishlist:async(req,res)=>{
    const { productId } = req.body;
    const userId = req.session.user._id;
    console.log(productId);
    
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }
    
    try {
      const objectProductId = new mongoose.Types.ObjectId(productId);
      const objectUserId = new mongoose.Types.ObjectId(userId);
    
      const wishlist = await Wishlist.findOne({ user: objectUserId });
    
      if (!wishlist) {
        return res.status(404).json({ success: false, message: 'Wishlist not found.' });
      }
    
      const productIndex = wishlist.products.indexOf(objectProductId);
    
      if (productIndex === -1) {
        return res.status(404).json({ success: false, message: 'Product not found in wishlist.' });
      }
    
      wishlist.products.splice(productIndex, 1);
      await wishlist.save();
    
      res.json({ success: true, message: 'Product removed from wishlist.' });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};
