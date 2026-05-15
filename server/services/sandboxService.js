const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const os = require('os');

class SandboxService {
    /**
     * Executes the given code inside an isolated Docker container.
     * @param {string} language - e.g., 'javascript', 'python'
     * @param {string} code - The source code to execute
     * @returns {Promise<{stdout: string, stderr: string, error: string}>}
     */
    async executeCode(language, code) {
        return new Promise(async (resolve) => {
            const tempDir = path.join(os.tmpdir(), `playground_${crypto.randomBytes(8).toString('hex')}`);
            
            try {
                // 1. Setup temporary file
                await fs.mkdir(tempDir, { recursive: true });
                
                let filename, image, cmd;
                
                // 2. Map languages to Docker images and execution commands
                switch (language.toLowerCase()) {
                    case 'javascript':
                    case 'nodejs':
                        filename = 'main.js';
                        image = 'node:18-alpine';
                        cmd = 'node main.js';
                        break;
                    case 'python':
                        filename = 'main.py';
                        image = 'python:3.9-alpine';
                        cmd = 'python main.py';
                        break;
                    default:
                        throw new Error(`Unsupported language: ${language}`);
                }

                const filePath = path.join(tempDir, filename);
                await fs.writeFile(filePath, code);

                // 3. Construct secure Docker command
                // --rm: Auto remove container
                // --net none: Disable network access
                // --memory="128m": Limit RAM
                // --cpus="0.5": Limit CPU
                const dockerCmd = `docker run --rm --net none --memory="128m" --cpus="0.5" -v "${tempDir}:/app" -w /app ${image} ${cmd}`;

                // 4. Execute with timeout wrapper
                exec(dockerCmd, { timeout: 5000 }, async (error, stdout, stderr) => {
                    // Cleanup temp files asynchronously
                    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
                    
                    if (error) {
                        if (error.killed) {
                            return resolve({ stdout: '', stderr: '', error: 'Execution Timed Out (Maximum 5 seconds allowed)' });
                        }
                        return resolve({ stdout: stdout || '', stderr: stderr || '', error: error.message });
                    }

                    resolve({ stdout: stdout || '', stderr: stderr || '', error: null });
                });

            } catch (err) {
                await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
                resolve({ stdout: '', stderr: '', error: err.message });
            }
        });
    }
}

module.exports = new SandboxService();
