const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components');

const replacements = [
    [/bg-\[\#09090b\]/g, 'bg-gray-50'],
    [/bg-\[var\(--color-bg-dark\)/g, 'bg-gray-50'],
    [/bg-\[var\(--color-surface-light\)/g, 'bg-white'],
    [/bg-zinc-900\/50/g, 'bg-white'],
    [/bg-zinc-900\/20/g, 'bg-gray-50'],
    [/bg-zinc-900/g, 'bg-white'],
    [/bg-zinc-800\/50/g, 'bg-gray-100'],
    [/bg-zinc-800/g, 'bg-gray-100'],
    
    // text-white -> text-gray-900 
    [/text-white/g, 'text-gray-900'],
    [/text-zinc-400/g, 'text-gray-500'],
    [/text-zinc-500/g, 'text-gray-400'],
    [/text-zinc-300/g, 'text-gray-700'],
    [/text-\[\#00FF00\]/g, 'text-violet-600'],
    
    // Borders
    [/border-zinc-900/g, 'border-gray-200'],
    [/border-zinc-800\/50/g, 'border-gray-100'],
    [/border-zinc-800/g, 'border-gray-200'],
    [/border-\[var\(--color-border-subtle\)/g, 'border-gray-200'],
    [/border-\[\#00FF00\]\/20/g, 'border-violet-200'],
    
    // Cards
    [/glass-card/g, 'edu-card'],

    // Colors
    [/bg-\[\#00FF00\]\/10/g, 'bg-violet-100'],
    [/bg-\[\#00FF00\]/g, 'bg-violet-600'],
    [/from-\[\#00FF00\]/g, 'from-violet-500'],
    [/to-\[\#ADFF2F\]/g, 'to-indigo-500'],
    [/fill-\[\#00FF00\]/g, 'fill-violet-600'],
];

function processDir(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            // Exclude HighConversionHero or anything we shouldn't touch?
            // Actually HighConversionHero might need the light theme as well.
            // But wait, HighConversionHero already has light theme (we saw it originally).
            // Let's exclude HighConversionHero.jsx just in case we mess up its specific colors.
            if (file === 'HighConversionHero.jsx') continue;
            
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const [regex, replacement] of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            }
            
            if (modified) {
                // Button text restoration
                content = content.replace(/btn-primary([^>]*)text-gray-900/g, 'btn-primary$1text-white');
                content = content.replace(/text-gray-900([^>]*)btn-primary/g, 'text-white$1btn-primary');
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${file}`);
            }
        }
    }
}

processDir(dir);
