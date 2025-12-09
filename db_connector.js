// db_connector.js
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables (Railway sets them automatically)
dotenv.config();

// DB configuration from Railway
const DB_USER = process.env.MYSQLUSER || 'root';
const DB_PASS = process.env.MYSQLPASSWORD || 'stOrhLwjOHJhKxtEgaQSGSCSbCTlFqfx';
const DB_NAME = process.env.MYSQLDATABASE || 'railway';
const DB_HOST = process.env.MYSQLHOST || 'mysql.railway.internal';
const DB_PORT = process.env.MYSQLPORT || 3306;

// Create a connection pool
const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    dateStrings: true,
    connectionLimit: 10
});

// Test the connection on startup
pool.getConnection()
    .then(conn => {
        console.log(`Successfully connected to database '${DB_NAME}' as user '${DB_USER}'`);
        conn.release();
    })
    .catch(err => {
        console.error("Failed to connect to database. Check credentials and connection type.");
        console.error("Error:", err.message);
    });

export default pool;
