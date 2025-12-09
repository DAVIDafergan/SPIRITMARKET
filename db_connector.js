// db_connector.js
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: './.env.local' });

// Use environment variables or fallback defaults
const DB_USER = process.env.DB_USER || 'spiritmarketuser';
const DB_PASS = process.env.DB_PASS || 'password123';
const DB_NAME = process.env.DB_NAME || 'spiritmarket';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || 3306;

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

