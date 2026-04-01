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

const MISSIONS = [
  {
    level: 1,
    title: "The Foundation",
    description: "Every website needs structure. Start by creating a `<div>` with the class `container`.",
    task: "**Task 1:** Create a `<div>` with the class `container` inside the body.",
    xp: 50,
    validate: (html, css) => /<div[^>]*class\s*=\s*(["'])container\1[^>]*>/i.test(html),
    errorMessage: "Make sure you added the `<div class=\"container\">`.",
    successMessage: "Great start! The container is the wrapper for our content."
  },
  {
    level: 2,
    title: "Main Heading",
    description: "Your page needs a title. Add an `<h1>` tag inside the container.",
    task: "**Task 2:** Create an `<h1>` element inside the container and add some text like 'My Portfolio'.",
    xp: 60,
    validate: (html, css) => /<h1\b[^>]*>.*<\/h1>/i.test(html) && /<div[^>]*class\s*=\s*["']container["'][^>]*>[\s\S]*<h1\b/i.test(html),
    errorMessage: "I don't see an `<h1>` inside the container. Make sure you don't delete the container!",
    successMessage: "Awesome! The main heading is crucial for SEO and accessibility."
  },
  {
    level: 3,
    title: "A Little About You",
    description: "Let's add a description. Use a `<p>` tag.",
    task: "**Task 3:** Add a `<p>` (paragraph) tag below the heading with some text about yourself.",
    xp: 70,
    validate: (html, css) => /<p\b[^>]*>[\s\S]*<\/p>/i.test(html),
    errorMessage: "No paragraph tag found. Ensure you used `<p>` and closed it with `</p>`.",
    successMessage: "Perfect paragraph!"
  },
  {
    level: 4,
    title: "List Your Skills",
    description: "HTML uses `<ul>` and `<li>` tags for unordered (bulleted) lists.",
    task: "**Task 4:** Create an unordered list `<ul>` with at least two list items `<li>` inside it.",
    xp: 80,
    validate: (html, css) => {
      const ulMatch = html.match(/<ul\b[^>]*>([\s\S]*?)<\/ul>/i);
      if (!ulMatch) return false;
      const liMatches = ulMatch[1].match(/<li\b[^>]*>/gi);
      return liMatches && liMatches.length >= 2;
    },
    errorMessage: "You need a `<ul>` block that contains at least two `<li>` items.",
    successMessage: "Great list!"
  },
  {
    level: 5,
    title: "Adding Links",
    description: "The web is interconnected! Let's build a hyperlink.",
    task: "**Task 5:** Add an `<a>` tag with an `href` attribute pointing to a valid URL.",
    xp: 90,
    validate: (html, css) => /<a\s+[^>]*href\s*=\s*["']https?:\/\/[^"']+["'][^>]*>/i.test(html),
    errorMessage: "Oh no, there's no valid `<a>` tag with a full URL starting with http/https in the `href` attribute.",
    successMessage: "You nailed the hyperlink!"
  },
  {
    level: 6,
    title: "Image Embedding",
    description: "Visuals make sites pop.",
    task: "**Task 6:** Add an `<img>` tag with `src` and `alt` attributes.",
    xp: 100,
    validate: (html, css) => (/<img\s+[^>]*src\s*=\s*["'][^"']+["'][^>]*alt\s*=\s*["'][^"']*["'][^>]*>/i.test(html) || /<img\s+[^>]*alt\s*=\s*["'][^"']*["'][^>]*src\s*=\s*["'][^"']+["'][^>]*>/i.test(html)),
    errorMessage: "Missing an `<img>` tag, or forgot either the `src` or `alt` attribute.",
    successMessage: "Good job adding an image! Remember, `alt` is critical for accessibility."
  },
  {
    level: 7,
    title: "Interactive Button",
    description: "Users love to click things.",
    task: "**Task 7:** Create a `<button>` tag with the class `btn` and the text 'Click Me'.",
    xp: 110,
    validate: (html, css) => /<button[^>]*class\s*=\s*(["'])btn\1[^>]*>[\s\S]*<\/button>/i.test(html),
    errorMessage: "I don't see a `<button>` tag with the class `btn`.",
    successMessage: "Clickable! Buttons are essential for modern web applications."
  },
  {
    level: 8,
    title: "Styling Setup",
    description: "Our HTML is ready, let's inject some life. Switch to the CSS tab.",
    task: "**Task 8:** In `styles.css`, target your `.container` class and add `padding: 20px;`.",
    xp: 120,
    validate: (html, css) => /\.container\s*\{[^}]*padding\s*:\s*20px/i.test(css),
    errorMessage: "Make sure you used `.container { padding: 20px; }` exactly.",
    successMessage: "Nice CSS basics!"
  },
  {
    level: 9,
    title: "Hover States",
    description: "Make the button interactive when the mouse is over it.",
    task: "**Task 9:** Target `.btn:hover` in your CSS and change its `background-color`.",
    xp: 130,
    validate: (html, css) => /\.btn\s*:\s*hover\s*\{[^}]*(background-color|background)\s*:/i.test(css),
    errorMessage: "Didn't find `.btn:hover` with a background property change.",
    successMessage: "Looking very dynamic!"
  },
  {
    level: 10,
    title: "CSS Flexbox",
    description: "Final boss: flexbox layout.",
    task: "**Task 10:** Let's lay out the list items side by side. Target `ul` in CSS and set `display: flex;`.",
    xp: 200,
    validate: (html, css) => /ul\s*\{[^}]*display\s*:\s*flex/i.test(css),
    errorMessage: "Need to select `ul` and set `display: flex;`.",
    successMessage: "You are a flexbox master!"
  }
];

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
  const [progress, setProgress] = useState(1); // 1 = Level 1, up to 11 (Completed)
  const [showXpAnim, setShowXpAnim] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  // Derive current mission
  const currentMission = MISSIONS[progress - 1] || null;

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: `Hey! Let's master HTML & CSS.\n\n${MISSIONS[0].task}` }
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
      setChatMessages(prev => [...prev, { role: 'assistant', text: "Remember, write the code in the editor. Click 'Submit Code' when you're ready to submit it for XP!" }]);
    }, 1200);
  };

  const handleReviewCode = () => {
    if (progress > MISSIONS.length) return;
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const mission = MISSIONS[progress - 1];
      const isSuccess = mission.validate(htmlCode, cssCode);

      if (!isSuccess) {
        setChatMessages(prev => [...prev, 
          { role: 'assistant', text: `❌ **Not Quite Yet!**\n\n${mission.errorMessage}` }
        ]);
        return;
      }

      // Success Logic
      setXp(x => x + mission.xp);
      setEarnedXp(mission.xp);
      setShowXpAnim(true);
      setTimeout(() => setShowXpAnim(false), 2500);
      
      if (progress < MISSIONS.length) {
        const nextMission = MISSIONS[progress];
        setProgress(p => p + 1);
        setChatMessages(prev => [...prev, 
          { role: 'assistant', text: `🎉 ${mission.successMessage}\n\nAwarded **+${mission.xp} XP**!\n\n${nextMission.task}` }
        ]);
      } else {
        setProgress(p => p + 1);
        setChatMessages(prev => [...prev, 
          { role: 'assistant', text: `🏆 **COURSE ACCOMPLISHED!**\n\nYou've finished all 10 levels of the HTML Mastery Practice! You are unstoppable. I awarded you your final **+${mission.xp} XP**! See you in the next module.` }
        ]);
      }
    }, 1200);
  };

  const handleReset = () => {
    setHtmlCode(DEFAULT_HTML);
    setCssCode(DEFAULT_CSS);
    setProgress(1);
    setChatMessages([
      { role: 'assistant', text: `Progress reset! Let's try this 10-level challenge again.\n\n${MISSIONS[0].task}` }
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
              +{earnedXp} XP
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
              <p className="text-[9px] text-blue-400 uppercase tracking-widest font-black">HTML Mastery (10 Levels)</p>
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
            disabled={progress > MISSIONS.length}
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
                <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1.5">
                  Phase {Math.min(progress, RegExp(MISSIONS.length).source)}
                </h3>
                <h2 className="text-white text-[15px] font-black flex items-center gap-2">
                  {currentMission ? currentMission.title : "Challenge Completed!"} 
                  {currentMission && (
                    <div className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[10px] uppercase tracking-wider font-bold">
                      +{currentMission.xp} XP
                    </div>
                  )}
                </h2>
              </div>
              <span className="text-sm font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
                {Math.min(progress, MISSIONS.length)}/{MISSIONS.length}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-[#030712] h-2.5 rounded-full overflow-hidden border border-white/[0.06] mb-4 shadow-inner">
              <motion.div 
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full relative"
                initial={{ width: '0%' }}
                animate={{ width: `${(Math.min(progress - 1, MISSIONS.length) / MISSIONS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                 <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>

            {/* Quick overview text */}
            <p className="text-xs text-zinc-400 italic">
               {currentMission ? currentMission.description : "All levels conquered!"}
            </p>
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
