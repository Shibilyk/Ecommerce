const mongoose = require("mongoose");
const coupen = new mongoose.Schema({
  couponName: {
    type: String,
    trim: true,
  },
  discountPercentage: {
  type:Number
  }
});

const coupenModel = mongoose.model("coupenCodes", coupen);

module.exports = coupenModel;
