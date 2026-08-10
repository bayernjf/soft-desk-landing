// scripts/shot.mjs
import { chromium } from 'playwright';
process.env.PLAYWRIGHT_BROWSERS_PATH = '0';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const PORT = 5173, DIST = './dist', PREVIEW_OUT = 'public/preview.png';

const MIME = {
  '.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript',
  '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp',
  '.json':'application/json','.ico':'image/x-icon','.woff2':'font/woff2',
};

const server = createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  const fp = join(DIST, p === '/' ? '/index.html' : p);
  const e = extname(fp);
  try {
    if (existsSync(fp) && !existsSync(fp)) {
      // never happens, just for safety
    }
    const c = readFileSync(fp);
    res.writeHead(200, {'Content-Type': MIME[e] || 'application/octet-stream'});
    res.end(c);
  } catch {
    const fb = readFileSync(join(DIST, 'index.html'));
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end(fb);
  }
});

server.listen(PORT);
await new Promise(r => server.once('listening', r));

const browser = await chromium.launch({args:['--no-sandbox']});
const page = await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:2});

// Use setContent with baseURL pointing to our server
const html = readFileSync(join(DIST, 'zh', 'index.html'), 'utf-8');

try {
  // Block JS to prevent navigation loops
  await page.route('**/*.js', r => r.abort());
  await page.route('**/*.ts', r => r.abort());

  await page.setContent(html, {waitUntil:'load',timeout:15000,baseUrl:`http://localhost:${PORT}/`});
  await page.waitForTimeout(2000);
  console.log('URL:', page.url());
  await page.screenshot({path:PREVIEW_OUT,timeout:15000,fullPage:false});
  console.log('OK:', PREVIEW_OUT);
} finally {
  await browser.close();
  server.close();
}
