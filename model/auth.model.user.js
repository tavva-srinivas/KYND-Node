// mongoose.connect() is simpler and suitable for most use cases where you only need to connect to
// one MongoDB database, while mongoose.createConnection() is used when you need to manage multiple 
// connections to MongoDB or when you need more control over the connection options.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const user_schema = new mongoose.Schema({
    name: {
        required : true,
        type : String,
        trim : true,
    },
    email : {
        required : true,
        type : String,
        trim : true,
        validate : {
            // Regx --> regular expression
            validator : (value) => {
                const regular_expression =   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    return value.match(regular_expression);
            },
            // What to do if email entered is not proper order
            message: 'Please enter proper valid email address'
        }
    },
    password : {
        required : true,
        type : String,
        validate : {
            validator : (value) => {
                    return value.length > 6;
            },
            // What to do if email entered is not proper order
            message: 'Please enter a long password'
        }
    },
    address : {
        required : true,
        type : String,
    },
    type : {
        type : String,
        // like seller, user, admin
        default : 'user'
    },

    // cart
});



// defining compare password 
user_schema.methods.compare_password = async function(user_entered_password)  {
    try{
        console.log(`the user pass : ${user_entered_password}  , this.password : ${this.password} `)
        const is_matching = await bcrypt.compare(user_entered_password,this.password);
        console.log(`is matching ${is_matching}`);
        return is_matching;
    }catch(error){
        console.log(`The error in user model compare password ${error}`); 
    }
}


// creating a model
const User = mongoose.model('User',user_schema);

module.exports = User;