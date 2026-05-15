const { Worker } = require('bullmq');
const { redisOptions, getIsRedisConnected } = require('../config/redis');
const sandboxService = require('../services/sandboxService');

// In a real application, you'd want to inject the socket.io instance here, 
// but since the worker is usually started where io is available, we'll export an initializer function.

const initPlaygroundWorker = (io) => {

    const worker = new Worker('playground-execution', async (job) => {
        const { language, code, userId, missionId, socketId } = job.data;
        
        console.log(`[Worker] Processing job ${job.id} for user ${userId}`);
        
        // Notify client that execution started
        if (socketId) {
            io.to(socketId).emit('execution:started', { jobId: job.id });
        }

        // Execute code
        const result = await sandboxService.executeCode(language, code);
        
        // Example: If it's a mission, we would run tests here.
        // For simplicity, we just pass the code result.
        
        const finalResult = {
            jobId: job.id,
            ...result,
            success: !result.error && !result.stderr,
            missionId
        };

        return finalResult;
    }, { 
        connection: redisOptions,
        concurrency: 5 // Run up to 5 docker containers in parallel
    });

    worker.on('completed', async (job, result) => {
        console.log(`[Worker] Job ${job.id} completed`);
        if (job.data.socketId) {
            io.to(job.data.socketId).emit('execution:completed', result);
            
            // Trigger ProgressService to award XP in Database
            if (result.success && result.missionId && job.data.userId) {
                try {
                    const progressService = require('../services/progressService');
                    const xpResult = await progressService.awardMissionXP(job.data.userId, result.missionId, null, 20);
                    
                    io.to(job.data.socketId).emit('gamification:xp_awarded', { 
                        amount: xpResult.xpEarned, 
                        reason: 'Mission Code Executed Successfully',
                        newTotal: xpResult.totalXp,
                        streak: xpResult.currentStreak
                    });
                } catch (err) {
                    console.warn(`[Worker Gamification] ${err.message}`);
                    // Fallback emit if already completed
                    if (err.statusCode === 400) {
                        io.to(job.data.socketId).emit('gamification:xp_awarded', { 
                            amount: 0, 
                            reason: 'Mission Already Completed (No XP awarded)' 
                        });
                    }
                }
            }
        }
    });

    worker.on('failed', (job, err) => {
        console.error(`[Worker] Job ${job?.id} failed:`, err);
        if (job?.data?.socketId) {
            io.to(job.data.socketId).emit('execution:failed', { 
                jobId: job.id, 
                error: err.message 
            });
        }
    });

    // Suppress unhandled worker errors (like Redis connection refused)
    worker.on('error', (err) => {
        // We intentionally suppress ECONNREFUSED here because our controller already handles local fallback
    });

    return worker;
};

module.exports = initPlaygroundWorker;
