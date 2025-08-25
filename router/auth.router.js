// Here we are not instantiating just assigning function (express.Router() to api_maker)
const api_maker_router = require('express').Router();
const auth_controller = require('../controller/auth.controller');
const auth_middleware = require('../middleware/auth.middleware');

api_maker_router.post('/api/signup', auth_controller.add_user);

api_maker_router.post('/api/signin', auth_controller.login_user);

api_maker_router.post('/token_isvalid', auth_controller.token_validity);

api_maker_router.get('/', auth_middleware , auth_controller.get_user_data);

// all the above variables and meathods are private so they should be imported to be accesed by other files
module.exports = api_maker_router;
   
