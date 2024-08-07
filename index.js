const { mongo } = require('mongoose');
const mysql = require('mysql2');
const mysql_connection = require('./config_db/mysql');
const mongoose = require('mongoose');
const express = require('express');
const body_parser = require('body-parser');
const signup_router = require('./router/auth.router');
const admin_router = require('./router/admin.router');
const category_router = require('./router/product.router');


//  INIT
const app = express();
const port = 3000;
const DB = "mongodb+srv://team_kynd:we_are_kynd@auth.kliexq6.mongodb.net/?retryWrites=true&w=majority&appName=auth"

// middleware
//         (req)           (res)
// CLIENT ------> SERVER ------> CLIENT
//       <--------------------->  ==> done by middleware
app.use(express.json());
app.use(body_parser.json())
app.use('/',signup_router);
app.use('/',admin_router);
app.use('/',category_router);
// app.use(router);  


// Data base connection
mongoose.connect(DB).then(() => { console.log("Connection to data-base successfully")}).catch((error) => console.log(`error in data-base connection ${error}`));


// Mysql connection
mysql_connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database.');
  });
  


app.listen(port, () => {
    console.log(`listening to port ${port}`);
})