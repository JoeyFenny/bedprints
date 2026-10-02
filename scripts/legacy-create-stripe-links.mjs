#!/usr/bin/env node
// LEGACY: not used by the site. Checkout now uses functions/api/checkout.js (Stripe Checkout Sessions).
// Only kept for reference if you ever want standalone per-product Payment Links.
import { products } from '../lib/store.js';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error('Set STRIPE_SECRET_KEY. This script never runs in the browser.');
  process.exit(1);
}

async function stripe(path, body) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || res.statusText);
  return json;
}

for (const p of products) {
  const product = await stripe('products', {
    name: p.name,
    description: p.blurb,
    'metadata[slug]': p.slug,
    'metadata[template]': 'ecom-template',
  });
  const price = await stripe('prices', {
    product: product.id,
    unit_amount: String(p.price),
    currency: 'usd',
  });
  const link = await stripe('payment_links', {
    'line_items[0][price]': price.id,
    'line_items[0][quantity]': '1',
    'line_items[0][adjustable_quantity][enabled]': 'true',
    'line_items[0][adjustable_quantity][minimum]': '1',
    'line_items[0][adjustable_quantity][maximum]': '10',
    'metadata[slug]': p.slug,
    'after_completion[type]': 'redirect',
    'after_completion[redirect][url]': 'https://ecom-template.pages.dev/success',
  });
  console.log(`${p.slug}\t${link.url}`);
}
