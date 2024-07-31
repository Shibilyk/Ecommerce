const mongoose = require("mongoose");
const subcategorySchema = new mongoose.Schema({
    subCategory: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    img: {
      type: String,
    }
  });

  const subcategoryModel = mongoose.model("subcategories", subcategorySchema);
  module.exports = subcategoryModel