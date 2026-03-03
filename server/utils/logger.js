const winston = require('winston');
const path = require('path');
const fs = require('fs');
require('winston-mongodb');
require('dotenv').config();

// Ensure logs directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    try {
        fs.mkdirSync(logDir);
    } catch (err) {
        console.warn('Could not create logs directory, falling back to console-only logging:', err.message);
    }
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Console transport for debugging - ALWAYS enabled
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Add file transports ONLY if directory exists and we are not in production 
// (or if explicitly desired). On Render, console logging is preferred.
if (fs.existsSync(logDir) && process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error'
    }));
    logger.add(new winston.transports.File({
        filename: path.join(logDir, 'combined.log')
    }));
}

// If Mongo URI is provided, log errors to DB too for long-term audit
if (process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.MongoDB({
        db: process.env.MONGO_URI,
        collection: 'logs',
        level: 'error',
        options: { useUnifiedTopology: true }
    }));
}

module.exports = logger;

