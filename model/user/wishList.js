const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishListSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const WishList = mongoose.model('WishList', wishListSchema);

module.exports = WishList;
