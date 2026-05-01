const fs = require('fs');

function updateFile(path, replacements) {
    let content = fs.readFileSync(path, 'utf8');
    replacements.forEach(r => {
        content = content.replace(r.search, r.replace);
    });
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Updated ${path}`);
}

// Update CourseDetail.jsx
updateFile('client/src/pages/CourseDetail.jsx', [
    { search: /selection:bg-cyan-500\/30/g, replace: 'selection:bg-violet-500/30' },
    { search: /bg-cyan-500\/10/g, replace: 'bg-violet-50' },
    { search: /border-cyan-500\/20/g, replace: 'border-violet-100' },
    { search: /text-cyan-400/g, replace: 'text-violet-600' },
    { search: /text-cyan-500/g, replace: 'text-violet-600' },
    { search: /hover:text-cyan-400/g, replace: 'hover:text-violet-600' },
    { search: /border-cyan-500/g, replace: 'border-violet-600' },
    { search: /bg-cyan-500/g, replace: 'bg-violet-600' },
    { search: /hover:bg-cyan-500/g, replace: 'hover:bg-violet-700' },
    { search: /bg-blue-500/g, replace: 'bg-indigo-600' },
    { search: /text-blue-500/g, replace: 'text-indigo-600' },
    { search: /text-blue-400/g, replace: 'text-indigo-600' },
    { search: /bg-blue-500\/10/g, replace: 'bg-indigo-50' },
    { search: /bg-blue-500\/20/g, replace: 'bg-indigo-50' },
    { search: /border-blue-500\/20/g, replace: 'border-indigo-100' },
    { search: /border-blue-500\/30/g, replace: 'border-indigo-100' },
    { search: /shadow-blue-500\/20/g, replace: 'shadow-indigo-500/20' },
    { search: /shadow-blue-500\/50/g, replace: 'shadow-indigo-500/50' },
    { search: /text-black font-bold rounded-xl/g, replace: 'text-white font-bold rounded-xl' },
    { search: /bg-white text-black hover:bg-violet-600/g, replace: 'bg-violet-600 text-white hover:bg-violet-700' },
    { search: /bg-indigo-600 text-gray-900 shadow-indigo-600\/20/g, replace: 'bg-indigo-600 text-white shadow-indigo-600/20' },
    { search: /border-zinc-700/g, replace: 'border-gray-200' },
    { search: /hover:border-zinc-700/g, replace: 'hover:border-violet-400' },
    { search: /text-black shadow-lg/g, replace: 'text-white shadow-lg' },
    { search: /text-cyan-500/g, replace: 'text-violet-600' }, // double check
    { search: /text-blue-500/g, replace: 'text-violet-600' }  // double check
]);

// Update CoursePlayer.jsx
updateFile('client/src/pages/CoursePlayer.jsx', [
    { search: /bg-cyan-500\/10/g, replace: 'bg-violet-50' },
    { search: /border-cyan-500\/20/g, replace: 'border-violet-100' },
    { search: /text-cyan-400/g, replace: 'text-violet-600' },
    { search: /hover:bg-cyan-500\/20/g, replace: 'hover:bg-violet-100' },
    { search: /bg-violet-600 text-black/g, replace: 'bg-violet-600 text-white' },
    { search: /bg-cyan-500 animate-pulse/g, replace: 'bg-violet-500 animate-pulse' },
    { search: /text-zinc-600/g, replace: 'text-gray-400' },
    { search: /text-black shadow-lg shadow-\[#7C3AED\]\/20/g, replace: 'text-white shadow-lg shadow-[#7C3AED]/20' },
    { search: /bg-violet-600 text-black/g, replace: 'bg-violet-600 text-white' }
]);

console.log('Final theme sweep complete');
