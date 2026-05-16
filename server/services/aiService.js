const Groq = require('groq-sdk');
const logger = require('../utils/logger');

class AIService {
    constructor() {
        // Initialize Groq client only if key is present to avoid crashing if user hasn't set it yet
        this.groq = null;
        if (process.env.GROQ_API_KEY) {
            this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        }
    }

    /**
     * Get a streaming chat completion from Groq AI Mentor
     * @param {Array} history - The chat history (last N messages)
     * @param {Object} context - Optional context like current code or lesson
     * @param {Object} res - Express response object for SSE streaming
     */
    async streamChat(history, context, res) {
        if (!this.groq) {
            res.write(`data: ${JSON.stringify({ error: 'GROQ_API_KEY is not configured.' })}\n\n`);
            res.end();
            return;
        }

        const systemPrompt = `You are the EduNex AI Mentor. You are a Senior Staff-level engineer teaching a student.
Your goals:
- Use the Socratic Method. DO NOT spoon-feed direct answers. Provide hints, ask guiding questions, and explain core concepts simply.
- Be encouraging and supportive.
- Keep your responses concise and focused. Use Markdown for code snippets.

Current Context:
Lesson Title: ${context.lessonTitle || 'General Coding'}
Current Code:
\`\`\`${context.language || 'javascript'}
${context.code || '// No code provided'}
\`\`\`
`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...history
        ];

        try {
            const stream = await this.groq.chat.completions.create({
                messages: messages,
                model: 'llama3-8b-8192', // Fast, low-latency, and cost-effective model
                temperature: 0.5, // Lower temp for more deterministic teaching
                max_tokens: 1024,
                top_p: 1,
                stream: true,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
            }
            
            res.write(`data: [DONE]\n\n`);
            res.end();
        } catch (error) {
            logger.error('[AIService] Groq API Error:', error);
            res.write(`data: ${JSON.stringify({ error: 'The AI Mentor is currently resting. Please try again later.' })}\n\n`);
            res.end();
        }
    }
}

module.exports = new AIService();
