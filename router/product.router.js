const api_maker_router = require('express').Router();
const auth_middleware = require('../middleware/middleware.auth');
const prod_controller = require('../controller/products.controller')

api_maker_router.get("/api/products",auth_middleware, prod_controller.get_category_prod);

api_maker_router.get("/api/products/search/:name", prod_controller.get_search_prod);

api_maker_router.get("/api/products/trending", prod_controller.get_trending_prod);

module.exports = api_maker_router;

 // api/products?category=Essentials --> in the http.post (frontend)
 // api/products (backend)
 // req.query.category


 // api/products/search/${name} ---> in http request (frontend)
 // api/product/search/:name  ---> in node (backend)
 // req.params.name
