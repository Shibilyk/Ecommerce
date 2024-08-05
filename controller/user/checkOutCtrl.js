const Cart = require("../../model/user/cartModel");
const checkOutAddress = require("../../model/user/checkOut");
const mongoose = require("mongoose");

module.exports = {
  checkOutPage: async (req, res) => {
    const userId = req.session.user._id;
    const address = await checkOutAddress.findOne({userId})
    console.log(address);
    
    const cart = await Cart.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId", // Correctly reference the productId field inside items
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
    ]);
    const total = cart[0].total;

    res.render("./user/checkOut", { cart: cart, total: total,address:address });
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
  
      if (!name || !phone || !pincode || !locality || !address || !city || !state) {
        return res.status(400).json({ error: 'All address fields are required' });
      }
  
      const user = await checkOutAddress.findOne({ userId });
      if (!user) {
        // Create new user if not found
        const newUser = new checkOutAddress({
          userId,
          addresses: [{ name, phone, pincode, locality, address, city, state }]
        });
        await newUser.save();
        return res.status(201).json(newUser);
      } else {
        // Add new address to existing user's addresses
        user.addresses.push({ name, phone, pincode, locality, address, city, state });
        await user.save();
        return res.status(201).json(user);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
