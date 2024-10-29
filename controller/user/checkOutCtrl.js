// const { default: items } = require("razorpay/dist/types/items");
const Cart = require("../../model/user/cartModel");
const checkOutAddress = require("../../model/user/checkOut");
const mongoose = require("mongoose");
const razorpayInstance = require("../../config/razorpay");
const Order = require("../../model/user/orderModel");
const CouponCode = require("../../model/admin/couponCode");

const razorpay = require("razorpay");
const { match } = require("assert");
module.exports = {
  checkOutPage: async (req, res) => {
    const userId = req.session.user._id;
    let address = await checkOutAddress.findOne({ userId });
    const orginalCart = await Cart.findOne({ userId });
    req.session.cart = orginalCart._id;
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
    const totalSave = cart.reduce((total, element) => {
      const itemSave =
        element.items.quantity *
        (element.productDetails.price - element.productDetails.offerPrice);
      return total + itemSave;
    }, 0);
    res.render("./user/checkOut", {
      totalSave,
      orginalCart,
      cart: cart,
      total: cart.length ? cart[0].total : 0,
      address: address ? address.addresses : [],
    });
  },
  razorpayPost: async (req, res) => {
    const amount = parseFloat(req.body.amount);

    const userId = req.session.user._id;
    req.session.checkOut = {};
    const shippingAddress = req.body.address;

    if (!shippingAddress) {
      return res.status(400).send("Address is required");
    }

    const addresses = await checkOutAddress.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$addresses" },
      {
        $match: {
          "addresses._id": new mongoose.Types.ObjectId(shippingAddress),
        },
      },
    ]);

    req.session.checkOut.shippingAddress = {
      name: addresses[0].addresses.name,
      phone: addresses[0].addresses.phone,
      pincode: addresses[0].addresses.pincode,
      locality: addresses[0].addresses.locality,
      address: addresses[0].addresses.address,
      city: addresses[0].addresses.city,
      state: addresses[0].addresses.state,
    };
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await razorpayInstance.orders.create(options);
      req.session.checkOut.orderId = order.id;
      req.session.checkOut.amount = amount;
      res.status(200).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res
        .status(500)
        .json({ error: "Failed to create order", details: error.message });
    }
  },
  verifyPayment: async (req, res) => {
    const { payment_id, order_id, signature } = req.body;
    const crypto = require("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", razorpayInstance.key_secret)
      .update(order_id + "|" + payment_id)
      .digest("hex");

    if (generatedSignature !== signature) {
      delete req.session.checkOut;
      return res.status(400).send("Signature verification failed");
    }

    try {
      const paymentDetails = await razorpayInstance.payments.fetch(payment_id);

      if (paymentDetails.status === "captured") {
        console.log("Payment already captured");
      } else {
        await razorpayInstance.payments.capture(payment_id, req.body.amount);
        console.log("Payment captured successfully");
      }
      const cart = await Cart.findById(req.session.cart);
      const orderItems = cart.items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        size: item.size,
      }));

      const userId = req.session.user._id;
      const newOrder = new Order({
        user: userId,
        items: orderItems,
        totalAmount: req.session.checkOut.amount,
        shippingAddress: {
          name:req.session.checkOut.shippingAddress.name,
          address:req.session.checkOut.shippingAddress.address,
          city:req.session.checkOut.shippingAddress.city,
          locality:req.session.checkOut.shippingAddress.locality,
          state:req.session.checkOut.shippingAddress.state,
          pincode:req.session.checkOut.shippingAddress.pincode,
          phone:req.session.checkOut.shippingAddress.phone,
        },
        paymentStatus: "Completed",
        orderStatus: "Processing",
        orderId: req.session.checkOut.orderId,
      });


      delete req.session.checkOut;

      await Cart.updateOne({ userId: userId }, { items: [] });

      await newOrder.save();

      res.json({ message: "Order successfully placed" });
    } catch (error) {
      console.error("Error during order creation:", error);
      delete req.session.checkOut;
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
        return res.redirect("/check-out");
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
  couponCode: async (req, res) => {
    const { couponCode } = req.body;
    const coupon = await CouponCode.findOne({ couponName: couponCode });
    if (!coupon) {
      return res.status(400).json({ error: "Invalid coupon code" });
    }

    res.status(201).json({ couponDiscount: coupon.discountPercentage });
  },
};
