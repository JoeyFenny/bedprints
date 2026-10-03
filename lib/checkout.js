// Client-side helper. Sends only {slug, option, qty}; the server (functions/api/checkout.js)
// looks up prices in lib/store.js. Never send or trust prices from the browser.
export function toPayload(items, note = '') {
  const payload = { items: items.map((i) => ({ slug: i.slug, option: i.option, qty: i.qty })) };
  const n = String(note || '').trim().slice(0, 400);
  if (n) payload.note = n;
  return payload;
}

// Thrown when a multi-product bag cannot be checked out yet (no server key): the UI then shows
// per-line "Buy this item" buttons that use each product's own payment link.
export class CheckoutError extends Error {
  constructor(message, code = 'error') {
    super(message);
    this.code = code;
  }
}

export const ONE_AT_A_TIME = 'Please check out one product at a time for now. Use the “Buy this item” button next to each product; the rest of your bag stays saved.';

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

export async function startCheckout(items, fetchImpl = fetch, note = '') {
  const link = paymentLinkFor(items);
  if (link) return link;
  let res;
  try {
    res = await fetchImpl('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toPayload(items, note)),
    });
  } catch {
    throw new CheckoutError('Could not reach checkout. Check your connection and try again.', 'network');
  }
  let data = {};
  try { data = await res.json(); } catch { /* not JSON */ }
  if (res.status === 500 && data.code === 'missing_stripe_key') {
    // Server is not configured for multi-product checkout yet. Never show the internal message.
    throw new CheckoutError(ONE_AT_A_TIME, 'one_at_a_time');
  }
  if (!res.ok || !data.url) throw new CheckoutError(data.error || 'Checkout is unavailable right now. Please try again.');
  return data.url;
}

export async function redirectToCheckout(items, note = '') {
  window.location.assign(await startCheckout(items, fetch, note));
}
