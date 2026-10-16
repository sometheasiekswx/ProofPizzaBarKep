import test from 'node:test';
import assert from 'node:assert/strict';
import { columns, parseCSV, menuFromCSV, validateSheetURL } from '../scripts/menu.mjs';
const header = columns.join(',') + '\n';
const row = 'one,Margherita,Pizza,"Tomato, basil",7.50,30000,,Classic,TRUE,1';
test('CSV supports BOM, CRLF, commas, escaped quotes and multiline fields', () => {
  assert.deepEqual(parseCSV('\uFEFFa,b\r\n"hello, world","a ""quote""\nline"\r\n'), [['a','b'],['hello, world','a "quote"\nline']]);
});
test('normalizes prices and keeps explicit owner riel prices', () => {
  const [item] = menuFromCSV(header + row);
  assert.equal(item.price_usd, 7.5);
  assert.equal(item.price_khr, 30000);
  assert.equal(item.description, 'Tomato, basil');
});
test('hides unavailable items and sorts available ones', () => {
  const items = menuFromCSV(header + row.replace(',1', ',4') + '\n' + row.replace('one,', 'two,').replace('TRUE', 'FALSE') + '\n' + row.replace('one,', 'three,'));
  assert.deepEqual(items.map(i => i.id), ['three','one']);
});
test('accepts a deliberately empty menu', () => assert.deepEqual(menuFromCSV(header), []));
test('rejects malformed and unsafe data', () => {
  for (const csv of [header + row + '\n' + row, 'bad\n' + row, header + row.replace('7.50', '-1'), header + row.replace('30000', '1.5'), header + row.replace('TRUE', 'yes'), header + row.replace(',,Classic', ',javascript:alert(1),Classic'), header + row.replace(',,Classic', ',http://example.com/a.jpg,Classic'), header + row + ',extra', header + row.replace(',1', ',abc')]) {
    assert.throws(() => menuFromCSV(csv));
  }
  assert.throws(() => parseCSV('"unterminated'));
  assert.throws(() => parseCSV('"closed"bad'));
});
test('accepts HTTPS images and preserves text for safe DOM rendering', () => {
  const [item] = menuFromCSV(header + row.replace('Margherita','<b>Pizza</b>').replace(',,Classic', ',https://example.com/pizza.jpg,Classic'));
  assert.equal(item.name, '<b>Pizza</b>');
});
test('only accepts published Google CSV endpoints', () => {
  assert.equal(validateSheetURL('https://docs.google.com/spreadsheets/d/e/example/pub?output=csv').hostname, 'docs.google.com');
  for (const url of ['http://docs.google.com/spreadsheets/d/e/example/pub?output=csv', 'https://evil.example/menu.csv', 'https://docs.google.com/spreadsheets/d/example/edit', 'https://docs.google.com/spreadsheets/d/e/example/pub?output=html']) assert.throws(() => validateSheetURL(url));
});
