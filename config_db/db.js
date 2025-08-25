const mongoose = require('mongoose');


const port = 3000;
const DB = "mongodb+srv://team_kynd:we_are_kynd@auth.kliexq6.mongodb.net/?retryWrites=true&w=majority&appName=auth"

// // Data base connection
mongoose.connect(DB).then(() => { console.log("Connection to data-base successfully")}).catch((error) => console.log(`error in data-base connection ${error}`));

module.exports = mongodb_connection;