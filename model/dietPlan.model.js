const { default: mongoose } = require('mongoose');

const meal_schema = new mongoose.Schema({
    meal_name: {
        type: String,
        required: true,
        trim: true,
    },
    foodtype: {
        type: String, // veg or non-veg
        required: true,
        trim: true,
    },
    images: [{
        required: true,
        type: String
    }],
    cost: [{
        type: Number,
        required: true,
        trim: true,
    }],
    description: {
        type: String,
        required: true,
        trim: true,
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }],
    rating : {
        type : Number,
        required : true
    }
});

const DietPlan = mongoose.model('DietPlan', meal_schema);

module.exports = DietPlan;


// change the admin.model.js as above , this is for both meals and products
