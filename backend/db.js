// db.js
const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',    // Update with your host
  user: 'root',         // Your MySQL username
  password: '12345678',         // Your MySQL password
  database: 'peer_learning' // The database you created
});

module.exports = pool.promise();