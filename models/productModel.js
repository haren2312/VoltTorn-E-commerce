const mongoose = require('mongoose');

// Define the schema for the product
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required:true
    },
    discount:{
        type:Number,
        required:false
    },
    status:{
        type:Boolean,
        required:true,
    },
  
    stock: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
      
    image: {
        type: Array,
        required:true,
    },
    // Array field for storing reviews and ratings
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // You can reference a User schema if you have one
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            review:{ 
                type:String,
                
            },
            created_at: {
                type: Date,
                default: Date.now,
            },
            updated_at: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    
});



module.exports = mongoose.model('Product',productSchema);