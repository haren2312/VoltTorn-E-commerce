const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cart: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // You can reference a Product schema if you have one
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            image: {
                type: String,
                required: false,
            },
            total_price: {
                type: Number,
                required: false,
                default: 0,
            }
        }
    ]
});

const WishListSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    item: [

        {    
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // You can reference a Product schema if you have one
            },
        }
    ]
});

// Exporting each model with a distinct name
const CartModel = mongoose.model('Cart', CartSchema);
const WishListModel = mongoose.model('Wishlist', WishListSchema);

module.exports = {
    CartModel,
    WishListModel
};
