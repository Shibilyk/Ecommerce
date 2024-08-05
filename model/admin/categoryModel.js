const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    trim: true,
  },
  image: {
  type:String
    
  }
});

const categoryModel = mongoose.model("categories", categorySchema);

module.exports = categoryModel;
