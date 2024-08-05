const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [
    {
<<<<<<< HEAD
      productId: { type: mongoose.Schema.Types.ObjectId, ref:'products' ,required: true },
=======
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
>>>>>>> e9c9381d13ebbf9c6e051e41ec94d6b1023a15a3
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
