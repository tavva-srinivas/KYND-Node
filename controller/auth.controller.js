const User = require('../model/auth.model.user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.add_user = async (req,res) => {
     try{ 
        const {name,phone_number,address,email,password} = req.body;
        // let and var difference
        // var are function-scoped,let are block-scoped
        // function example() {
//          if (true) {
//              var x = 10;
//              let y = 20;
//          }
//          console.log(x); // 10
//          console.log(y); // ReferenceError: y is not defined
        const already_present = await User.findOne({email : email});
        if(already_present){
            // 400 represents that client error (try to register with registered email)
          return res.status(400).json({msg : "Email already taken" });
        } 

         console.log(
             name,
             email,
             password,
             address);

        const hash_pass = await bcrypt.hash(password,10);


        let new_user = new User({
            name,
            email,
            password : hash_pass ,
            address,
        })

        new_user = await new_user.save();
        res.json({user : new_user})

     }catch(error){ 
        console.log(`there is error in signup controller add_user ${error}`);
        // 500 if server doesnt know what to do
        res.status(500).json({error : error.message})
    }
}





exports.login_user = async (req,res) => {
    console.log("reaching login controller");
   try{
    const {email,password} = req.body;
    console.log(email);
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({msg: "User with this E-Mail does not exsist"});
    }
    try{
        const is_match = await user.compare_password(password);
        if(is_match){
            console.log(`${password}, ${user.password} ${is_match}`);
            let token_data = {id : user._id};

            // creating a new jwt token
            const jwt_token = await jwt.sign(token_data,"password_key");
            user.token = jwt_token;
             return res.status(200).json({jwt_token,...user["_doc"]});
        }
        return res.status(401).json({error : "The entered password is incorrect"});

    }catch(error){
        console.log("auth controller error");
        return res.status(400).json({error :error.message})
    }
    
}catch(error){
    console.log(`there is error in auth.controller login user${error}`);
    return res.status(500).json({error : error.message});
}

}





exports.token_validity = async (req,res) => {
    try{
        const token = req.header('auth-token');

        if(!token)  return res.json(false);

// Verification: When someone receives a JWT, they can verify its authenticity by validating the signature using the same secret key. If the signature is valid, it means the token was not tampered with and originated from a trusted source.
      // After decoding token ---> in the verify we get the token_data ---> that we have used to make the jwt
        const verify = jwt.verify(token,'password_key');
        if(!verify)  return res.json(false);

        const user = await User.findById(verify.id);
        if(!user) return res.json(false);
        return res.json(true);

    }catch(error){
        console.log(`there is error in auth.controller token validity${error}`);
        return res.status(500).json({error : error.message});
    }
}



// here we are using token_validity ---> get_user_data because ---> using token_validity for sending true and false has better error handliing

exports.get_user_data = async (req,res) => {
    try{
        const user = await User.findById(req.user);
        console.log(`get user data ${user}`);
           res.json({jwt_token: req.token, ...user["_doc"]});
    }catch(error){
        console.log(`there is error in auth.controller -> get user data ${error}`);
        return res.status(500).json({error : error.message});
    }
}