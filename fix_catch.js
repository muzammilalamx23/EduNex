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

        // Restore 'err' if the file uses it
        if (content.match(/catch\s*\{/)) {
            // Find if there is an 'err' usage inside the catch
            if (content.match(/err[\.\)]/)) {
                content = content.replace(/catch\s*\{/g, 'catch (err) {');
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Restored err in:', filePath);
        }
    }
});
