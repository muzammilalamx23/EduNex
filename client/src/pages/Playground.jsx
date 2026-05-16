import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Send, Bot, Code2, Globe, Layout, Maximize2, Sparkles, User, RefreshCw, Layers, Flame, Zap, Trophy, CheckCircle2, Circle, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

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

const MISSIONS_HTML = [
  {
    level: 1,
    title: "The Foundation",
    description: "Every website needs structure. Start by creating a `<div>` with the class `container`.",
    task: "**Task 1:** Create a `<div>` with the class `container` inside the body.",
    xp: 50,
    validate: (html, css, js) => /<div[^>]*class\s*=\s*(["'])container\1[^>]*>/i.test(html),
    errorMessage: "Make sure you added the `<div class=\"container\">`.",
    successMessage: "Great start! The container is the wrapper for our content."
  },
  {
    level: 2,
    title: "Main Heading",
    description: "Your page needs a title. Add an `<h1>` tag inside the container.",
    task: "**Task 2:** Create an `<h1>` element inside the container and add some text like 'My Portfolio'.",
    xp: 60,
    validate: (html, css, js) => /<h1\b[^>]*>.*<\/h1>/i.test(html) && /<div[^>]*class\s*=\s*["']container["'][^>]*>[\s\S]*<h1\b/i.test(html),
    errorMessage: "I don't see an `<h1>` inside the container. Make sure you don't delete the container!",
    successMessage: "Awesome! The main heading is crucial for SEO and accessibility."
  },
  {
    level: 3,
    title: "A Little About You",
    description: "Let's add a description. Use a `<p>` tag.",
    task: "**Task 3:** Add a `<p>` (paragraph) tag below the heading with some text about yourself.",
    xp: 70,
    validate: (html, css, js) => /<p\b[^>]*>[\s\S]*<\/p>/i.test(html),
    errorMessage: "No paragraph tag found. Ensure you used `<p>` and closed it with `</p>`.",
    successMessage: "Perfect paragraph!"
  },
  {
    level: 4,
    title: "List Your Skills",
    description: "HTML uses `<ul>` and `<li>` tags for unordered (bulleted) lists.",
    task: "**Task 4:** Create an unordered list `<ul>` with at least two list items `<li>` inside it.",
    xp: 80,
    validate: (html, css, js) => {
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
    validate: (html, css, js) => /<a\s+[^>]*href\s*=\s*["']https?:\/\/[^"']+["'][^>]*>/i.test(html),
    errorMessage: "Oh no, there's no valid `<a>` tag with a full URL starting with http/https in the `href` attribute.",
    successMessage: "You nailed the hyperlink!"
  },
  {
    level: 6,
    title: "Image Embedding",
    description: "Visuals make sites pop.",
    task: "**Task 6:** Add an `<img>` tag with `src` and `alt` attributes.",
    xp: 100,
    validate: (html, css, js) => (/<img\s+[^>]*src\s*=\s*["'][^"']+["'][^>]*alt\s*=\s*["'][^"']*["'][^>]*>/i.test(html) || /<img\s+[^>]*alt\s*=\s*["'][^"']*["'][^>]*src\s*=\s*["'][^"']+["'][^>]*>/i.test(html)),
    errorMessage: "Missing an `<img>` tag, or forgot either the `src` or `alt` attribute.",
    successMessage: "Good job adding an image! Remember, `alt` is critical for accessibility."
  },
  {
    level: 7,
    title: "Interactive Button",
    description: "Users love to click things.",
    task: "**Task 7:** Create a `<button>` tag with the class `btn` and the text 'Click Me'.",
    xp: 110,
    validate: (html, css, js) => /<button[^>]*class\s*=\s*(["'])btn\1[^>]*>[\s\S]*<\/button>/i.test(html),
    errorMessage: "I don't see a `<button>` tag with the class `btn`.",
    successMessage: "Clickable! Buttons are essential for modern web applications."
  },
  {
    level: 8,
    title: "Styling Setup",
    description: "Our HTML is ready, let's inject some life. Switch to the CSS tab.",
    task: "**Task 8:** In `styles.css`, target your `.container` class and add `padding: 20px;`.",
    xp: 120,
    validate: (html, css, js) => /\.container\s*\{[^}]*padding\s*:\s*20px/i.test(css),
    errorMessage: "Make sure you used `.container { padding: 20px; }` exactly.",
    successMessage: "Nice CSS basics!"
  },
  {
    level: 9,
    title: "Hover States",
    description: "Make the button interactive when the mouse is over it.",
    task: "**Task 9:** Target `.btn:hover` in your CSS and change its `background-color`.",
    xp: 130,
    validate: (html, css, js) => /\.btn\s*:\s*hover\s*\{[^}]*(background-color|background)\s*:/i.test(css),
    errorMessage: "Didn't find `.btn:hover` with a background property change.",
    successMessage: "Looking very dynamic!"
  },
  {
    level: 10,
    title: "CSS Flexbox",
    description: "Final boss: flexbox layout.",
    task: "**Task 10:** Let's lay out the list items side by side. Target `ul` in CSS and set `display: flex;`.",
    xp: 200,
    validate: (html, css, js) => /ul\s*\{[^}]*display\s*:\s*flex/i.test(css),
    errorMessage: "Need to select `ul` and set `display: flex;`.",
    successMessage: "You are a flexbox master!"
  }
];

const MISSIONS_JS = [
  {
    level: 1,
    title: "The Brain of the Web",
    description: "JavaScript makes things happen. Let's start with a simple variable.",
    task: "**Task 1:** Declare a constant named `platform` and set it to the string `'EduNex'`.",
    xp: 50,
    validate: (html, css, js) => /const\s+platform\s*=\s*(['"])EduNex\1/.test(js),
    errorMessage: "Check your variable declaration: `const platform = 'EduNex';`",
    successMessage: "Variables are the storage containers of programming!"
  },
  {
    level: 2,
    title: "Hello Alert",
    description: "User interactions are key. Let's trigger a popup.",
    task: "**Task 2:** Use the `alert()` function to display the message 'Welcome to JavaScript'.",
    xp: 60,
    validate: (html, css, js) => /alert\s*\(\s*(['"])Welcome to JavaScript\1\s*\)/.test(js),
    errorMessage: "Did you use `alert('Welcome to JavaScript')`?",
    successMessage: "Popups are the classic (if annoying) way to get attention!"
  },
  {
    level: 3,
    title: "DOM Selection",
    description: "JS can read your HTML. Let's grab the body element.",
    task: "**Task 3:** Select the body using `document.querySelector('body')` and store it in a variable named `page`.",
    xp: 70,
    validate: (html, css, js) => /(const|let|var)\s+page\s*=\s*document\.querySelector\(\s*(['"])body\2\s*\)/.test(js),
    errorMessage: "Use `const page = document.querySelector('body')`.",
    successMessage: "You've successfully 'grabbed' an element from the page!"
  },
  {
    level: 4,
    title: "Color Shift",
    description: "Let's change the background color using JS.",
    task: "**Task 4:** Set the `backgroundColor` of the `document.body` to `'crimson'`.",
    xp: 80,
    validate: (html, css, js) => /document\.body\.style\.backgroundColor\s*=\s*(['"])crimson\1/.test(js),
    errorMessage: "Try `document.body.style.backgroundColor = 'crimson'`.",
    successMessage: "Dynamic styling at your fingertips!"
  },
  {
    level: 5,
    title: "Function Mastery",
    description: "Functions wrap logic into reusable blocks.",
    task: "**Task 5:** Create a function named `sayHello` that uses `console.log` to say 'Hello'.",
    xp: 90,
    validate: (html, css, js) => /function\s+sayHello\s*\(\s*\)\s*\{[\s\S]*console\.log\s*\(\s*(['"])Hello\1\s*\)/.test(js),
    errorMessage: "Define `function sayHello() { console.log('Hello'); }`.",
    successMessage: "Functions are the workhorses of JavaScript!"
  }
];

const MISSIONS_REACT = [
  {
    level: 1,
    title: "The React Way",
    description: "React is a component-based library. Let's build your first component.",
    task: "**Task 1:** Create a functional component named `App` that returns an `<h1>` with the text 'Hello React'.",
    xp: 100,
    validate: (html, css, js, react) => /const\s+App\s*=\s*\(\s*\)\s*=>\s*<h1\b[^>]*>Hello React<\/h1>/i.test(react) || /function\s+App\s*\(\s*\)\s*\{[\s\S]*return\s*<h1\b[^>]*>Hello React<\/h1>/i.test(react),
    errorMessage: "Define `const App = () => <h1>Hello React</h1>;`",
    successMessage: "Welcome to the world of components!"
  },
  {
    level: 2,
    title: "JSX Attributes",
    description: "In JSX, we use `className` instead of `class`.",
    task: "**Task 2:** Add the `className=\"title\"` attribute to your `<h1>` inside the `App` component.",
    xp: 110,
    validate: (html, css, js, react) => /<h1\b[^>]*className\s*=\s*(["'])title\1[^>]*>/i.test(react),
    errorMessage: "Make sure you used `className=\"title\"` on the `<h1>` tag.",
    successMessage: "JSX attributes are slightly different but very powerful!"
  },
  {
    level: 3,
    title: "Reactive State",
    description: "State allows components to remember things.",
    task: "**Task 3:** Initialize a state variable `count` using `useState(0)` inside your component.",
    xp: 120,
    validate: (html, css, js, react) => /const\s*\[\s*count\s*,\s*setCount\s*\]\s*=\s*React\.useState\(\s*0\s*\)/.test(react) || /const\s*\[\s*count\s*,\s*setCount\s*\]\s*=\s*useState\(\s*0\s*\)/.test(react),
    errorMessage: "Did you add `const [count, setCount] = React.useState(0);`?",
    successMessage: "State is what makes React 'reactive'!"
  },
  {
    level: 4,
    title: "Event Handling",
    description: "React uses camelCase for events like `onClick`.",
    task: "**Task 4:** Add a `<button>` that calls `setCount(count + 1)` on click.",
    xp: 130,
    validate: (html, css, js, react) => /onClick\s*=\s*\{\s*\(\s*\)\s*=>\s*setCount\(\s*count\s*\+\s*1\s*\)\s*\}/.test(react),
    errorMessage: "Add `onClick={() => setCount(count + 1)}` to a button.",
    successMessage: "Interactivity completed!"
  },
  {
    level: 5,
    title: "Conditional Rendering",
    description: "Show different UI based on state.",
    task: "**Task 5:** Render a `<div>` that says 'High Score!' only if `count > 10`.",
    xp: 150,
    validate: (html, css, js, react) => /\{\s*count\s*>\s*10\s*&&\s*<div\b[^>]*>High Score!<\/div>\s*\}/.test(react) || /count\s*>\s*10\s*\?\s*<div\b[^>]*>High Score!<\/div>\s*:\s*null/i.test(react),
    errorMessage: "Try `{count > 10 && <div>High Score!</div>}`.",
    successMessage: "You are now a React developer!"
  },
  {
    level: 6,
    title: "Mini Project: Task Master",
    description: "Final Challenge! Combine everything you've learned to build a simple task list.",
    task: "**Final Project:** Create a component that renders an input field and uses `.map()` to display a list of tasks from an array in state.",
    xp: 300,
    validate: (html, css, js, react) => /\.map\(\s*[\s\S]*=>\s*<li\b/.test(react) && (/<input\b/.test(react) || /useState\(\s*\[/.test(react)),
    errorMessage: "Try using `tasks.map(t => <li>{t}</li>)` to render your list.",
    successMessage: "🎓 CONGRATULATIONS! You've built a React project from scratch!"
  }
];

const DEFAULT_JS = `// Welcome to JavaScript Mastery!
// Your code here...
`;

const DEFAULT_REACT = `// Welcome to React Mastery!
const App = () => {
  return (
    <div className="p-8">
      <h1>Hello EduNex</h1>
      <p>Start building your component below!</p>
    </div>
  );
};

// Render your component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`;

export default function Playground() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth(); // ← real user data
  const [activeTab, setActiveTab] = useState('html');
  const [activeCourse, setActiveCourse] = useState('html'); // 'html', 'js', 'react'
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [reactCode, setReactCode] = useState(DEFAULT_REACT);
  const [srcDoc, setSrcDoc] = useState('');
  const [activeMobilePanel, setActiveMobilePanel] = useState('mission'); // 'mission', 'editor', 'preview'
  
  // Choose missions based on active course
  const MISSIONS = activeCourse === 'html' ? MISSIONS_HTML : 
                   activeCourse === 'js' ? MISSIONS_JS : 
                   MISSIONS_REACT;

  // Gamification State — derived from real user where possible
  // XP and streak come from the auth context; local 'progress' tracks playground level
  const [progress, setProgress] = useState(1); // 1 = Level 1, up to 11 (Completed)
  const [showXpAnim, setShowXpAnim] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isSavingXp, setIsSavingXp] = useState(false);

  // Derive stats from real user — never hardcode these
  const xp = user?.xp ?? 0;
  const streak = user?.streak ?? 0;
  // Approximate level from XP (every 500 XP = 1 level)
  const level = Math.max(1, Math.floor(xp / 500) + 1);

  // Derive current mission
  const currentMission = MISSIONS[progress - 1] || null;

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  // Initialize chat when course changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChatMessages([
      { 
        role: 'assistant', 
        text: `Hey${user ? ` ${user.fullName?.split(' ')[0]}` : ''}! Let's master ${activeCourse.toUpperCase()}.\n\n${MISSIONS[0].task}` 
      }
    ]);
    setProgress(1); // Reset progress on course switch
    setActiveTab(activeCourse === 'js' ? 'js' : activeCourse === 'react' ? 'react' : 'html');
  }, [activeCourse, user]);

  // Handle iframe srcDoc update
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activeCourse === 'react') {
        setSrcDoc(`
          <html>
            <head>
              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <style>${cssCode}</style>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                const { useState, useEffect } = React;
                try {
                  ${reactCode}
                } catch (e) {
                  console.error('React Error:', e.message);
                }
              </script>
            </body>
          </html>
        `);
      } else {
        setSrcDoc(`
          <html>
            <head>
              <style>${cssCode}</style>
            </head>
            <body>
              ${htmlCode}
              <script>
                try {
                  ${jsCode}
                } catch (e) {
                  console.error('JS Error:', e.message);
                }
              </script>
            </body>
          </html>
        `);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode, reactCode, activeCourse]);

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

  const handleReviewCode = async () => {
    if (progress > MISSIONS.length) return;
    setIsTyping(true);
    
    // Small artificial delay for UX — feels like the AI is thinking
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsTyping(false);
      
    const mission = MISSIONS[progress - 1];
    const isSuccess = mission.validate(htmlCode, cssCode, jsCode, reactCode);

    if (!isSuccess) {
      setChatMessages(prev => [...prev, 
        { role: 'assistant', text: `❌ **Not Quite Yet!**\n\n${mission.errorMessage}` }
      ]);
      return;
    }

    // ── Persist XP to Backend ────────────────────────────────────────────────
    // XP amount is determined server-side via the PLAYGROUND_XP_MAP.
    // The client only sends the activity key, never the XP value.
    setIsSavingXp(true);
    let savedXp = mission.xp; // optimistic fallback for display
    if (user) {
      try {
        const activityKey = `playground_level_${progress}`;
        const res = await api.post('/auth/add-xp', { activity: activityKey });
        savedXp = res.data.data?.awarded ?? mission.xp;
        // Refresh the user context so the header XP counter updates
        await refreshUser();
      } catch (err) {
        // Non-fatal: the mission still completes, XP save is best-effort
        console.error('Failed to save playground XP:', err?.response?.data?.message || err.message);
      }
    }
    setIsSavingXp(false);

    // ── XP Animation ─────────────────────────────────────────────────────────
    setEarnedXp(savedXp);
    setShowXpAnim(true);
    setTimeout(() => setShowXpAnim(false), 2500);
    
    if (progress < MISSIONS.length) {
      const nextMission = MISSIONS[progress];
      setProgress(p => p + 1);
      setChatMessages(prev => [...prev, 
        { role: 'assistant', text: `🎉 ${mission.successMessage}\n\nAwarded **+${savedXp} XP**!\n\n${nextMission.task}` }
      ]);
    } else {
      setProgress(p => p + 1);
      setChatMessages(prev => [...prev, 
        { role: 'assistant', text: `🏆 **COURSE ACCOMPLISHED!**\n\nYou've finished all 10 levels of the HTML Mastery Practice! You are unstoppable. **+${savedXp} XP** saved to your profile!` }
      ]);
    }
  };

  const handleReset = () => {
    setHtmlCode(DEFAULT_HTML);
    setCssCode(DEFAULT_CSS);
    setJsCode(DEFAULT_JS);
    setReactCode(DEFAULT_REACT);
    setProgress(1);
    setChatMessages([
      { role: 'assistant', text: `Progress reset! Let's try the ${activeCourse.toUpperCase()} challenge again.\n\n${MISSIONS[0].task}` }
    ]);
  };

  return (
    <div className="h-screen w-screen bg-gray-50 text-gray-900 overflow-hidden flex flex-col font-body relative">
      
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
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-t from-violet-600 to-violet-400 drop-shadow-[0_0_20px_rgba(124,58,237,0.5)]">
              +{earnedXp} XP
            </div>
            <div className="text-xl font-bold text-yellow-400 mt-2 tracking-widest uppercase">Excellent!</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER (GAMIFICATION FOCUS) ─── */}
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-white transition-colors p-2 bg-gray-50 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Target size={18} className="text-white" />
            </div>
            <div>
               <div className="flex items-center gap-2">
                <h1 className="font-bold text-[13px] leading-tight text-gray-900">EduNex Arcade</h1>
                <select 
                  value={activeCourse} 
                  onChange={(e) => setActiveCourse(e.target.value)}
                  className="bg-violet-50 text-violet-600 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-violet-200 focus:outline-none cursor-pointer"
                >
                  <option value="html">HTML Mastery</option>
                  <option value="js">JS Mastery</option>
                  <option value="react">React Mastery</option>
                </select>
               </div>
              <p className="text-[9px] text-violet-600 uppercase tracking-widest font-black">{activeCourse.toUpperCase()} Track ({MISSIONS.length} Levels)</p>
            </div>
          </div>
        </div>
        
        {/* GAMIFICATION STATS */}
        <div className="flex flex-1 justify-center max-w-lg px-2">
          <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-200 shadow-inner overflow-hidden">
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 bg-orange-500/10 text-orange-500 rounded-xl border border-orange-500/20">
              <Flame size={14} className="fill-orange-500 sm:w-4 sm:h-4" />
              <span className="font-bold text-[10px] sm:text-sm">{streak}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 bg-violet-50 text-violet-600 rounded-xl border border-violet-200">
              <Zap size={14} className="fill-violet-500 sm:w-4 sm:h-4" />
              <span className="font-bold text-[10px] sm:text-sm tracking-wide">{xp} XP</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
              <Trophy size={16} />
              <span className="font-bold text-sm">Lvl {level}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button 
            onClick={handleReset}
            className="hidden sm:flex items-center gap-2 text-xs font-bold px-4 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all"
          >
             <RefreshCw size={14} /> Restart
          </button>
          <button 
            onClick={handleReviewCode}
            disabled={progress > MISSIONS.length}
            className="flex items-center gap-2 text-xs font-bold px-3 sm:px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:pointer-events-none"
          >
             <Sparkles size={14} className="shrink-0" /> <span className="hidden sm:inline">Submit Code</span><span className="sm:hidden">Submit</span>
          </button>
        </div>
      </header>

      {/* ─── MAIN WORKSPACE (3 PANELS) ─── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* PANEL 1: Gamified Mission & AI Coach (Left - 25%) */}
        <section className={`w-full lg:w-1/4 lg:min-w-[320px] lg:max-w-[400px] border-r border-gray-200 bg-white/80 flex flex-col relative z-10 shadow-xl transition-all duration-300 ${activeMobilePanel === 'mission' ? 'flex-1' : 'hidden lg:flex'}`}>
          
          {/* OBJECTIVES TRACKER */}
          <div className="p-5 border-b border-gray-100 bg-white">
            <div className="flex justify-between items-end mb-3">
              <div>
                <h3 className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">
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
              <span className="text-sm font-black text-violet-600 bg-violet-50 px-2 py-1 rounded-lg border border-violet-200">
                {Math.min(progress, MISSIONS.length)}/{MISSIONS.length}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-200 mb-4 shadow-inner">
              <motion.div 
                className="bg-gradient-to-r from-violet-600 to-indigo-400 h-full rounded-full relative"
                initial={{ width: '0%' }}
                animate={{ width: `${(Math.min(progress - 1, MISSIONS.length) / MISSIONS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                 <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
              </motion.div>
            </div>

            {/* Quick overview text */}
            <p className="text-xs text-gray-500 italic">
               {currentMission ? currentMission.description : "All levels conquered!"}
            </p>
          </div>
          
          {/* AI Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-100 [&::-webkit-scrollbar-track]:bg-transparent">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${msg.role === 'assistant' ? 'bg-gradient-to-br from-violet-600 to-indigo-500 text-white' : 'bg-gray-100 text-gray-500 border border-zinc-700'}`}>
                   {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-[13px] max-w-[85%] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'assistant' ? 'bg-gray-50 text-gray-700 border border-gray-200 rounded-tl-none font-medium' : 'bg-violet-600/10 text-violet-900 border border-violet-300 rounded-tr-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-500 text-white">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s'}}></span>
                    <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s'}}></span>
                  </div>
                </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white mt-auto relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isTyping}
                placeholder="Message your AI Coach..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-400"
              />
              <button 
                type="submit"
                disabled={isTyping || !chatInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-violet-100 text-violet-600 hover:bg-violet-600 hover:text-white disabled:bg-transparent disabled:text-zinc-600 transition-colors flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </section>

        {/* PANEL 2: Editor (Middle - 35%) */}
        <section className={`w-full lg:w-[35%] min-w-[300px] flex flex-col bg-gray-50 relative z-0 ${activeMobilePanel === 'editor' ? 'flex-1' : 'hidden lg:flex'}`}>
          <div className="flex bg-white border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('html')}
              className={`flex-1 py-3.5 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'html' ? 'border-orange-500 text-orange-500 bg-orange-500/5' : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Layout size={14} className={activeTab === 'html' ? 'text-orange-500' : ''} /> index.html
            </button>
            <button 
               onClick={() => setActiveTab('css')}
               className={`flex-1 py-3.5 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'css' ? 'border-blue-500 text-violet-600 bg-violet-600/5' : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Layers size={14} className={activeTab === 'css' ? 'text-violet-600' : ''}/> styles.css
            </button>
            <button 
               onClick={() => setActiveTab('js')}
               className={`flex-1 py-3.5 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'js' ? 'border-yellow-500 text-yellow-600 bg-yellow-600/5' : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Sparkles size={14} className={activeTab === 'js' ? 'text-yellow-600' : ''}/> script.js
            </button>
            <button 
               onClick={() => setActiveTab('react')}
               className={`flex-1 py-3.5 text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'react' ? 'border-cyan-500 text-cyan-600 bg-cyan-600/5' : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Code2 size={14} className={activeTab === 'react' ? 'text-cyan-600' : ''}/> App.jsx
            </button>
          </div>

          <div className="flex-1 relative bg-gray-50">
            <div className={`absolute inset-0 ${activeTab === 'html' ? 'block' : 'hidden'}`}>
               <Editor
                height="100%"
                defaultLanguage="html"
                theme="light"
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
                theme="light"
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
            <div className={`absolute inset-0 ${activeTab === 'js' ? 'block' : 'hidden'}`}>
               <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="light"
                value={jsCode}
                onChange={(val) => setJsCode(val || '')}
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
            <div className={`absolute inset-0 ${activeTab === 'react' ? 'block' : 'hidden'}`}>
               <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="light"
                value={reactCode}
                onChange={(val) => setReactCode(val || '')}
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
        <section className={`flex-1 bg-white relative flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20 ${activeMobilePanel === 'preview' ? 'flex-1' : 'hidden lg:flex'}`}>
          <div className="h-12 bg-gray-100 border-b border-gray-300 flex items-center px-4 justify-between shrink-0 shadow-sm">
             <div className="flex items-center gap-3 w-full max-w-sm">
                <div className="flex gap-1.5 mr-4 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-white flex-1 h-8 rounded-md border border-gray-300 flex items-center px-3 gap-2 text-gray-500 shadow-sm">
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

        {/* MOBILE NAVIGATION TABS (Bottom Bar) */}
        <div className="lg:hidden h-16 border-t border-gray-200 bg-white flex items-center shrink-0">
          <button 
            onClick={() => setActiveMobilePanel('mission')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeMobilePanel === 'mission' ? 'text-violet-600' : 'text-gray-400'}`}
          >
            <Bot size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Mission</span>
          </button>
          <button 
            onClick={() => setActiveMobilePanel('editor')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeMobilePanel === 'editor' ? 'text-violet-600' : 'text-gray-400'}`}
          >
            <Code2 size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Editor</span>
          </button>
          <button 
            onClick={() => setActiveMobilePanel('preview')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${activeMobilePanel === 'preview' ? 'text-violet-600' : 'text-gray-400'}`}
          >
            <Globe size={20} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Preview</span>
          </button>
        </div>

      </main>
    </div>
  );
}
