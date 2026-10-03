// Client-side helper. Sends only {slug, option, qty}; the server (functions/api/checkout.js)
// looks up prices in lib/store.js. Never send or trust prices from the browser.
export function toPayload(items) {
  return { items: items.map((i) => ({ slug: i.slug, option: i.option, qty: i.qty })) };
}

import { findProduct } from './store.js';

// MVP mode: a single product line goes straight to that product's Stripe Payment Link
// (works with no server key). Multi-product bags use /api/checkout (needs STRIPE_SECRET_KEY).
// TODO(post-MVP): set STRIPE_SECRET_KEY in Cloudflare Pages, then delete paymentLinkFor() so every
// checkout uses Checkout Sessions (see README "TODO").
export function paymentLinkFor(items) {
  if (items.length !== 1) return null;
  const [i] = items;
  const p = findProduct(i.slug);
  if (!p || !p.stripePaymentLink) return null;
  const url = new URL(p.stripePaymentLink);
  url.searchParams.set('client_reference_id', `${i.slug}-${String(i.option).replace(/[^a-zA-Z0-9]/g, '')}-${i.qty}`);
  return url.toString();
}

export async function startCheckout(items, fetchImpl = fetch) {
  const link = paymentLinkFor(items);
  if (link) return link;
  let res;
  try {
    res = await fetchImpl('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toPayload(items)),
    });
  } catch {
    throw new Error('Could not reach checkout. Check your connection and try again.');
  }
  let data = {};
  try { data = await res.json(); } catch { /* not JSON */ }
  if (!res.ok || !data.url) throw new Error(data.error || 'Checkout is unavailable right now.');
  return data.url;
}

export async function redirectToCheckout(items) {
  window.location.assign(await startCheckout(items));
}
