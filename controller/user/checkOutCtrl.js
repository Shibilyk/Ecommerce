const Cart = require("../../model/user/cartModel");
const checkOutAddress = require("../../model/user/checkOut");
const mongoose = require("mongoose");

module.exports = {
  checkOutPage: async (req, res) => {
    const userId = req.session.user._id;
    let address = await checkOutAddress.findOne({ userId });

    const cart = await Cart.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
    ]);
    const total = cart[0].total;

    res.render("./user/checkOut", {
      cart: cart,
      total: total,
      address: address ? address.addresses : [],
    });
  },
  razorpayPost: async (req, res) => {
    const options = {
      amount: req.body.amount * 100, // Amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await razorpayInstance.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  addressForm: async (req, res) => {
    try {
      const { name, phone, pincode, locality, address, city, state } = req.body;
      const userId = req.session.user._id;

      if (
        !name ||
        !phone ||
        !pincode ||
        !locality ||
        !address ||
        !city ||
        !state
      ) {
        return res
          .status(400)
          .json({ error: "All address fields are required" });
      }

      const user = await checkOutAddress.findOne({ userId });
      if (!user) {
        const newUser = new checkOutAddress({
          userId,
          addresses: [{ name, phone, pincode, locality, address, city, state }],
        });
        await newUser.save();
        return res.status(201).json(newUser);
      } else {
        user.addresses.push({
          name,
          phone,
          pincode,
          locality,
          address,
          city,
          state,
        });
        await user.save();
        return res.redirect("/check-out");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  editAddress: async (req, res) => {
    const { name, phone, pincode, locality, address, city, state } = req.body;
    const userId = req.session.user._id;
    const addressId = req.params.id;
    const userAddress = await checkOutAddress.findOne({ userId: userId });
    const index = userAddress.addresses.findIndex(
      (element) => element._id == addressId
    );
    userAddress.addresses[index].name = name;
    userAddress.addresses[index].phone = phone;
    userAddress.addresses[index].pincode = pincode;
    userAddress.addresses[index].locality = locality;
    userAddress.addresses[index].address = address;
    userAddress.addresses[index].city = city;
    userAddress.addresses[index].state = state;

    const result = await checkOutAddress.updateOne(
      { userId },
      { addresses: userAddress.addresses }
    );

    res.redirect("/check-out");
  },
};
