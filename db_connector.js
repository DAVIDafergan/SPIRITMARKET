// db_connector.js
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

// Load environment variables (Railway injects automatically)
dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  dateStrings: true,
  connectionLimit: 10
});

// Test database connection
pool.getConnection()
  .then(conn => {
    console.log("✅ Connected to Railway MySQL");
    conn.release();
  })
  .catch(err => {
    console.error("❌ MySQL connection failed:");
    console.error(err);
  });

export default pool;
