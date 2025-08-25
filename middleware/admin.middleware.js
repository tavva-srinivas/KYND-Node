const Users = require('../model/auth.model.user');
const Product = require('../model/product.model');
const jwt = require('jsonwebtoken');


const admin = (req,res,next) => {
    try{
    const token = req.header('auth-token');
    console.log(`reaching in middle ${token}`);
    // unauthorised error
    if(!token){ 
        console.log("error in middleware.auth"); 
         res.status(401).json({msg: "No auth token,access denied"}) 
        }
        console.log("1");
    const verify = jwt.verify(token,"password_key");
    
    // console.log(verify.id);
    console.log(verify);

    if(!verify ) return req.status(401).json({msg : "Token verification failed, authorisation denied"});
    console.log(`inside middleware ${verify.id} `)
    req.owner_id = verify.id;
    next();
    } catch(error){
        console.log("there is some mess in middleware admin");
        res.status(500).json({error : error.message});
    }

}


module.exports = admin;