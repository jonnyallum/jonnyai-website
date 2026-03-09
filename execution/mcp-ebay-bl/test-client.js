import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, 'dist', 'index.js');

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: process.env
});

let messageId = 1;

function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: '2.0',
    id: messageId++,
    method,
    params
  };
  server.stdin.write(JSON.stringify(request) + '\n');
}

server.stdout.on('data', (data) => {
  const raw = data.toString();
  console.log('RAW DATA FROM SERVER:', raw);
  const responses = raw.split('\n').filter(line => line.trim());
  responses.forEach(line => {
    try {
      const response = JSON.parse(line);
      console.log('--- Server Response ---');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.id === 1) {
        // After list_tools, call search_listings
        console.log('\n--- Calling search_listings ---');
        sendRequest('tools/call', {
          name: 'search_listings',
          arguments: { q: 'motorcycle helmet', limit: 2 }
        });
      } else if (response.id === 2 || response.error) {
        console.log('\nTest complete. Terminating...');
        server.kill();
        process.exit(0);
      }
    } catch (e) {
      console.log('Failed to parse line as JSON:', line);
    }
  });
});

console.log('--- Starting MCP Client Test ---');
sendRequest('tools/list');

setTimeout(() => {
  console.log('Test timed out.');
  server.kill();
  process.exit(1);
}, 15000);
