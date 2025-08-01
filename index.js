require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiter middleware: 5 requests per minute per IP
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        status: 429,
        error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Apply rate limiter to all /api routes
app.use('/api', apiLimiter);

// 🔁 Tự động load tất cả router trong thư mục ./api
const apiDir = path.join(__dirname, 'api');
fs.readdirSync(apiDir).forEach(file => {
    if (file.endsWith('.js')) {
        const route = require(path.join(apiDir, file));
        app.use('/api', route);
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Api_tnt' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Apply rate limiter to all /api routes
app.use('/api', apiLimiter);

// Use API routers
app.use('/api', routersMeta);
app.use('/api', routersKimi);
app.use('/api', routersQwen);
app.use('/api', routersDeepseek);
app.use('/api', routersVenice);
app.use('/api', routersGlm);
app.use('/api', routersQwenv2);
app.use('/api', routersGemma);
app.use('/api', routersTencent);
app.use('/api', routersDeepseek0);
app.use('/api', routersMistral);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Api_tnt',
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
