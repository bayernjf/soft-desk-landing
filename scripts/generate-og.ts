/**
 * Build script: Generate OG images for feature pages as SVG.
 * Lightweight approach — no font files or heavy dependencies needed.
 * Run: npx tsx scripts/generate-og.ts
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'og');

// Import features using dynamic import for TS support
async function main() {
  const { features } = await import('../src/data/features.ts');
  console.log('🖼  Generating OG images...\n');
  mkdirSync(OUT_DIR, { recursive: true });

  for (const feature of features) {
    for (const lang of ['zh', 'en'] as const) {
      const title = feature.title[lang];
      const tagline = feature.tagline[lang];
      const color = feature.color;
      const fileName = `${feature.slug}-${lang}.svg`;
      const outputPath = join(OUT_DIR, fileName);

      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0d1117"/>
  <!-- Accent bar -->
  <rect x="80" y="80" width="48" height="48" rx="12" fill="${color}"/>
  <!-- Brand -->
  <text x="144" y="114" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#8b949e">SoftDesk</text>
  <!-- Title -->
  <text x="80" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="bold" fill="#ffffff">${escapeXml(title)}</text>
  <!-- Tagline -->
  <text x="80" y="310" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#8b949e">${escapeXml(tagline)}</text>
  <!-- Bottom accent dot -->
  <circle cx="86" cy="570" r="6" fill="${color}"/>
  <!-- URL -->
  <text x="104" y="577" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#58a6ff">soft-desk.pages.dev</text>
</svg>`;

      writeFileSync(outputPath, svg, 'utf-8');
      console.log(`  ✅ ${fileName}`);
    }
  }

  console.log('\n✅ OG images generated successfully!');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

main().catch((err) => {
  console.error('❌ OG image generation failed:', err);
  process.exit(1);
});
