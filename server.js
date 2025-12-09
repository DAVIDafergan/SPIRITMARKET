import express from 'express';
import cors from 'cors';
import pool from './db_connector.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const SALT_ROUNDS = 10;

// Multer setup for in-memory file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Database Initialization ---
const initDB = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            const connection = await pool.getConnection();
            console.log("Acquired connection for initialization...");
            
            // Users Table
            await connection.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    phone VARCHAR(50),
                    is_seller BOOLEAN DEFAULT FALSE,
                    is_admin BOOLEAN DEFAULT FALSE,
                    verified BOOLEAN DEFAULT FALSE,
                    rating FLOAT DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Listings Table
            await connection.query(`
                CREATE TABLE IF NOT EXISTS listings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    seller_id INT NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10, 2) NOT NULL,
                    category VARCHAR(50),
                    image_url TEXT,
                    location VARCHAR(255),
                    abv DECIMAL(5, 2),
                    volume_ml INT,
                    brand VARCHAR(255),
                    vintage INT,
                    is_kosher BOOLEAN DEFAULT FALSE,
                    status VARCHAR(50) DEFAULT 'PENDING',
                    ai_data JSON,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `);

            console.log("Database tables initialized successfully.");
            connection.release();
            return; // Success
        } catch (err) {
            console.error(`Error initializing database (Attempts left: ${retries}):`, err.message);
            retries -= 1;
            // Wait 2 seconds before retry
            await new Promise(res => setTimeout(res, 2000));
        }
    }
    console.error("CRITICAL: Failed to initialize database after multiple attempts.");
};

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- API Routes (Defined BEFORE static files) ---

// 1. GET Listings (Home Page)
app.get('/api/listings', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, minAbv, maxAbv, minRating, sortBy } = req.query;

        let sql = `
            SELECT l.*, u.name as sellerName, u.phone as sellerPhone, u.rating as sellerRating, u.verified as sellerVerified
            FROM listings l 
            JOIN users u ON l.seller_id = u.id 
            WHERE l.status = 'APPROVED'
        `;
        const params = [];

        if (category && category !== 'All') { sql += ' AND l.category = ?'; params.push(category); }
        if (search) { sql += ' AND l.title LIKE ?'; params.push(`%${search}%`); }
        if (minPrice) { sql += ' AND l.price >= ?'; params.push(Number(minPrice)); }
        if (maxPrice) { sql += ' AND l.price <= ?'; params.push(Number(maxPrice)); }
        if (minAbv) { sql += ' AND l.abv >= ?'; params.push(Number(minAbv)); }
        if (maxAbv) { sql += ' AND l.abv <= ?'; params.push(Number(maxAbv)); }
        if (minRating) { sql += ' AND u.rating >= ?'; params.push(Number(minRating)); }

        switch (sortBy) {
            case 'price_asc': sql += ' ORDER BY l.price ASC'; break;
            case 'price_desc': sql += ' ORDER BY l.price DESC'; break;
            case 'rating_desc': sql += ' ORDER BY u.rating DESC'; break;
            case 'date_desc': default: sql += ' ORDER BY l.created_at DESC'; break;
        }

        const [rows] = await pool.execute(sql, params);
        
        const formattedListings = rows.map(row => ({
            id: row.id,
            title: row.title, description: row.description, price: row.price,
            category: row.category, imageUrl: row.image_url, status: row.status,
            createdAt: row.created_at, location: row.location, abv: row.abv,
            volumeMl: row.volume_ml, brand: row.brand, vintage: row.vintage,
            isKosher: Boolean(row.is_kosher), sellerId: row.seller_id,
            sellerName: row.sellerName, sellerPhone: row.sellerPhone,
            sellerRating: row.sellerRating, sellerVerified: Boolean(row.sellerVerified),
            aiData: typeof row.ai_data === 'string' ? JSON.parse(row.ai_data) : row.ai_data
        }));

        res.json(formattedListings);
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).json({ message: "Database error or connection failed" });
    }
});

// 2. POST Create Listing (Protected)
app.post('/api/listings', authenticateToken, async (req, res) => {
    try {
        const { 
            title, description, price, category, imageUrl, 
            location, abv, volumeMl, brand, vintage, isKosher, aiData 
        } = req.body;
        
        const sellerId = req.user.id; 
        let status = 'PENDING';
        if (aiData && aiData.score >= 0.75) status = 'APPROVED';
        else if (aiData && aiData.score >= 0.5) status = 'NEEDS_REVIEW';
        else status = 'REJECTED';

        const query = `
            INSERT INTO listings (seller_id, title, description, price, category, image_url, location, abv, volume_ml, brand, vintage, is_kosher, status, ai_data, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

        const [result] = await pool.execute(query, [
            sellerId, title, description, price, category, imageUrl, 
            location, abv, volumeMl, brand, vintage, isKosher, status, JSON.stringify(aiData)
        ]);

        res.status(201).json({ id: result.insertId, status, message: "Listing created successfully" });
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).json({ message: "Failed to create listing" });
    }
});

// 3. POST Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ 
            id: user.id, email: user.email, isAdmin: user.is_admin, name: user.name, isSeller: user.is_seller 
        }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            id: user.id, name: user.name, email: user.email, phone: user.phone,
            isSeller: Boolean(user.is_seller), isAdmin: Boolean(user.is_admin),
            rating: user.rating, verified: Boolean(user.verified), token
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// 4. POST Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, isSeller } = req.body;
        const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, phone, is_seller) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, isSeller]
        );

        const newUserId = result.insertId;
        const token = jwt.sign({ id: newUserId, email, name, isSeller, isAdmin: false }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ id: newUserId, name, email, phone, isSeller, token });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Registration failed due to a server error." });
    }
});

// 5. POST AI Verify (File Upload)
app.post('/api/ai/verify', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded.' });
    }
    // Simulate Vertex AI response based on file size for demo purposes
    const randomSeed = req.file.size % 100;
    if (randomSeed < 10) {
        return res.json({ score: 0.2, labels: ['person', 'outdoor'], explanation: 'Object does not resemble a bottle.' });
    } else if (randomSeed < 40) {
        return res.json({ score: 0.60, labels: ['glass', 'liquid', 'blurry'], explanation: 'Bottle detected but label is obscured.' });
    } else {
        return res.json({ score: 0.92, labels: ['bottle', 'alcohol', 'clear label'], explanation: 'Positive identification of packaging.' });
    }
});


// 6. Health Check
app.get('/api/health', (req, res) => {
    pool.query('SELECT 1')
        .then(() => res.json({ status: 'ok', database: 'connected', timestamp: new Date() }))
        .catch(err => res.status(503).json({ status: 'error', database: 'disconnected', message: err.message }));
});


// --- SERVE STATIC FILES & CATCH-ALL ---
app.use(express.static(path.join(__dirname, 'dist')));

app.use('*', (req, res) => {
    // This will serve the React app's index.html for any non-API, non-file request.
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- SERVER STARTUP ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    initDB();
});