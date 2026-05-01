const fs = require('fs');

function updateFile(path, replacements) {
    let content = fs.readFileSync(path, 'utf8');
    replacements.forEach(r => {
        content = content.replace(r.search, r.replace);
    });
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Updated ${path}`);
}

updateFile('client/src/pages/Playground.jsx', [
    // Background and Header
    { search: /bg-\[#030712\]/g, replace: 'bg-gray-50' },
    { search: /bg-\[#0A0F1C\]/g, replace: 'bg-white' },
    { search: /border-white\/\[0.06\]/g, replace: 'border-gray-200' },
    { search: /border-white\/\[0.08\]/g, replace: 'border-gray-200' },
    { search: /border-light\/\[0.06\]/g, replace: 'border-gray-100' },
    
    // Colors: Blue -> Violet
    { search: /from-blue-600 to-blue-300/g, replace: 'from-violet-600 to-violet-400' },
    { search: /from-blue-600 to-blue-400/g, replace: 'from-violet-600 to-indigo-400' },
    { search: /from-blue-600 to-blue-500/g, replace: 'from-violet-600 to-indigo-500' },
    { search: /bg-blue-600\/20/g, replace: 'bg-violet-600/10' },
    { search: /bg-blue-500\/10/g, replace: 'bg-violet-50' },
    { search: /bg-blue-500\/20/g, replace: 'bg-violet-100' },
    { search: /text-blue-400/g, replace: 'text-violet-600' },
    { search: /text-blue-500/g, replace: 'text-violet-600' },
    { search: /text-blue-100/g, replace: 'text-violet-900' },
    { search: /border-blue-500\/20/g, replace: 'border-violet-200' },
    { search: /border-blue-500\/30/g, replace: 'border-violet-300' },
    { search: /fill-blue-500/g, replace: 'fill-violet-500' },
    { search: /shadow-blue-500\/20/g, replace: 'shadow-violet-500/20' },
    { search: /shadow-blue-500\/30/g, replace: 'shadow-violet-500/30' },
    { search: /drop-shadow-\[0_0_20px_rgba\(59,130,246,0.8\)\]/g, replace: 'drop-shadow-[0_0_20px_rgba(124,58,237,0.5)]' },
    { search: /shadow-\[0_0_20px_rgba\(59,130,246,0.3\)\]/g, replace: 'shadow-[0_0_20px_rgba(124,58,237,0.3)]' },

    // Header/Panel Specifics
    { search: /bg-\[#0A0F1C\]\/80/g, replace: 'bg-white/80' },
    { search: /bg-white\/\[0.02\]/g, replace: 'bg-gray-50' },
    { search: /bg-white\/\[0.03\]/g, replace: 'bg-gray-50' },
    { search: /bg-white\/\[0.06\]/g, replace: 'bg-gray-100' },
    
    // Chat and Input
    { search: /bg-\[#030712\] text-gray-700/g, replace: 'bg-white text-gray-800' }, // assistant bubble
    { search: /placeholder:text-zinc-600/g, replace: 'placeholder:text-gray-400' },
    { search: /bg-\[#030712\] border border-white\/\[0.08\]/g, replace: 'bg-white border border-gray-200' },
    { search: /text-gray-900/g, replace: 'text-gray-900' }, // mostly keep
    { search: /bg-gradient-to-br from-violet-600 to-indigo-500 text-gray-900/g, replace: 'bg-gradient-to-br from-violet-600 to-indigo-500 text-white' },
    { search: /bg-blue-500/g, replace: 'bg-violet-600' },
    { search: /hover:bg-blue-500/g, replace: 'hover:bg-violet-700' },
    { search: /text-gray-900/g, replace: 'text-white' }, // Target specific buttons if they are blue
    
    // Editor and Preview
    { search: /bg-\[#f0f0f0\]/g, replace: 'bg-gray-100' },
    { search: /border-\[#e5e5e5\]/g, replace: 'border-gray-300' },
    { search: /shadow-\[-10px_0_30px_rgba\(0,0,0,0.5\)\]/g, replace: 'shadow-[-10px_0_30px_rgba(0,0,0,0.05)]' },
    { search: /text-gray-900 ml-1/g, replace: 'text-white ml-1' }
]);

console.log('Playground theme update complete');
