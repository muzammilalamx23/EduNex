const playgroundQueue = require('../queues/playgroundQueue');
const ApiResponse = require('../utils/ApiResponse');
const { getIsRedisConnected } = require('../config/redis');
const sandboxService = require('../services/sandboxService');

exports.executeCode = async (req, res, next) => {
    try {
        const { language, code, missionId, socketId } = req.body;
        
        if (!language || !code) {
            return ApiResponse.error(res, 'Language and code are required.', 400);
        }

        if (code.length > 10000) {
            return ApiResponse.error(res, 'Code payload is too large. Limit is 10,000 characters.', 413);
        }

        // If Redis is not connected, fallback to synchronous local execution
        if (!getIsRedisConnected()) {
            console.warn('⚠️  Redis disconnected. Running execution synchronously...');
            
            const io = req.app.get('io');
            if (socketId && io) {
                io.to(socketId).emit('execution:started', { jobId: 'local-fallback' });
            }

            // Await execution synchronously
            const result = await sandboxService.executeCode(language, code);
            const finalResult = {
                jobId: 'local-fallback',
                ...result,
                success: !result.error && !result.stderr,
                missionId
            };

            if (socketId && io) {
                io.to(socketId).emit('execution:completed', finalResult);
                if (finalResult.success && finalResult.missionId && req.user.id) {
                    try {
                        const progressService = require('../services/progressService');
                        const xpResult = await progressService.awardMissionXP(req.user.id, finalResult.missionId, null, 20);
                        
                        io.to(socketId).emit('gamification:xp_awarded', { 
                            amount: xpResult.xpEarned, 
                            reason: 'Mission Code Executed Successfully (Local Engine)',
                            newTotal: xpResult.totalXp,
                            streak: xpResult.currentStreak
                        });
                    } catch (err) {
                        if (err.statusCode === 400) {
                            io.to(socketId).emit('gamification:xp_awarded', { 
                                amount: 0, 
                                reason: 'Mission Already Completed (No XP awarded)' 
                            });
                        }
                    }
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Executed locally (Redis offline).',
                data: finalResult
            });
        }

        // Standard BullMQ Queue Flow
        const job = await playgroundQueue.add('execute-code', {
            language,
            code,
            userId: req.user.id,
            missionId,
            socketId
        });

        return res.status(202).json({
            success: true,
            message: 'Code execution queued.',
            data: { jobId: job.id }
        });
    } catch (error) {
        next(error);
    }
};

exports.getJobStatus = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const job = await playgroundQueue.getJob(jobId);

        if (!job) {
            return ApiResponse.error(res, 'Job not found.', 404);
        }

        const state = await job.getState();
        const result = job.returnvalue;
        const failedReason = job.failedReason;

        return res.status(200).json({
            success: true,
            data: {
                id: job.id,
                state,
                result,
                failedReason
            }
        });
    } catch (error) {
        next(error);
    }
};
