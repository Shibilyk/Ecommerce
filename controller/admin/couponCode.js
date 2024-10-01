const Coupons = require("../../model/admin/couponCode");
module.exports = {
  getCouponCode: async (req, res) => {
    const coupons = await Coupons.find();
    console.log(coupons);
    res.render("./admin/showCouponCode", { coupons: coupons ? coupons : [] });
  },
  addCouponCode: (req, res) => {
    res.render("./admin/couponCode");
  },
  postAddCouponCode: async (req, res) => {
    const { couponName, percentage } = req.body;
    console.log("here");
    
    const newCoupon = new Coupons({
      couponName,
      discountPercentage:percentage,
    });
    await newCoupon.save();
    res.redirect("/admin/coupon-code");
  },
};
