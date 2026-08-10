// scripts/shot.mjs
// Universal preview-image pipeline for landing projects.
// Boots a static server over ./dist, opens the page in headless Chromium,
// waits for the stylesheet + hero to settle, and writes:
//   dist/preview-zh.png  — Chinese locale first screen
//   dist/preview-en.png  — English locale first screen
// The script auto-detects which language lives at which URL by checking
// the dist directory structure, so the same file works for every project.
import { chromium } from 'playwright';
process.env.PLAYWRIGHT_BROWSERS_PATH = '0';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const PORT = 5173, DIST = './dist';

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

// --- Static file server with Astro-style fallback ----------------------------
// /zh/            -> dist/zh/index.html
// /zh/download/    -> dist/zh/download/index.html
// /                -> dist/index.html
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

// --- Detect locale URLs from dist structure ---------------------------------
// If dist/zh/index.html exists, the Chinese version lives at /zh/.
// If dist/en/index.html exists, the English version lives at /en/.
// Otherwise the locale lives at the root / (monolingual project or
// root-is-zh + en/ subdir pattern).
const hasZhDir = existsSync(join(DIST, 'zh', 'index.html'));
const hasEnDir = existsSync(join(DIST, 'en', 'index.html'));
const zhUrl = hasZhDir ? '/zh/' : '/';
const enUrl = hasEnDir ? '/en/' : '/';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});

async function shoot(url, outPath) {
  // 'load' waits for the stylesheet to be applied. 'domcontentloaded' fires
  // earlier and SVG logos / Tailwind classes are not yet computed, producing
  // an unstyled snapshot.
  await page.goto(`http://localhost:${PORT}${url}`, {
    waitUntil: 'load',
    timeout: 30000,
  });
  // Flat settle window: hero markup + CSS layout + Astro island hydration.
  // A flat delay is more reliable than waitForSelector here because Astro's
  // client islands keep mutating the DOM during hydration, which trips
  // Playwright's actionability checks.
  await page.waitForTimeout(3000);
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(500);

  await page.screenshot({
    path: outPath,
    fullPage: false,
    clip: { x: 0, y: 0, width: 1280, height: 800 },
    animations: 'disabled',
    caret: 'hide',
    timeout: 30000,
  });
  console.log('OK:', outPath, '<-', url);
}

try {
  await shoot(zhUrl, 'dist/preview-zh.png');
  await shoot(enUrl, 'dist/preview-en.png');
} finally {
  await browser.close();
  server.close();
}
