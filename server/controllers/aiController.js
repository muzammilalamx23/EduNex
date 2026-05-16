const aiService = require('../services/aiService');

// @desc    Stream AI Mentor response via SSE
// @route   POST /api/ai/chat
// @access  Private (Enrolled students)
exports.streamAIChat = async (req, res) => {
    // We expect the client to send a POST request with { history, context }
    // However, SSE is natively a GET request if using EventSource.
    // If using fetch() to read the stream, we can use POST.
    
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Important for CORS if needed, but handled globally
    // res.setHeader('Access-Control-Allow-Origin', '*'); 

    const { history, context } = req.body;

    if (!history || !Array.isArray(history)) {
        res.write(`data: ${JSON.stringify({ error: 'Invalid history payload' })}\n\n`);
        return res.end();
    }

    // Process the stream
    await aiService.streamChat(history, context || {}, res);
};
