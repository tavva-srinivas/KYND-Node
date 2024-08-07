const jwt = require("jsonwebtoken");

const auth = async (req,res,next) => {
    try{
        
        const token = req.header('auth-token');
        console.log(`reach ${token}`);
        // unauthorised error
        if(!token){ console.log("error in middleware.auth"); res.status(401).json({msg: "No auth token,access denied"})    }
        const verify = jwt.verify(token,"password_key");

        if(!verify) return req.status(401).json({msg : "Token verification failed, authorisation denied"});

        req.user = verify.id;
        req.token = token;
        console.log("reach");
        next();
    }catch(error){
        console.log("error in middleware.auth");
        res.status(500).json({error : error.message});
    }
};

module.exports = auth;