const Redis = require('ioredis');
require('dotenv').config();

// Custom retry strategy to prevent infinite spam when Redis is down
const bullMqRetryStrategy = (times) => {
    // Retry up to 3 times, then give up to prevent infinite spam
    if (times > 3) {
        console.warn('⚠️  Redis connection failed after 3 attempts. BullMQ queue bypassed.');
        return null; // Stop retrying
    }
    return Math.min(times * 50, 2000);
};

const baseOptions = { 
    maxRetriesPerRequest: null,
    retryStrategy: bullMqRetryStrategy
};

// Standardize connection configuration
let redisConfig;
let redisOptions;

if (process.env.REDIS_URI) {
    redisConfig = process.env.REDIS_URI;
    redisOptions = baseOptions;
} else {
    redisConfig = {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    };
    redisOptions = { ...redisConfig, ...baseOptions };
}

// Create a single shared instance for basic operations if needed
const redis = new Redis(redisOptions);

let isRedisConnected = false;

redis.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        if (isRedisConnected || isRedisConnected === false) {
            console.warn('⚠️  Redis is not running. BullMQ execution will fallback to synchronous local execution.');
        }
        // Suppress further connection errors to avoid flooding terminal
        redis.disconnect(); 
    } else {
        console.error('❌ Redis Connection Error:', err);
    }
});

redis.on('connect', () => {
    isRedisConnected = true;
    console.log('✅ Connected to Redis successfully');
});

module.exports = {
    redis,
    redisOptions,
    getIsRedisConnected: () => isRedisConnected
};
