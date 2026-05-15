const { Queue } = require('bullmq');
const { redisOptions } = require('../config/redis');

// Initialize the queue using the centralized Redis config
const playgroundQueue = new Queue('playground-execution', {
    connection: redisOptions,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 1000,    // Keep last 1000 failed jobs
    }
});

// Suppress unhandled queue errors (like Redis connection refused)
playgroundQueue.on('error', (err) => {
    // We intentionally suppress ECONNREFUSED here because our controller already handles local fallback
});

module.exports = playgroundQueue;
