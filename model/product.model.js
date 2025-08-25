const mongoose = require('mongoose');

const product_schema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    description: {
        required: true,
        type: String,
        trim: true
    },
    images: [{
        required: true,
        type: String
    }],
    quantity: {
        required: true,
        type: Number,
    },
    price: {
        required: true,
        type: Number
    },
    category: {
        required: true,
        type: String
    },
    owner_id: {
        required: true,
        type:String,
        // type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    },
    calories: {
        type: Number,
        required : true
    },
    carbs: {
        type: Number,
        required : true
    },
    protein: {
        type: Number,
        required:true
    },
    fat: {
        type: Number,
        required:true
    },
    rating: {
        type: Number,
        min: 0, 
        max: 5, 
        default: 4
    },
    items: {
        type: String,
    }
});

const Product = mongoose.model('Product', product_schema);
module.exports = Product;
