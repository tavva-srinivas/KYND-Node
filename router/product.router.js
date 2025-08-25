const api_maker_router = require('express').Router();
const auth_middleware = require('../middleware/auth.middleware');
const prod_controller = require('../controller/products.controller')

api_maker_router.get("/api/products",auth_middleware, prod_controller.get_category_prod);

api_maker_router.get("/api/products/search/:name", prod_controller.get_search_prod);

// // Route to send the data of all the product ids
api_maker_router.get("/api/meal_products", prod_controller.get_meal_products);

module.exports = api_maker_router;

 // api/products?category=Essentials --> in the http.post (frontend) --> ? means beginning of the query string int the url
 // api/products (backend)
 // req.query.category


 // api/products/search/${name} ---> in http request (frontend)
 // api/product/search/:name  ---> in node (backend)
 // req.params.name


 // http://localhost:3000/products?product_ids=id1&product_ids=id2&product_ids=id3 ---> in the frontend 
//   ? means start of the query string 
//   the above api call we are sending the array of product_ids
//                   (or)
//           Uri.parse(http://localhost:3000/products).replace(queryParameters: {
//            'product_ids': productIds
//              });