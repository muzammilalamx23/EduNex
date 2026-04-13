const fs = require('fs');
const path = require('path');

function walk(dir, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            let abspath = path.join(dir, file);
            fs.stat(abspath, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(abspath, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    if (file.endsWith('.js') || file.endsWith('.jsx')) {
                        results.push(abspath);
                    }
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

walk('./src', (err, files) => {
    if (err) throw err;
    let hasError = false;
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const imports = content.match(/from\s+['"]([^'"]+)['"]/g) || [];
        imports.forEach(imp => {
            const rawPath = imp.match(/from\s+['"]([^'"]+)['"]/)[1];
            if (rawPath.startsWith('.')) {
                let targetPath = path.resolve(path.dirname(file), rawPath);
                
                // try extensions
                let tries = [targetPath, targetPath + '.js', targetPath + '.jsx'];
                // also try index
                tries.push(path.join(targetPath, 'index.js'));
                tries.push(path.join(targetPath, 'index.jsx'));

                let found = false;
                for (let t of tries) {
                    if (fs.existsSync(t)) {
                        found = true;
                        // check exact casing
                        const dirname = path.dirname(t);
                        const basename = path.basename(t);
                        const actualFiles = fs.readdirSync(dirname);
                        if (!actualFiles.includes(basename)) {
                            console.error(`Case mismatch in ${file}:\n -> Imported '${rawPath}' but actual file is differently cased in directory.`);
                            hasError = true;
                        }
                        break;
                    }
                }
            }
        });
    });
    if (!hasError) console.log("No case sensitivity import errors found.");
});
