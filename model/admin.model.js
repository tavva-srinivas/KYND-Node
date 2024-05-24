const { default: mongoose } = require('mongoose');
const mngoose = require('mongoose');

const product_schema = new mongoose.Schema({
    name: {
        required : true,
        type : String,
        trim : true,
    },
    description : {
        required : true,
        type : String,
        trim : true
    },
    images : [{
        required : true,
        type : String
    }],
    quantity : {
        required : true,
        type : Number,
    },
    price : {
        required : true,
        type : Number
    },
    category : {
        required : true,
        type : String
    },
    owner_id : {
        required : true,
        type: String
    }
})

const Product  =  mongoose.model('Product', product_schema);
module.exports = Product;