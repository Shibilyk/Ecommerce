const Cart = require("../../model/user/cartModel");
const mongoose = require("mongoose");

module.exports = {
<<<<<<< HEAD
  getAddToCart: (req, res) => {
    res.redirect("/cart");
  },
  addToCart: async (req, res) => {
=======
  getAddToCart:(req,res)=>{
    res.redirect("/cart");
  },
  addToCart: async (req, res) => {
    console.log(req);
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3
    const { productId, quantity, size, price } = req.body;
    const userId = req.session.user._id;

    try {
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [], total: 0 });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (itemIndex > -1) {
<<<<<<< HEAD
        // cart.items[itemIndex].quantity += parseInt(quantity);
=======
        cart.items[itemIndex].quantity += parseInt(quantity);
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3
      } else {
        cart.items.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity: parseInt(quantity),
          size,
        });
      }

      await cart.save();
      const total = await Cart.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },

        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $group: {
            _id: "$_id",
            total: {
              $sum: {
                $multiply: ["$items.quantity", "$productDetails.offerPrice"],
              },
            },
          },
        },
      ]);
      if (total.length > 0) {
        let update = await Cart.updateOne(
          { userId },
          { total: total[0].total }
        );
      }

      res.redirect("/cart");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  viewCart: async (req, res) => {
<<<<<<< HEAD
=======
    console.log("hello"+req.url);
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3
    const userId = req.session.user._id;
    const cart = await Cart.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ]);
    const total = await Cart.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },

      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: "$_id",
          total: {
            $sum: {
              $multiply: ["$items.quantity", "$productDetails.offerPrice"],
            },
          },
        },
      },
    ]);
    if (total.length > 0) {
      let update = await Cart.updateOne({ userId }, { total: total[0].total });
    }

    if (!cart.length) {
      return res.render("./user/shoping-cart", { cart: [] });
    }

    const productDetailsMap = cart[0].productDetails.reduce((map, product) => {
      map[product._id.toString()] = product;
      return map;
    }, {});

    const cartWithProducts = cart[0].items.map((item) => ({
      item,
      product: productDetailsMap[item.productId.toString()],
    }));

    res.render("./user/shoping-cart", {
      cart: cartWithProducts,
      total: total[0].total,
    });
  },
  quantity: async (req, res) => {
    const { quantity, size } = req.body;
    const productId = req.params.id;
    const userId = req.session.user._id;
<<<<<<< HEAD
    const intQuantity = parseInt(quantity);
    

    try {
      console.log(userId);
      
      const findCart =await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      console.log(findCart);

      const index = findCart.items.findIndex(element =>element.productId == productId && element.size == size)
      
      console.log(index);
      
=======

    try {
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3
      const filter = {
        userId: new mongoose.Types.ObjectId(userId),
        "items.productId": new mongoose.Types.ObjectId(productId),
        "items.size": size,
      };
<<<<<<< HEAD

      const update = {
        $set: {
          "items.$.quantity": intQuantity,
        },
      };

     

      const result = await Cart.updateOne(filter, update);
      // console.log(result);

=======
      const update = {
        $set: {
          "items.$.quantity": parseInt(quantity),
        },
      };

      const result = await Cart.updateOne(filter, update);
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3
      const total = await Cart.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },

        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $group: {
            _id: "$_id",
            total: {
              $sum: {
                $multiply: ["$items.quantity", "$productDetails.offerPrice"],
              },
            },
          },
        },
      ]);
      if (total.length > 0) {
        let update = await Cart.updateOne(
          { userId },
          { total: total[0].total }
        );
      }

<<<<<<< HEAD
      res.redirect("/cart");
=======
      if (result.modifiedCount > 0) {
        res.redirect("/cart");
      } else {
        res.status(404).send("Item not found in cart");
      }
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  cartRemove: async (req, res) => {
    try {
      const productId = req.params.productId;
      const size = req.query.size;

      const userId = req.session.user._id;
<<<<<<< HEAD
=======
      console.log(userId);
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3

      // Use $pull to remove the item from the cart
      const result = await Cart.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $pull: { items: { productId: productId, size: size } } },
        { new: true }
      );
      const total = await Cart.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },

        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails",
        },
        {
          $group: {
            _id: "$_id",
            total: {
              $sum: {
                $multiply: ["$items.quantity", "$productDetails.offerPrice"],
              },
            },
          },
        },
      ]);
<<<<<<< HEAD
=======
      console.log(total);
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3

      let totalAmount = total.length > 0 ? total[0].total : 0;
      console.log(totalAmount);

      await Cart.updateOne(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $set: { total: totalAmount } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Cart or item not found" });
      }
      res.status(200).json({ message: "Item removed successfully" });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
