const admin_router = require('express').Router();
const admin_controller = require('../controller/admin.controller');
const admin_middleware = require('../middleware/admin.middleware')

// for checking if the product is already present or not
admin_router.post("/admin/check_product",admin_middleware ,admin_controller.check_product );

// once checked the product is added
admin_router.post("/admin/add_product", admin_controller.add_product);

// to show all the admin products
admin_router.get("/admin/get_products", admin_middleware , admin_controller.get_products);

// to delete a specific product for the user
admin_router.delete("/admin/delete_product", admin_middleware , admin_controller.delete_product);

// to get all active orders
admin_router.get("/admin/active_orders", admin_middleware, admin_controller.get_active_orders);

// check if diet plan already exists
admin_router.post("/admin/check_dietplan", admin_middleware, admin_controller.check_dietplan);

// create a new diet plan
admin_router.post("/admin/create_dietplan", admin_middleware, admin_controller.createPlan);

// Delete a specific diet plan
admin_router.delete("/admin/delete_dietplan", admin_middleware, admin_controller.delete_dietplan);


module.exports = admin_router; 