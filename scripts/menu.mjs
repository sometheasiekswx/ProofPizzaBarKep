export const columns = ['id', 'name', 'category', 'description', 'price_usd', 'price_khr', 'image_url', 'label', 'available', 'sort_order'];

export function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false, closed = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; closed = true; }
      } else field += c;
    } else if (c === ',' || c === '\n' || c === '\r') {
      row.push(field); field = ''; closed = false;
      if (c !== ',') {
        if (row.some(value => value.trim())) rows.push(row);
        row = [];
        if (c === '\r' && text[i + 1] === '\n') i++;
      }
    } else if (c === '"' && !field && !closed) quoted = true;
    else {
      if (closed || c === '"') throw new Error('Invalid CSV quoting');
      field += c;
    }
  }
  if (quoted) throw new Error('Unclosed CSV quote');
  row.push(field);
  if (row.some(value => value.trim())) rows.push(row);
  return rows;
}

export function menuFromCSV(text) {
  const [headers, ...rows] = parseCSV(text);
  if (!headers || columns.some((name, i) => headers[i]?.trim() !== name) || headers.length !== columns.length) {
    throw new Error(`Menu headers must be: ${columns.join(',')}`);
  }
  const ids = new Set();
  return rows.map((row, index) => {
    const fail = message => { throw new Error(`Menu row ${index + 2}: ${message}`); };
    if (row.length !== columns.length) fail('incorrect number of columns');
    const item = Object.fromEntries(columns.map((key, i) => [key, row[i].trim()]));
    for (const key of ['id', 'name', 'category']) if (!item[key]) fail(`${key} is required`);
    if (ids.has(item.id)) fail('duplicate id');
    ids.add(item.id);
    for (const key of ['price_usd', 'price_khr']) {
      if (!/^\d+(\.\d{1,2})?$/.test(item[key])) fail(`${key} must be a nonnegative number without currency symbols`);
      item[key] = Number(item[key]);
      if (!Number.isFinite(item[key]) || item[key] > 100000000) fail(`${key} is too large`);
    }
    if (!Number.isInteger(item.price_khr)) fail('price_khr must be whole riel');
    if (!['true', 'false'].includes(item.available.toLowerCase())) fail('available must be TRUE or FALSE');
    item.available = item.available.toLowerCase() === 'true';
    if (item.image_url) {
      let url;
      try { url = new URL(item.image_url); } catch { fail('image_url must be an HTTPS URL'); }
      if (url.protocol !== 'https:' || url.username || url.password) fail('image_url must be an HTTPS URL without credentials');
    }
    if (item.sort_order && !/^\d+$/.test(item.sort_order)) fail('sort_order must be a nonnegative integer');
    item.sort_order = Number(item.sort_order || index);
    if (Object.values(item).some(value => typeof value === 'string' && value.length > 2000)) fail('text field exceeds 2000 characters');
    return item;
  }).filter(item => item.available).sort((a, b) => a.sort_order - b.sort_order);
}

export function validateSheetURL(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' || !/^\/spreadsheets\/d\/e\/[^/]+\/pub$/.test(url.pathname) || url.searchParams.get('output') !== 'csv') {
    throw new Error('MENU_CSV_URL must be a Google Sheets Publish to web CSV URL');
  }
  return url;
}
