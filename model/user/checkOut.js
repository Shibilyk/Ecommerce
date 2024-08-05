const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  addresses: [addressSchema]  // Embedding address schema as an array
}, { timestamps: true });

const address = mongoose.model('address', userSchema);

module.exports = address;
