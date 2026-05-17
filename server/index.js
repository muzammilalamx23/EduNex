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

const isDev = process.env.NODE_ENV !== 'production';
app.use(helmet({
    contentSecurityPolicy: isDev ? false : {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https:"],
            "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            "script-src-attr": ["'unsafe-inline'"], // needed for React event handlers
            "frame-src": ["'self'", "https://www.youtube.com"],
            "connect-src": ["'self'", "https:", "wss:", "ws:"],
            "worker-src": ["'self'", "blob:"], // Often needed for Monaco
        },
    },
    crossOriginEmbedderPolicy: false
}));
app.use(compression()); // Gzip/Brotli compression
app.use(express.json({ limit: '10kb' })); // Prevents large payload attacks

// Parses cookies attached to client requests
app.use(cookieParser());

// Sanitize user input against NoSQL Injection
app.use(mongoSanitize());

// Serve uploads statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// (CORS moved below health check to avoid blocking static assets)


// ─── Global Rate Limiting ──────────────────────────────────────────────────────
// Only apply in production. In development the React dev server + hot-reload
// easily burn through a low limit during normal usage.
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 500,                   // raised: SPA apps make many small requests per session
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV !== 'production', // disabled in development
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

// ─── CORS Configuration for API ───────────────────────────────────────────────
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_ORIGIN, 'https://edunex-1.onrender.com'].filter(Boolean)
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use('/api', cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn(`Rejected blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));

// ─── Security Enhancements (Enterprise Grade) ───────────────────────────────────
const xssClean = require('xss-clean');
// Protect against XSS by sanitizing req.body, req.query, and req.params
app.use(xssClean());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/playground', require('./routes/playgroundRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// ─── Database Connection & Crash Handlers ─────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, { family: 4 })
    .then(() => {
        logger.info('[DB] Successfully connected to MongoDB Atlas');
    })
    .catch((err) => {
        logger.error(`[DB] Critical: MongoDB connection failed: ${err.message}`);
        // Removed process.exit(1) to allow server to start even if DB is unreachable
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

    // 1. Serve static files FIRST
    app.use(express.static(clientDistPath));

    // 2. Handle SPA Routing (Redirect ALL non-api requests to index.html)
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(clientDistPath, 'index.html'));
        }
    });
}

// ─── Centralized Error Handler (must be LAST) ─────────────────────────────────
app.use(errorHandler);

// ─── Start Server & Socket.IO ──────────────────────────────────────────────────
const http = require('http');
const { Server } = require('socket.io');
const initPlaygroundWorker = require('./workers/playgroundWorker');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Expose io to routes
app.set('io', io);

// Initialize Socket.io Services
const initSocket = require('./services/socketService');
initSocket(io);

// Initialize BullMQ Playground Worker
const worker = initPlaygroundWorker(io);

server.listen(PORT, () => {
    logger.info(`[Server] EduNex running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    logger.info(`[Worker] BullMQ Execution Worker Started`);
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
