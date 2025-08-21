// db.js
const mysql = require("mysql2");

// Create connection pool (recommended)
const pool = mysql.createPool({
  host: "localhost", // your MySQL host
  user: "root", // your MySQL username
  password: "", // your MySQL password
  database: "armory_db", // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// Export pool for queries
module.exports = pool.promise(); // use promise-based queries
