import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, Server, Terminal, ShieldAlert, Sparkles } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import toast from 'react-hot-toast';
import AIMentorPanel from '../components/playground/AIMentorPanel';

export default function EnginePlayground() {
    const [language, setLanguage] = useState('nodejs');
    const [code, setCode] = useState('console.log("Hello EduNex Engine!");\n');
    const [output, setOutput] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [socket, setSocket] = useState(null);
    const [activeTab, setActiveTab] = useState('console'); // 'console' or 'ai'

    // Setup Socket.IO connection
    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            withCredentials: true,
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to execution engine');
        });

        newSocket.on('execution:started', (data) => {
            setOutput('=> Job queued. Container spinning up...\n');
        });

        newSocket.on('execution:completed', (result) => {
            setIsExecuting(false);
            if (result.error) {
                setOutput(`=> Execution Error:\n${result.error}`);
            } else if (result.stderr) {
                setOutput(`=> stderr:\n${result.stderr}\n=> stdout:\n${result.stdout}`);
            } else {
                setOutput(`=> stdout:\n${result.stdout}`);
            }
        });

        newSocket.on('execution:failed', (data) => {
            setIsExecuting(false);
            setOutput(`=> Fatal Worker Error:\n${data.error}`);
            toast.error('Execution engine failed');
        });

        newSocket.on('gamification:xp_awarded', (data) => {
            toast.success(`🎉 +${data.amount} XP: ${data.reason}`);
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    const handleRunCode = async () => {
        if (!code.trim()) return;

        setIsExecuting(true);
        setActiveTab('console'); // Auto-switch to console on run
        setOutput('=> Submitting to execution queue...');

        try {
            await api.post('/playground/execute', {
                language,
                code,
                socketId: socket?.id
            });
            // Result comes via Socket.IO
        } catch (err) {
            setIsExecuting(false);
            setOutput(`=> API Error: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleSubmitForReview = async () => {
        if (!code.trim()) return;
        setIsSubmittingReview(true);
        try {
            const res = await api.post('/playground/submit', {
                language,
                code,
                lessonTitle: 'Playground Exploration'
            });
            if (res.data.success) {
                toast.success('Code submitted to admins for review!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit code');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white font-body">
            {/* Header */}
            <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 shrink-0 shadow-lg">
                <div className="flex items-center gap-3">
                    <Server className="text-violet-500" />
                    <h1 className="font-bold tracking-wider">EduNex Distributed Engine</h1>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={language}
                        onChange={(e) => {
                            setLanguage(e.target.value);
                            setCode(e.target.value === 'python' ? 'print("Hello Python Engine!")\n' : 'console.log("Hello Node Engine!");\n');
                        }}
                        className="bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg border border-gray-600 focus:outline-none"
                    >
                        <option value="nodejs">Node.js (v18)</option>
                        <option value="python">Python (3.9)</option>
                    </select>

                    <button
                        onClick={handleSubmitForReview}
                        disabled={isSubmittingReview || !code.trim()}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                        {isSubmittingReview ? <Loader2 size={18} className="animate-spin" /> : <ShieldAlert size={18} />}
                        Submit for Review
                    </button>

                    <button
                        onClick={handleRunCode}
                        disabled={isExecuting || !socket?.connected}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50"
                    >
                        {isExecuting ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                        Run via BullMQ
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 flex overflow-hidden">
                {/* Editor Panel */}
                <section className="flex-1 border-r border-gray-700 flex flex-col relative">
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 backdrop-blur border border-gray-700 rounded-lg text-xs font-semibold text-gray-400 pointer-events-none">
                        <ShieldAlert size={14} className="text-green-400" /> Docker Isolated
                    </div>
                    <Editor
                        height="100%"
                        language={language === 'nodejs' ? 'javascript' : 'python'}
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 15,
                            padding: { top: 24, bottom: 24 },
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            smoothScrolling: true,
                            cursorBlinking: "smooth",
                        }}
                    />
                </section>

                {/* Right Panel: Tabs for Console & AI */}
                <section className="w-[40%] bg-[#0d1117] flex flex-col border-l border-gray-700">
                    <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center shrink-0">
                        <button
                            onClick={() => setActiveTab('console')}
                            className={`px-4 h-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                                activeTab === 'console' 
                                    ? 'bg-[#0d1117] text-white border-t-2 border-t-violet-500' 
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200 border-t-2 border-t-transparent'
                            }`}
                        >
                            <Terminal size={14} /> Output Console
                        </button>
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`px-4 h-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                                activeTab === 'ai' 
                                    ? 'bg-[#0d1117] text-teal-400 border-t-2 border-t-teal-400' 
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200 border-t-2 border-t-transparent'
                            }`}
                        >
                            <Sparkles size={14} /> AI Mentor
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                        {activeTab === 'console' ? (
                            <div className="h-full p-4 overflow-y-auto font-mono text-sm">
                                <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {output || 'Ready for execution...'}
                                </pre>
                            </div>
                        ) : (
                            <AIMentorPanel currentCode={code} lessonTitle="Interactive Playground" />
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
