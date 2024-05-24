const api_maker_router = require('express').Router();
const auth_middleware = require('../middleware/middleware.auth');
const prod_controller = require('../controller/products.controller')

api_maker_router.get("/api/products",auth_middleware, prod_controller.get_category_prod);

api_maker_router.get("/api/products/search/:name", prod_controller.get_search_prod);

api_maker_router.get("/api/products/trending", prod_controller.get_trending_prod);

module.exports = api_maker_router;

 // api/products?category=Essentials --> in the http.post
 // api/products
 // req.query.category


 // api/product/search/:name  ---> in node
 // api/products/search/${name} ---> in http request
 // req.params.name
