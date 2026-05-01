const fs = require('fs');
let file = 'client/src/pages/Dashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add BarChart2, Medal to lucide-react imports
content = content.replace(
  /import \{ Layout, BookOpen, User, Settings, LogOut, Zap, Trophy, Clock, Loader2, Save, Github, Linkedin, Lock, ArrowRight, Compass, ShieldCheck, FileCheck, Bell \} from 'lucide-react';/,
  "import { Layout, BookOpen, User, Settings, LogOut, Zap, Trophy, Clock, Loader2, Save, Github, Linkedin, Lock, ArrowRight, Compass, ShieldCheck, FileCheck, Bell, BarChart2, Medal } from 'lucide-react';"
);

// 2. Fix neon colors
content = content.replace(/border-\[#00FF00\]\/10/g, 'border-violet-200');
content = content.replace(/hover:border-\[#00FF00\]\/30/g, 'hover:border-violet-300');
content = content.replace(/focus:border-\[#00FF00\]/g, 'focus:border-violet-500');
content = content.replace(/bg-\[#ADFF2F\]\/10/g, 'bg-teal-50');

// 3. Insert the new section
const newSection = `                        {/* --- NEW SECTION: Activity & Badges --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                            {/* Weekly Activity Heatmap */}
                            <div className="xl:col-span-2 edu-card bg-white border-gray-200 p-6 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <BarChart2 size={18} className="text-violet-600" />
                                        Weekly Activity
                                    </h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last 7 Days</span>
                                </div>
                                <div className="flex items-end justify-between h-40 gap-2 mt-auto">
                                    {[45, 12, 60, 0, 30, 90, userData?.dailyLearningTime || 0].map((mins, idx) => {
                                        const height = Math.max(10, Math.min(100, (mins / 60) * 100));
                                        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
                                        return (
                                            <div key={idx} className="flex flex-col items-center flex-1 gap-2 group h-full justify-end">
                                                <div className="w-full bg-gray-50 rounded-t-lg flex items-end relative overflow-hidden group-hover:bg-gray-100 transition-colors" style={{ height: '100%' }}>
                                                    <div 
                                                        className="w-full bg-gradient-to-t from-violet-500 to-indigo-400 rounded-t-lg transition-all duration-1000 ease-out"
                                                        style={{ height: \`\${height}%\` }}
                                                    ></div>
                                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        {mins}m
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400">{days[idx]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Achievements / Badges */}
                            <div className="edu-card bg-white border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Medal size={18} className="text-amber-500" />
                                        Achievements
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className={\`flex items-center gap-3 p-3 rounded-xl border transition-all \${userData?.streak >= 3 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}\`}>
                                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center shrink-0">
                                            <Zap size={18} fill="currentColor" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">3-Day Streak</h4>
                                            <p className="text-[10px] text-gray-500">Learn 3 days in a row</p>
                                        </div>
                                    </div>
                                    
                                    <div className={\`flex items-center gap-3 p-3 rounded-xl border transition-all \${userData?.xp >= 500 ? 'bg-violet-50 border-violet-200' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}\`}>
                                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                                            <Trophy size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">Rising Star</h4>
                                            <p className="text-[10px] text-gray-500">Earn 500 total XP</p>
                                        </div>
                                    </div>

                                    <div className={\`flex items-center gap-3 p-3 rounded-xl border transition-all \${userData?.coursesCompleted >= 1 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}\`}>
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                                            <BookOpen size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">First Steps</h4>
                                            <p className="text-[10px] text-gray-500">Complete your first course</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">`;

// Insert it right before <div className="flex justify-between items-center mb-6"> (Continue Learning)
content = content.replace(/<div className="flex justify-between items-center mb-6">\s*<h2 className="text-xl font-bold text-gray-900 text-gradient inline-block">Continue Learning<\/h2>/, newSection + '\n                            <h2 className="text-xl font-bold text-gray-900 text-gradient inline-block">Continue Learning</h2>');

fs.writeFileSync(file, content, 'utf8');
console.log('Dashboard updated');
