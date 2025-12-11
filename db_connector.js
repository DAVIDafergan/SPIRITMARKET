// db_connector.js
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// load .env.local if exists (local dev)
dotenv.config({ path: './.env.local' });
// load real env (Railway)
dotenv.config();

// --- RAILWAY VARIABLES --- //
const DB_USER = process.env.MYSQLUSER;
const DB_PASS = process.env.MYSQLPASSWORD;
const DB_NAME = process.env.MYSQLDATABASE;
const DB_HOST = process.env.MYSQLHOST;
const DB_PORT = process.env.MYSQLPORT;

// FALLBACKS (LOCAL DEV)
const user = DB_USER || 'root';
const pass = DB_PASS || 'password123';
const name = DB_NAME || 'spiritmarket';
const host = DB_HOST || '127.0.0.1';
const port = DB_PORT || 3306;

// Create connection pool
const pool = mysql.createPool({
    host,
    port,
    user,
    password: pass,
    database: name,
    dateStrings: true,
    connectionLimit: 10
});

// Test DB connection
pool.getConnection()
    .then(conn => {
        console.log(`Connected to DB '${name}' as user '${user}'`);
        conn.release();
    })
    .catch(err => {
        console.error('❌ Failed to connect to DB');
        console.error(err.message);
    });

export default pool;
