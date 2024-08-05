const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref:'products' ,required: true },
      quantity: { type: Number, required: true },
      size: {
        type: String,
        required: true,
      },
    },
  ],
  total:{
    type:Number
  }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
