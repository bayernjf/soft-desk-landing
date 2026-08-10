// scripts/shot.mjs
// Boots a tiny static file server over ./dist, opens the page in headless
// Chromium, waits for the stylesheet + hero markup to settle, and writes
// dist/preview.png as the first-screen preview.
import { chromium } from 'playwright';
process.env.PLAYWRIGHT_BROWSERS_PATH = '0';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const PORT = 5173, DIST = './dist', PREVIEW_OUT = 'dist/preview.png';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  const fp = join(DIST, p === '/' ? '/index.html' : p);
  const e = extname(fp);
  try {
    if (!existsSync(fp) || statSync(fp).isDirectory()) throw new Error('not file');
    const c = readFileSync(fp);
    res.writeHead(200, { 'Content-Type': MIME[e] || 'application/octet-stream' });
    res.end(c);
  } catch {
    // Mimic Astro static: /<locale>/ and /<locale>/<page>/ resolve to
    // dist/<locale>/<page>/index.html, /<page>/ to dist/<page>/index.html,
    // and the root to dist/index.html.
    let fb = join(DIST, 'index.html');
    if (p !== '/' && p.endsWith('/')) fb = join(DIST, p, 'index.html');
    else if (p !== '/' && !extname(p)) fb = join(DIST, p, 'index.html');
    const c = readFileSync(fb);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(c);
  }
});

server.listen(PORT);
await new Promise((r) => server.once('listening', r));

const browser = await chromium.launch({ args: ['--no-sandbox'] });
// 1280x800 first-screen at deviceScaleFactor 2 -> 2560x1600 PNG.
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });

try {
  // 'load' waits for the stylesheet to be applied. 'domcontentloaded' fires
  // earlier and the SVG logo would be rendered at its intrinsic 512x512 size
  // because the h-8 w-8 Tailwind class is not yet computed.
  await page.goto(`http://localhost:${PORT}/zh/`, { waitUntil: 'load', timeout: 30000 });

  // Settle window: hero markup + CSS layout + Astro island hydration. A flat
  // delay is more reliable than waitForSelector('h1') here because Astro's
  // client islands keep mutating the DOM during hydration, which trips
  // Playwright's actionability checks.
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(500);

  // Screenshot the first-screen viewport. A fixed clip avoids element-lookup
  // races and keeps the result independent of which section is in view.
  await page.screenshot({
    path: PREVIEW_OUT,
    fullPage: false,
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    animations: 'disabled',
    caret: 'hide',
    timeout: 30000,
  });
  console.log('OK:', PREVIEW_OUT);
} finally {
  await browser.close();
  server.close();
}
