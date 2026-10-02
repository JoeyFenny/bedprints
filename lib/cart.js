const KEY = 'bedprince-cart';

export function readCart() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function writeCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart'));
}

export function addItem(product, option, qty = 1) {
  const items = readCart();
  const key = `${product.slug}:${option}`;
  const hit = items.find((i) => i.key === key);
  if (hit) hit.qty += qty;
  else items.push({ key, slug: product.slug, name: product.name, option, qty, price: product.price, image: product.images[0] });
  writeCart(items);
}

export function setQty(key, qty) {
  writeCart(readCart().map((i) => (i.key === key ? { ...i, qty } : i)).filter((i) => i.qty > 0));
}

export function clearCart() {
  writeCart([]);
}
