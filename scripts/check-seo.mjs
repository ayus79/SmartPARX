// Audits built pages for search-snippet problems. Run after `npm run build`:
//   npm run check:seo
// Fails (exit 1) on missing, over-length or duplicate titles/descriptions.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TITLE = { min: 30, max: 60 };
const DESC = { min: 120, max: 160 };

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const pages = walk('dist')
  .map((file) => ({ file, html: readFileSync(file, 'utf8') }))
  // Skip redirect stubs and the 404 page; neither appears in search results.
  .filter(({ file, html }) => !html.includes('http-equiv="refresh"') && !file.endsWith('404.html'))
  .map(({ file, html }) => ({
    path: file.replace(/^dist/, '').replace(/index\.html$/, '') || '/',
    title: decode(html.match(/<title>(.*?)<\/title>/)?.[1] ?? ''),
    desc: decode(html.match(/<meta name="description" content="(.*?)"/)?.[1] ?? ''),
  }));

const problems = [];
const seen = { title: new Map(), desc: new Map() };
for (const p of pages) {
  if (p.title.length < TITLE.min || p.title.length > TITLE.max) problems.push(`${p.path} title is ${p.title.length} chars (${TITLE.min}–${TITLE.max}): ${p.title}`);
  if (p.desc.length < DESC.min || p.desc.length > DESC.max) problems.push(`${p.path} description is ${p.desc.length} chars (${DESC.min}–${DESC.max})`);
  for (const key of ['title', 'desc']) {
    const other = seen[key].get(p[key]);
    if (other) problems.push(`${p.path} has the same ${key} as ${other}`);
    seen[key].set(p[key], p.path);
  }
}

console.log(`Checked ${pages.length} pages.`);
if (problems.length) {
  console.error(problems.map((m) => `  ✗ ${m}`).join('\n'));
  process.exit(1);
}
console.log('  ✓ Every page has a unique title (30–60 chars) and description (120–160 chars).');
