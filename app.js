const grid = document.querySelector('.menu-grid');
const filters = document.querySelector('.filters');
const status = document.querySelector('#menu-status');
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const riel = new Intl.NumberFormat('en-US');
let items = [];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function render(category = null) {
  grid.replaceChildren();
  const visible = items.filter(item => category === null || item.category === category);
  for (const item of visible) {
    const card = element('article', item.image_url ? 'dish' : 'dish dish-text');
    const imageBox = element('div', 'dish-image');
    const image = element('img');
    image.src = item.image_url || 'assets/proof-alternative.jpg';
    image.alt = item.image_url ? item.name : 'Proof Pizza Bar';
    image.loading = 'lazy';
    image.addEventListener('error', () => { image.src = 'assets/proof-alternative.jpg'; image.classList.add('logo-placeholder'); }, { once: true });
    if (!item.image_url) image.classList.add('logo-placeholder');
    imageBox.append(image);
    if (item.label) imageBox.append(element('span', 'tag', item.label));
    const heading = element('div', 'dish-heading');
    const price = element('div', 'price', money.format(item.price_usd));
    price.append(element('small', '', `៛${riel.format(item.price_khr)}`));
    heading.append(element('h3', '', item.name), price);
    if (item.image_url) card.append(imageBox);
    card.append(element('div', 'dish-category', item.category), heading, element('p', '', item.description));
    if (!item.image_url && item.label) card.append(element('span', 'dish-label', item.label));
    grid.append(card);
  }
  status.textContent = `${visible.length} ${visible.length === 1 ? 'item' : 'items'}${category ? ` · ${category}` : ''}. Prices in US dollars and Cambodian riel.`;
}

async function loadMenu() {
  filters.replaceChildren();
  status.textContent = 'Loading the menu…';
  try {
    const response = await fetch('data/menu.json', { cache: 'no-cache', signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Menu unavailable');
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error('Invalid menu');
    items = data.items;
    document.querySelector('#menu-draft-note').hidden = data.source !== 'local-csv';
    if (!items.length) {
      status.textContent = 'Our latest menu is available directly from the team. Message us on Instagram for dishes, prices, and availability.';
      return;
    }
    for (const category of [null, ...new Set(items.map(item => item.category))]) {
      const button = element('button', 'filter', category ?? 'All favourites');
      button.type = 'button';
      button.setAttribute('aria-pressed', String(category === null));
      button.addEventListener('click', () => {
        filters.querySelectorAll('button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        render(category);
      });
      filters.append(button);
    }
    render();
  } catch {
    grid.replaceChildren();
    status.textContent = 'The menu could not be loaded. Please try again or message us on Instagram.';
    const retry = element('button', 'filter', 'Try again');
    retry.type = 'button';
    retry.addEventListener('click', loadMenu);
    filters.append(retry);
  }
}
loadMenu();
