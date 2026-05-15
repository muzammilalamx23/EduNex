const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    starterCode: { type: String, default: '' },
    expectedOutput: { type: String, required: true },
    validationRules: [
        {
            ruleType: { type: String, enum: ['regex', 'exact', 'ast', 'api_call'] },
            pattern: { type: String, required: true },
            errorMessage: { type: String, required: true }
        }
    ],
    xpReward: { type: Number, default: 50, min: 0 }
});

const PlaygroundSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: [
            'jwt_debugger',
            'mongodb_query',
            'sql_playground',
            'docker_simulator',
            'redis_visualizer',
            'websocket_sandbox',
            'api_testing',
            'auth_simulator',
            'queue_simulator',
            'react_sandbox',
            'javascript_sandbox'
        ],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    missions: [MissionSchema],
    badges: [{ type: String }],
    status: { type: String, enum: ['active', 'maintenance', 'deprecated'], default: 'active' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Playground', PlaygroundSchema);
