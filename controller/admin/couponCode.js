const Coupons = require("../../model/admin/couponCode");
module.exports = {
  getCouponCode: async (req, res) => {
    const coupons = await Coupons.find();
    res.render("./admin/showCouponCode", { coupons: coupons ? coupons : [] });
  },
  addCouponCode: (req, res) => {
    res.render("./admin/couponCode");
  },
  postAddCouponCode: async (req, res) => {
    const { couponName, percentage } = req.body;

    const newCoupon = new Coupons({
      couponName,
      discountPercentage: percentage,
    });
    await newCoupon.save();
    res.redirect("/admin/coupon-code");
  },
  editCoupon: async (req, res) => {
    const id = req.params.id;
    const coupon = await Coupons.findOne({ _id: id });
    res.render("./admin/editCouponCode", { coupon });
  },
  postEditCoupon: async (req, res) => {
    const { couponName, percentage } = req.body;
    const id = req.params.id;
    await Coupons.updateOne(
      { _id: id },
      { couponName, discountPercentage: percentage }
    );
    res.redirect("/admin/coupon-code");
  },
  deleteCoupon: async (req, res) => {
    try {
      await Coupons.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete coupon" });
    }
  },
};
