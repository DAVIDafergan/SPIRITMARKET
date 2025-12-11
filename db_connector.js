// db_connector.js
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables (local dev first)
dotenv.config({ path: './.env.local' });

// --- Database configuration ---
// אפשר להשתמש ב-MYSQL_PUBLIC_URL או בפרטים מפורקים
const DB_USER = process.env.MYSQLUSER || 'root';
const DB_PASS = process.env.MYSQLPASSWORD || 'stOrhLwjOHJhKxtEgaQSGSCSbCTlFqfx';
const DB_NAME = process.env.MYSQLDATABASE || 'railway';
const DB_HOST = process.env.MYSQLHOST || 'shinkansen.proxy.rlwy.net';
const DB_PORT = process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT) : 45465; // 45465 לפי public URL

// --- Create connection pool ---
const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    dateStrings: true
});

// --- Test DB connection ---
const testConnection = async () => {
    try {
        const conn = await pool.getConnection();
        console.log(`✅ Connected to DB '${DB_NAME}' as '${DB_USER}' at ${DB_HOST}:${DB_PORT}`);
        conn.release();
    } catch (err) {
        console.error(`❌ Failed to connect to DB at ${DB_HOST}:${DB_PORT}`);
        console.error(err.code ? `${err.code} - ${err.message}` : err.message);
        process.exit(1); // exit process if DB fails
    }
};

// Immediately test connection
testConnection();

export default pool;
