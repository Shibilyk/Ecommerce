const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    price: {
      type: Number,
    },
    offerPrice: {
      type: Number,
    },
    stock_quantity: {
      type: Number,
    },
    colors: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: [],
    },
    mainImage: {
      type: String, // URL or file path to the main image
    },
    images: [
      {
        type: String, // URL or file path to additional images
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
