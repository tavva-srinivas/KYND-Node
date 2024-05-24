const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
  host: '127.0.0.1', // Change this to your MySQL server host
  user: 'root',      // Change this to your MySQL username
  password: 'srinivas@123',  // Change this to your MySQL password
  database: 'kynd' // Change this to your MySQL database name
});

// const query = (sql, params) => {
//     return new Promise((resolve, reject) => {
//       mysqlConnection.query(sql, params, (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       });
//     });
//   };
  
//   module.exports = {
//     query,
//   };

module.exports = mysqlConnection;
