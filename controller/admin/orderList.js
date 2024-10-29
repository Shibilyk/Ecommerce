const Order = require("../../model/user/orderModel");
module.exports = {
  getOrderList: async (req, res) => {
    const orderList = await Order.find();
    res.render("./admin/orderList", { orderList });
  },
  updateOrderStatus:async(req,res)=>{
    await Order.updateOne({_id:req.body.id},{orderStatus:req.body.orderStatus})    
  }
};
