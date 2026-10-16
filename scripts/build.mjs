import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { menuFromCSV, validateSheetURL } from './menu.mjs';

let items = [];
const configured = Boolean(process.env.MENU_CSV_URL);
if (configured) {
  const url = validateSheetURL(process.env.MENU_CSV_URL);
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Google Sheets returned ${response.status}`);
  const csv = await response.text();
  if (csv.length > 1000000) throw new Error('Menu CSV exceeds 1 MB');
  items = menuFromCSV(csv);
}
const html = await readFile('index.html', 'utf8');
await rm('dist', { recursive: true, force: true });
await mkdir('dist/data', { recursive: true });
for (const file of ['styles.css', 'app.js']) await cp(file, `dist/${file}`);
await cp('assets', 'dist/assets', { recursive: true });
await writeFile('dist/index.html', html);
await writeFile('dist/.nojekyll', '');
await writeFile('dist/data/menu.json', JSON.stringify({ configured, updatedAt: new Date().toISOString(), items }, null, 2));
console.log(`Built site with ${items.length} available menu items. Sheets ${configured ? 'connected' : 'not configured; showing contact message'}.`);
