const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String, // 'diet_plan' or 'product'
        required: true,
        enum: ["DietPlan", "Product"],
        trim: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'type', // dynamically reference DietPlan or Product
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "active", "delivered", "completed", "canceled"],
        default: "pending"
    },
    endDate: {
        type: Date,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        postal_code: { type: String, trim: true }
    },
    receiverName: {
        type: String,
        trim: true,
    },
    contactInfo: {
        type: String,
        trim: true,
    },
    house_details: {
        type: String,
        trim: true,
    },
    instructions: {
        type: String,
        trim: true,
    },
}, { timestamps: true });


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
