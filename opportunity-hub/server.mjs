/**
 * server.mjs — A-Ivy static server
 * Port 3001 · GET / HEAD only · explicit file allowlist · no-store cache
 * Run: node opportunity-hub/server.mjs
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2]) || 3001;

const files = new Map([
  ['/index.html',      'text/html; charset=utf-8'],
  ['/styles.css',      'text/css; charset=utf-8'],
  ['/app.mjs',         'text/javascript; charset=utf-8'],
  ['/logic.mjs',       'text/javascript; charset=utf-8'],
  ['/data.mjs',        'text/javascript; charset=utf-8'],
  ['/starfield.mjs',   'text/javascript; charset=utf-8'],
  ['/a-ivy-logo.webp', 'image/webp'],
  ['/a-ivy-logo-white.webp', 'image/webp'],
]);

createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }

  const pathname = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const contentType = files.get(pathname);

  if (!contentType) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  try {
    const data = await readFile(join(__dir, pathname.slice(1)));
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'Content-Length': data.length,
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`A-Ivy running at http://127.0.0.1:${PORT}`);
});
