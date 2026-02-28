const winston = require('winston');
require('winston-mongodb');
require('dotenv').config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Console transport for debugging
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Centralized file logging for errors and warnings
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});

// If Mongo URI is provided, log errors to DB too for long-term audit
if (process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.MongoDB({
        db: process.env.MONGO_URI,
        collection: 'logs',
        level: 'error'
    }));
}

module.exports = logger;
