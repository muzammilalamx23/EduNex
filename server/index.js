const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const logger = require('./utils/logger'); // Import logger
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// ─── Environment Variable Validation ─────────────────────────────────────────
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
    logger.error(`[Startup Error] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const app = express();

// ─── Security & Performance Middleware ────────────────────────────────────────
app.use(helmet());
app.use(compression()); // Gzip/Brotli compression
app.use(express.json({ limit: '10kb' })); // Prevents large payload attacks

// Parses cookies attached to client requests
app.use(cookieParser());

// Sanitize user input against NoSQL Injection
app.use(mongoSanitize());

// Strict CORS for frontend credentials
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_ORIGIN || 'http://localhost:5173']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn(`Rejected blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'], // No longer need manual x-auth-token header
    credentials: true, // Required for reading cookies from frontend
}));

// ─── Global Rate Limiting ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Reasonable cap per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(globalLimiter);

// ─── Health Check Endpoint ────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        uptime: process.uptime(),
        status: 'OK',
        timestamp: Date.now()
    });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/admin', require('./routes/admin'));

// ─── Database Connection & Crash Handlers ─────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        logger.info('[DB] Successfully connected to MongoDB Atlas');
    })
    .catch((err) => {
        logger.error(`[DB] Critical: MongoDB connection failed: ${err.message}`);
        process.exit(1);
    });

// Unhandled Rejections and Exceptions
process.on('unhandledRejection', (err) => {
    logger.error(`[Unhandled Rejection] ${err.message}`);
    // Ideally map graceful shutdown here
});

process.on('uncaughtException', (err) => {
    logger.error(`[Uncaught Exception] ${err.message}`);
    process.exit(1);
});

// ─── Production: Serve Static Frontend ─────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    const clientDistPath = path.join(__dirname, '../client/dist');

    app.use(express.static(clientDistPath));

    // Handle SPA Routing: Express 5 requires (.*) for catch-all
    app.get('(.*)', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(clientDistPath, 'index.html'));
        }
    });
}

// ─── Centralized Error Handler (must be LAST) ─────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`[Server] EduNex running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
    logger.info('[Server] SIGTERM received, shutting down gracefully.');
    server.close(() => {
        mongoose.connection.close(false, () => {
            process.exit(0);
        });
    });
});
