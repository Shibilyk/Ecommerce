const Cart = require("../../model/user/cartModel");
const Wishlish = require("../../model/user/wishList");
const mongoose = require("mongoose");

module.exports = {
  getAddToCart: (req, res) => {
    res.redirect("/cart");
  },
  addToCart: async (req, res) => {
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
        // cart.items[itemIndex].quantity += parseInt(quantity);
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
    const wishlish = await Wishlish.findOne({ user: userId });
    let wishlishCount = 0;
    if (wishlish && wishlish.products.length > 0) {
      wishlishCount = wishlish.products.length;
    }

    res.render("./user/shoping-cart", {
      wishlishCount: wishlishCount,
      cart: cartWithProducts,
      total: total[0].total,
    });
  },
  quantity: async (req, res) => {
    const { quantity, size } = req.body;
    const productId = req.params.id;
    const userId = req.session.user._id;
    const intQuantity = parseInt(quantity);

    try {
      const findCart = await Cart.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      });

      const index = findCart.items.findIndex(
        (element) => element.productId == productId && element.size == size
      );
      findCart.items[index].quantity = intQuantity;

      const filter = {
        userId: new mongoose.Types.ObjectId(userId),
      };
      const update = {
        items: findCart.items,
      };
      const result = await Cart.updateOne(filter, update);
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
  cartRemove: async (req, res) => {
    try {
      const productId = req.params.productId;
      const size = req.query.size;

      const userId = req.session.user._id;

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
