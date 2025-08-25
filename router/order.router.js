// routes/order.routes.js
const express = require("express");
const order_router = express.Router();

const order_controller = require("../controller/order.controller");
const auth_middleware = require("../middleware/auth.middleware");

// Place a new order (product OR dietPlan)
order_router.post("/order/place",auth_middleware,order_controller.placeOrder);

// Get all orders for user
order_router.get( "/order/my_orders",auth_middleware,order_controller.getMyOrders);

// Admin/Chef - Get all active orders
order_router.get("/order/active",auth_middleware, order_controller.getActiveOrders
);

// Update order status (delivered, completed, canceled)
order_router.patch("/order/update_status/:orderId",auth_middleware, order_controller.updateOrderStatus
);


module.exports = order_router;
