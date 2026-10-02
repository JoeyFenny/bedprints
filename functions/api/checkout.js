// Cloudflare Pages Function: POST /api/checkout
// Builds a Stripe Checkout Session from the server-side catalog (lib/store.js).
// Client prices are NEVER trusted: the browser only sends {slug, option, qty}.
import { products } from '../../lib/store.js';

export const MAX_LINES = 20;
export const MAX_QTY = 10;
const STRIPE_URL = 'https://api.stripe.com/v1/checkout/sessions';

// _headers in /public does not apply to Function responses, so repeat the security headers here.
// No X-Robots-Tag: the store is public and indexable (API responses are JSON and never indexed anyway).
const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...HEADERS, ...extra } });
}

// Returns { lines } or { error }. Pure function, unit tested.
export function validateItems(items, catalog = products) {
  if (!Array.isArray(items) || items.length === 0) return { error: 'Cart is empty.' };
  if (items.length > MAX_LINES) return { error: `Too many lines (max ${MAX_LINES}).` };
  const merged = new Map();
  for (const raw of items) {
    if (!raw || typeof raw !== 'object') return { error: 'Invalid cart item.' };
    const product = catalog.find((p) => p.slug === raw.slug);
    if (!product) return { error: `Unknown product: ${String(raw.slug).slice(0, 60)}` };
    const option = raw.option == null || raw.option === '' ? product.options[0] : raw.option;
    if (!product.options.includes(option)) return { error: `Unknown option for ${product.slug}.` };
    const qty = raw.qty;
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return { error: `Quantity must be a whole number from 1 to ${MAX_QTY}.` };
    const key = `${product.slug}:${option}`;
    const hit = merged.get(key);
    if (hit) hit.qty += qty;
    else merged.set(key, { product, option, qty });
  }
  const lines = [...merged.values()];
  if (lines.some((l) => l.qty > MAX_QTY)) return { error: `Quantity must be a whole number from 1 to ${MAX_QTY}.` };
  return { lines };
}

// Builds the form-encoded body for Stripe. Pure function, unit tested.
export function buildSession(lines, origin, env = {}) {
  const p = new URLSearchParams();
  p.set('mode', 'payment');
  p.set('success_url', `${origin}/success/?session_id={CHECKOUT_SESSION_ID}`);
  p.set('cancel_url', `${origin}/cart/`);
  lines.forEach((l, i) => {
    const k = `line_items[${i}]`;
    p.set(`${k}[quantity]`, String(l.qty));
    p.set(`${k}[price_data][currency]`, 'usd');
    p.set(`${k}[price_data][unit_amount]`, String(l.product.price));
    p.set(`${k}[price_data][product_data][name]`, l.option && l.product.options.length > 1 ? `${l.product.name} (${l.option})` : l.product.name);
    p.set(`${k}[price_data][product_data][metadata][slug]`, l.product.slug);
    p.set(`${k}[price_data][product_data][metadata][option]`, l.option);
  });
  // Stripe metadata values max 500 chars; keep the cart summary short.
  p.set('metadata[cart]', lines.map((l) => `${l.product.slug}:${l.option}:${l.qty}`).join(',').slice(0, 500));
  p.set('metadata[source]', 'bedprints');
  if (String(env.COLLECT_SHIPPING_US || '').toLowerCase() === 'true' || env.COLLECT_SHIPPING_US === '1') {
    p.set('shipping_address_collection[allowed_countries][0]', 'US');
  }
  return p;
}

export async function handleCheckout(request, env = {}, fetchImpl = fetch) {
  const key = env.STRIPE_SECRET_KEY;
  if (!key) {
    return json({ error: 'Checkout is not configured: STRIPE_SECRET_KEY is missing. Set it in Cloudflare Pages > Settings > Variables and Secrets (Production and Preview), then redeploy.', code: 'missing_stripe_key' }, 500);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Request body must be JSON.' }, 400); }
  const result = validateItems(body && body.items);
  if (result.error) return json({ error: result.error }, 400);

  const origin = new URL(request.url).origin;
  let res;
  try {
    res = await fetchImpl(STRIPE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: buildSession(result.lines, origin, env).toString(),
    });
  } catch {
    return json({ error: 'Could not reach Stripe. Try again.' }, 502);
  }
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON response */ }
  if (!res.ok || !data || !data.url) {
    // Log only Stripe's message, never the key or request headers.
    console.error('Stripe error', res.status, data && data.error && data.error.message);
    return json({ error: 'Stripe could not create the checkout session.' }, 502);
  }
  return json({ url: data.url });
}

export async function onRequestPost({ request, env }) {
  return handleCheckout(request, env);
}

// Any other method (GET, etc.)
export async function onRequest() {
  return json({ error: 'Method not allowed. Use POST.' }, 405, { Allow: 'POST' });
}
