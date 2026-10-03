import { findProduct } from './store.js';

const KEY = 'bedprince-cart';
const NOTE_KEY = 'bedprince-cart-note';
const RECENT_KEY = 'bedprince-recent';
export const MAX_QTY = 10;

export function readCart() {
  if (typeof window === 'undefined') return [];
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(items) ? items : [];
  } catch { return []; }
}

export function writeCart(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage full or blocked */ }
  window.dispatchEvent(new Event('cart'));
}

export function addItem(product, option, qty = 1) {
  const items = readCart();
  const key = `${product.slug}:${option}`;
  const hit = items.find((i) => i.key === key);
  if (hit) hit.qty = Math.min(MAX_QTY, hit.qty + qty);
  else items.push({ key, slug: product.slug, name: product.name, option, qty: Math.min(MAX_QTY, qty), price: product.price, image: product.images[0] });
  writeCart(items);
}

export function setQty(key, qty) {
  writeCart(readCart().map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)).filter((i) => i.qty > 0));
}

export function removeItem(key) {
  writeCart(readCart().filter((i) => i.key !== key));
}

export function clearCart() {
  writeCart([]);
  try { localStorage.removeItem(NOTE_KEY); } catch { /* ignore */ }
}

// Display prices always come from the catalog (the stored price can be stale). Checkout never trusts the browser anyway.
export function hydrate(items) {
  return items
    .map((i) => {
      const p = findProduct(i.slug);
      return p ? { ...i, name: p.name, price: p.price, image: p.images[0], product: p } : null;
    })
    .filter(Boolean);
}

export const cartCount = (items) => items.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (items) => items.reduce((n, i) => n + i.price * i.qty, 0);

export function readNote() {
  if (typeof window === 'undefined') return '';
  try { return localStorage.getItem(NOTE_KEY) || ''; } catch { return ''; }
}
export function writeNote(note) {
  try { localStorage.setItem(NOTE_KEY, note); } catch { /* ignore */ }
}

// Drawer open/close is a window event so any component can open it.
export const openCart = () => window.dispatchEvent(new Event('cart:open'));

export function readRecent() {
  if (typeof window === 'undefined') return [];
  try {
    const r = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(r) ? r.filter((s) => typeof s === 'string') : [];
  } catch { return []; }
}
export function pushRecent(slug) {
  const next = [slug, ...readRecent().filter((s) => s !== slug)].slice(0, 8);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
}
