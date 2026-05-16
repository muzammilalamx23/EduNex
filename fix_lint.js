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

        // Fix 'motion' unused imports
        if (content.includes("import { motion }") || content.includes("import { motion,")) {
            // Remove motion from framer-motion imports
            content = content.replace(/import\s*{\s*motion\s*}\s*from\s*['"]framer-motion['"];?\s*\n?/g, '');
            content = content.replace(/import\s*{\s*motion\s*,\s*AnimatePresence\s*}\s*from\s*['"]framer-motion['"];?/g, "import { AnimatePresence } from 'framer-motion';");
            content = content.replace(/import\s*{\s*AnimatePresence\s*,\s*motion\s*}\s*from\s*['"]framer-motion['"];?/g, "import { AnimatePresence } from 'framer-motion';");
            modified = true;
        }
        
        // Remove 'err' catch unused
        if (content.match(/catch\s*\(\s*err\s*\)/)) {
            content = content.replace(/catch\s*\(\s*err\s*\)/g, 'catch');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed:', filePath);
        }
    }
});
