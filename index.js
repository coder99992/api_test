require('dotenv').config();
const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const routersMeta = require('./api/meta');
const routersKimi = require('./api/kimi-k2');
const routersQwen = require('./api/qwen');
const routersDeepseek = require('./api/deepseek');
const routersQwenv2 = require('./api/qwen-v2');
const routersGlm = require('./api/glm');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiter middleware: 5 requests per minute per IP
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        status: 429,
        error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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

// Use API routers
app.use('/api', routersMeta);
app.use('/api', routersKimi);
app.use('/api', routersQwen);
app.use('/api', routersDeepseek);
//app.use('/api', routersText);
app.use('/api', routersGlm);
app.use('/api', routersQwenv2);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Api_tnt',
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
