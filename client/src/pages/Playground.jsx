import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Send, Bot, Code2, Globe, Layout, Maximize2, Sparkles, User, RefreshCw, Layers, Flame, Zap, Trophy, CheckCircle2, Circle, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EduNex Practice</title>
</head>
<body>
  
</body>
</html>`;

const DEFAULT_CSS = `body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: #030712;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
`;

export default function Playground() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('html');
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [srcDoc, setSrcDoc] = useState('');
  
  // Gamification State
  const [xp, setXp] = useState(1240);
  const [level, setLevel] = useState(4);
  const [streak, setStreak] = useState(7);
  const [progress, setProgress] = useState(1); // 1 = First task, 2 = Second, 3 = Third
  const [showXpAnim, setShowXpAnim] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hey! Let's complete today's mission. We're building a Pricing Card.\n\n**Task 1:** Create a `<div>` with the class `pricing-card` and add an `<h2>` title inside it." }
  ]);

  // Handle iframe srcDoc update
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${cssCode}</style>
          </head>
          <body>${htmlCode}</body>
        </html>
      `);
    }, 500);
    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode]);

  // User manual chat submission
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { role: 'assistant', text: "Remember, you need to write the code in the middle editor. Click the 'AI Review Code' button when you're ready to submit it for XP!" }]);
    }, 1200);
  };

  // Gamified Verification step!
  const handleReviewCode = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Basic validation logic based on the progress step
      let isSuccess = false;
      let errorMessage = "Hmm, something is missing.";

      if (progress === 1) {
        const hasDiv = /class\s*=\s*(["'])pricing-card\1/i.test(htmlCode);
        const hasH2 = /<h2\b[^>]*>/i.test(htmlCode);
        if (hasDiv && hasH2) {
          isSuccess = true;
        } else if (!hasDiv) {
          errorMessage = "It looks like you haven't added the `<div class=\"pricing-card\">` correctly. Double-check your spelling and the hyphen!";
        } else {
          errorMessage = "You added the div, but you missed the `<h2>` tag inside it!";
        }
      } else if (progress === 2) {
        const hasClass = /\.pricing-card\s*\{/i.test(cssCode);
        const hasBorder = /border\s*:/i.test(cssCode);
        const hasPadding = /padding\s*:/i.test(cssCode);
        
        if (hasClass && (hasBorder || hasPadding)) {
          isSuccess = true;
        } else if (!hasClass) {
          errorMessage = "I don't see the `.pricing-card` class in your CSS. Make sure you included the dot and spelled it exactly right!";
        } else {
          errorMessage = "You selected `.pricing-card` perfectly, but missed the `border` or `padding` rule.";
        }
      } else if (progress === 3) {
        // Allow for optional spaces between class, colon, and hover, then opening brace
        const hasHover = /\.pricing-card\s*:\s*hover.*\s*\{/i.test(cssCode);
        if (hasHover) {
          isSuccess = true;
        } else {
          errorMessage = "I can't find `.pricing-card:hover`. Make sure you spelled it perfectly (no spaces between 'pricing' and 'card')!";
        }
      }

      // If they failed the validation, don't award XP
      if (progress <= 3 && !isSuccess) {
        setChatMessages(prev => [...prev, 
          { role: 'assistant', text: `❌ **Not Quite Yet!**\n\n${errorMessage}` }
        ]);
        return;
      }

      if (progress < 3) {
        // Success Logic!
        setProgress(p => p + 1);
        setXp(x => x + 50); // Award 50 XP
        setShowXpAnim(true);
        setTimeout(() => setShowXpAnim(false), 2500);
        
        const nextTask = progress === 1 
          ? "**Task 2:** Great! Now switch to `styles.css` and style `.pricing-card` with a border and padding."
          : "**Task 3:** Almost done! Add a hover effect to the card in CSS.";

        setChatMessages(prev => [...prev, 
          { role: 'assistant', text: `🎉 BOOM! Your code looks absolutely perfect.\n\nAwarded **+50 XP**!\n\n${nextTask}` }
        ]);
      } else if (progress === 3) {
        // Final Success
        setProgress(4);
        setXp(x => x + 100);
        setShowXpAnim(true);
        setTimeout(() => setShowXpAnim(false), 2500);
        
        setChatMessages(prev => [...prev, 
          { role: 'assistant', text: `🏆 **MISSION ACCOMPLISHED!**\n\nYou are a beast. I just awarded you **+100 Bonus XP**. You're well on your way to Level 5. See you in the next challenge.` }
        ]);
      } else {
        setChatMessages(prev => [...prev, 
          { role: 'assistant', text: `You've already finished this mission. Go check out the next course module!` }
        ]);
      }
    }, 1500);
  };

  const handleReset = () => {
    setHtmlCode(DEFAULT_HTML);
    setCssCode(DEFAULT_CSS);
    setProgress(1);
    setChatMessages([
      { role: 'assistant', text: "Progress reset! Let's try this mission again from the beginning. Create that `<div>`!" }
    ]);
  };

  return (
    <div className="h-screen w-screen bg-[#030712] text-white overflow-hidden flex flex-col font-body relative">
      
      {/* Floating XP Animation when they score points */}
      <AnimatePresence>
        {showXpAnim && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: -100, scale: 1.2 }}
            exit={{ opacity: 0, y: -200, scale: 1 }}
            transition={{ duration: 1.5, type: "spring" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center"
          >
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-t from-blue-600 to-blue-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
              +{progress === 4 ? '100' : '50'} XP
            </div>
            <div className="text-xl font-bold text-yellow-400 mt-2 tracking-widest uppercase">Excellent!</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER (GAMIFICATION FOCUS) ─── */}
      <header className="h-16 border-b border-white/[0.06] bg-[#0A0F1C] flex items-center justify-between px-4 shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="text-zinc-400 hover:text-white transition-colors p-2 bg-white/[0.02] rounded-lg">
            <ArrowLeft size={18} />
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Target size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[13px] leading-tight text-white mb-0.5">EduNex Arcade</h1>
              <p className="text-[9px] text-blue-400 uppercase tracking-widest font-black">Daily Challenge</p>
            </div>
          </div>
        </div>
        
        {/* GAMIFICATION STATS */}
        <div className="flex flex-1 justify-center max-w-lg">
          <div className="flex items-center gap-2 bg-[#030712] p-1.5 rounded-2xl border border-white/[0.06] shadow-inner">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 text-orange-500 rounded-xl border border-orange-500/20">
              <Flame size={16} className="fill-orange-500" />
              <span className="font-bold text-sm">{streak}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Zap size={16} className="fill-blue-500" />
              <span className="font-bold text-sm tracking-wide">{xp} XP</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
              <Trophy size={16} />
              <span className="font-bold text-sm">Lvl {level}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 bg-white/[0.03] text-zinc-300 border border-white/[0.06] rounded-xl hover:bg-white/[0.06] hover:text-white transition-all"
          >
             <RefreshCw size={14} /> Restart
          </button>
          <button 
            onClick={handleReviewCode}
            disabled={progress > 3}
            className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:pointer-events-none"
          >
             <Sparkles size={14} /> Submit Code
          </button>
        </div>
      </header>

      {/* ─── MAIN WORKSPACE (3 PANELS) ─── */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* PANEL 1: Gamified Mission & AI Coach (Left - 25%) */}
        <section className="w-1/4 min-w-[320px] max-w-[400px] border-r border-white/[0.06] bg-[#0A0F1C]/80 flex flex-col relative z-10 shadow-xl">
          
          {/* OBJECTIVES TRACKER */}
          <div className="p-5 border-b border-light/[0.06] bg-[#0A0F1C]">
            <div className="flex justify-between items-end mb-3">
              <div>
                <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1.5">Current Mission</h3>
                <h2 className="text-white text-[15px] font-black flex items-center gap-2">Build Pricing Card <div className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[10px] uppercase tracking-wider font-bold">+200 XP</div></h2>
              </div>
              <span className="text-sm font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">{Math.min(progress, 3)}/3</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-[#030712] h-2.5 rounded-full overflow-hidden border border-white/[0.06] mb-4 shadow-inner">
              <motion.div 
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full relative"
                initial={{ width: '0%' }}
                animate={{ width: `${(Math.min(progress - 1, 3) / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                 <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>

            {/* Tasks Checklist */}
            <div className="space-y-2.5">
              <div className={`flex items-center gap-3 text-xs ${progress > 1 ? 'text-zinc-500 line-through' : 'text-white font-bold'}`}>
                 {progress > 1 ? <CheckCircle2 size={14} className="text-green-500" /> : <Circle size={14} className="text-blue-500" />} 
                 1. Add 'pricing-card' div & title
              </div>
              <div className={`flex items-center gap-3 text-xs ${progress > 2 ? 'text-zinc-500 line-through' : progress === 2 ? 'text-white font-bold' : 'text-zinc-600'}`}>
                 {progress > 2 ? <CheckCircle2 size={14} className="text-green-500" /> : <Circle size={14} className={progress === 2 ? "text-blue-500" : ""} />} 
                 2. Style standard card borders in CSS
              </div>
              <div className={`flex items-center gap-3 text-xs ${progress > 3 ? 'text-green-400 font-bold' : progress === 3 ? 'text-white font-bold' : 'text-zinc-600'}`}>
                 {progress > 3 ? <CheckCircle2 size={14} className="text-green-500" /> : <Circle size={14} className={progress === 3 ? "text-blue-500" : ""} />} 
                 3. Implement interactive hover states
              </div>
            </div>
          </div>
          
          {/* AI Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-transparent">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${msg.role === 'assistant' ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                   {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-[13px] max-w-[85%] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'assistant' ? 'bg-[#030712] text-zinc-300 border border-white/[0.08] rounded-tl-none font-medium' : 'bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-tr-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500 text-white">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.08] rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s'}}></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s'}}></span>
                  </div>
                </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.06] bg-[#0A0F1C] mt-auto relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isTyping}
                placeholder="Message your AI Coach..."
                className="w-full bg-[#030712] border border-white/[0.08] rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-zinc-600"
              />
              <button 
                type="submit"
                disabled={isTyping || !chatInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white disabled:bg-transparent disabled:text-zinc-600 transition-colors flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </section>

        {/* PANEL 2: Editor (Middle - 35%) */}
        <section className="w-[35%] min-w-[300px] flex flex-col bg-[#030712] relative z-0">
          <div className="flex bg-[#0A0F1C] border-b border-white/[0.06]">
            <button 
              onClick={() => setActiveTab('html')}
              className={`flex-1 py-3.5 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'html' ? 'border-orange-500 text-orange-500 bg-orange-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'}`}
            >
              <Layout size={14} className={activeTab === 'html' ? 'text-orange-500' : ''} /> index.html
            </button>
            <button 
               onClick={() => setActiveTab('css')}
               className={`flex-1 py-3.5 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'css' ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'}`}
            >
              <Layers size={14} className={activeTab === 'css' ? 'text-blue-500' : ''}/> styles.css
            </button>
          </div>

          <div className="flex-1 relative bg-[#030712]">
            <div className={`absolute inset-0 ${activeTab === 'html' ? 'block' : 'hidden'}`}>
               <Editor
                height="100%"
                defaultLanguage="html"
                theme="vs-dark"
                value={htmlCode}
                onChange={(val) => setHtmlCode(val || '')}
                options={{ 
                  minimap: { enabled: false }, 
                  fontSize: 15, 
                  padding: { top: 24, bottom: 24 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />
            </div>
            <div className={`absolute inset-0 ${activeTab === 'css' ? 'block' : 'hidden'}`}>
               <Editor
                height="100%"
                defaultLanguage="css"
                theme="vs-dark"
                value={cssCode}
                onChange={(val) => setCssCode(val || '')}
                options={{ 
                  minimap: { enabled: false }, 
                  fontSize: 15, 
                  padding: { top: 24, bottom: 24 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />
            </div>
          </div>
        </section>

        {/* PANEL 3: Live Preview (Right - 40%) */}
        <section className="flex-1 bg-white relative flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20">
          <div className="h-12 bg-[#f0f0f0] border-b border-[#e5e5e5] flex items-center px-4 justify-between shrink-0 shadow-sm">
             <div className="flex items-center gap-3 w-full max-w-sm">
                <div className="flex gap-1.5 mr-4 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-white flex-1 h-8 rounded-md border border-[#e5e5e5] flex items-center px-3 gap-2 text-zinc-400 shadow-sm">
                  <Globe size={14} />
                  <span className="text-[11px] font-medium tracking-wide">localhost:3000/preview</span>
                </div>
             </div>
          </div>
          <iframe 
            srcDoc={srcDoc}
            title="Live Preview"
            sandbox="allow-scripts allow-modals"
            className="w-full flex-1 border-none bg-white"
          />
        </section>

      </main>
    </div>
  );
}
