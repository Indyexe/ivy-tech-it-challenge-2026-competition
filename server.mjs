import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const files = new Map([
  ['/index.html', 'text/html; charset=utf-8'],
  ['/styles.css', 'text/css; charset=utf-8'],
  ['/app.mjs', 'text/javascript; charset=utf-8'],
  ['/starfield.mjs', 'text/javascript; charset=utf-8'],
  ['/chatbot.mjs', 'text/javascript; charset=utf-8'],
  ['/model.mjs', 'text/javascript; charset=utf-8'],
  ['/orbital-horizon.webp', 'image/webp'],
  ['/BOB-LOG.md', 'text/plain; charset=utf-8'],
]);
const host = '127.0.0.1';
const port = Number(process.argv[2] ?? 3000);

const server = createServer(async (request, response) => {
  const pathname = request.url.split('?')[0];
  const path = pathname === '/' ? '/index.html' : pathname;
  const contentType = files.get(path);

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  if (!contentType) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Page unavailable');
    return;
  }

  try {
    const body = await readFile(new URL(`.${path}`, import.meta.url));
    response.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    }).end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Starter file unavailable');
  }
});

server.listen(port, host, () => console.log(`Ivy Tech IT Challenge Hub is running at http://${host}:${server.address().port}`));
