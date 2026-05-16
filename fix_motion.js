const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(path.join(__dirname, 'client/src'), function(filePath) {
    if (filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // If the file uses <motion. but doesn't import motion
        if (content.includes('<motion.') && !content.includes('import { motion')) {
            // Check if it already imports something from framer-motion
            if (content.includes("from 'framer-motion'")) {
                content = content.replace(/import\s*\{\s*([^\}]+)\s*\}\s*from\s*['"]framer-motion['"]/, "import { motion, $1 } from 'framer-motion'");
            } else {
                // Add the import at the top (after React if present, or just at the very top)
                content = `import { motion } from 'framer-motion';\n` + content;
            }
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Restored motion import in:', filePath);
        }
    }
});
