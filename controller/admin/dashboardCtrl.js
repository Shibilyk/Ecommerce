const User = require("../../model/user/userModel");
const Order = require("../../model/user/orderModel");
const Product = require("../../model/admin/productModel");
module.exports = {
  getDashboard: async (req, res) => {
    const usersCount = await User.aggregate([{ $count: "totalDocuments" }]);
    const OrderCount = await Order.aggregate([{ $count: "totalDocuments" }]);
    const productCount = await Product.aggregate([
      { $count: "totalDocuments" },
    ]);
    
    res.render("./admin/dashboard", { usersCount, OrderCount, productCount });
  },
};
