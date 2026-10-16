import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

test('production build handles unconfigured, valid and failed sheet without replacing good output', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'proof-build-'));
  try {
    for (const file of ['scripts', 'index.html', 'styles.css', 'app.js', 'assets', 'data']) await cp(file, join(directory, file), { recursive: true });
    const run = (source, url = '') => spawnSync(process.execPath, ['--input-type=module', '-e', source], { cwd: directory, env: { ...process.env, MENU_CSV_URL: url }, encoding: 'utf8' });
    const build = "await import('./scripts/build.mjs')";
    assert.equal(run(build).status, 0);
    const output = join(directory, 'dist/data/menu.json');
    const local = JSON.parse(await readFile(output, 'utf8'));
    assert.equal(local.source, 'local-csv');
    assert.equal(local.items.length, 20);
    assert.equal(local.items[0].name, 'Margherita');
    assert.equal(local.items[0].price_khr, 40000);
    assert.equal(local.items.filter(item => item.category === 'Neapolitan pizza').length, 6);
    assert.equal(local.items.filter(item => item.category === 'Cocktails').length, 6);
    assert.ok(local.items.some(item => item.name === 'Funghi'));
    assert.ok(local.items.some(item => item.name === 'Frutti di Mare'));
    const csv = (await readFile(resolve('data/menu-template.csv'), 'utf8')).replaceAll('FALSE', 'TRUE');
    const url = 'https://docs.google.com/spreadsheets/d/e/test/pub?output=csv';
    const result = run(`globalThis.fetch = async () => new Response(${JSON.stringify(csv)}); ${build}`, url);
    assert.equal(result.status, 0, result.stderr);
    const good = await readFile(output, 'utf8');
    assert.equal(JSON.parse(good).items.length, 2);
    assert.equal(JSON.parse(good).configured, true);
    assert.notEqual(run(`globalThis.fetch = async () => new Response('bad csv'); ${build}`, url).status, 0);
    assert.equal(await readFile(output, 'utf8'), good);
    assert.notEqual(run(`globalThis.fetch = async () => new Response('', {status:503}); ${build}`, url).status, 0);
    assert.equal(await readFile(output, 'utf8'), good);
    for (const file of ['index.html', 'app.js', 'styles.css', 'assets/proof-original.png', '.nojekyll']) await readFile(join(directory, 'dist', file));
  } finally { await rm(directory, { recursive: true, force: true }); }
});
