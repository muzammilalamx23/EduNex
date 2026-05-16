import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/api'; // e.g., http://localhost:5000/api

const AIMentorPanel = ({ currentCode, lessonTitle = 'Playground' }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI Mentor. How can I help you with your code today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            // Prepare the payload
            // Send the last 6 messages for context to save tokens
            const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
            history.push({ role: 'user', content: userMsg });

            const payload = {
                history,
                context: {
                    code: currentCode,
                    lessonTitle
                }
            };

            // Setup SSE via fetch
            const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || localStorage.getItem('token') || '';
            
            const response = await fetch(`${API_BASE_URL}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Fallback if cookies are not used directly by fetch
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let aiResponse = '';

            // Add an empty assistant message that we will stream into
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '').trim();
                        if (dataStr === '[DONE]') {
                            break;
                        }
                        if (dataStr) {
                            try {
                                const parsed = JSON.parse(dataStr);
                                if (parsed.error) {
                                    aiResponse += `\n**Error:** ${parsed.error}`;
                                } else if (parsed.content) {
                                    aiResponse += parsed.content;
                                }
                                
                                // Update the last message
                                setMessages(prev => {
                                    const newMsgs = [...prev];
                                    newMsgs[newMsgs.length - 1].content = aiResponse;
                                    return newMsgs;
                                });
                            } catch (e) {
                                console.error('Error parsing SSE data:', e, dataStr);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('AI Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my neural network right now. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0d1117] border-l border-gray-700">
            {/* Header */}
            <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2 text-teal-400 font-bold tracking-wider text-sm">
                    <Sparkles size={16} /> AI Mentor
                </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-body text-sm">
                {messages.map((msg, idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                                <Bot size={16} />
                            </div>
                        )}
                        
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                            msg.role === 'user' 
                                ? 'bg-violet-600 text-white rounded-tr-sm' 
                                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-sm whitespace-pre-wrap'
                        }`}>
                            {/* Render code blocks simply for now, or use a markdown parser if added later */}
                            {msg.content}
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/30">
                                <User size={16} />
                            </div>
                        )}
                    </motion.div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                            <Bot size={16} />
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-800 border-t border-gray-700 shrink-0">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for hints or explanations..."
                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                        disabled={isTyping}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-teal-500 text-gray-900 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={14} />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Groq AI • Socratic Tutor</span>
                </div>
            </div>
        </div>
    );
};

export default AIMentorPanel;
