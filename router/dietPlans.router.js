const express = require('express');
const mealRouter = express.Router();
// // const authMiddleware = require('../middleware/middleware.auth');
const mealController = require('../controller/dietPlan.controller');

// // Route to get diet by type
mealRouter.get("/api/meals", mealController.get_meals_by_type);

// // Route to search dietPlans by name
mealRouter.get("/api/meals/search/:name", mealController.search_meals);


module.exports = mealRouter;


//  This is the meals router
 // api/products?category=Essentials --> in the http.post (frontend)
 // api/products (backend)
 // req.query.category


 // api/products/search/${name} ---> in http request (frontend)
 // api/product/search/:name  ---> in node (backend)
 // req.params.name
