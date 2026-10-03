import test from 'node:test';
import assert from 'node:assert/strict';
import { handleCheckout, validateItems, buildSession, onRequest, onRequestPost } from '../functions/api/checkout.js';
import { toPayload, startCheckout, paymentLinkFor, CheckoutError, ONE_AT_A_TIME } from '../lib/checkout.js';

const ORIGIN = 'https://shop.example.com';
const req = (body, raw) => new Request(`${ORIGIN}/api/checkout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: raw ?? JSON.stringify(body),
});
const stripeOk = () => {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ id: 'cs_test_1', url: 'https://checkout.stripe.com/c/pay/cs_test_1' }), { status: 200 });
  };
  fn.calls = calls;
  return fn;
};
const env = { STRIPE_SECRET_KEY: 'sk_test_dummy' };

test('missing STRIPE_SECRET_KEY returns a clear 500 JSON error', async () => {
  const res = await handleCheckout(req({ items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1 }] }), {}, stripeOk());
  assert.equal(res.status, 500);
  const body = await res.json();
  assert.equal(body.code, 'missing_stripe_key');
  assert.match(body.error, /STRIPE_SECRET_KEY/);
});

test('responses are JSON and are not marked noindex', async () => {
  const res = await handleCheckout(req({ items: [] }), env, stripeOk());
  assert.equal(res.headers.get('x-robots-tag'), null);
  assert.match(res.headers.get('content-type'), /application\/json/);
});

test('builds a multi-product session from catalog prices only', async () => {
  const f = stripeOk();
  const res = await handleCheckout(req({ items: [
    { slug: 'bamboo-sheet-set', option: 'Queen', qty: 2, price: 1 },
    { slug: 'bamboo-pillowcases', option: 'Standard', qty: 1, unit_amount: 1 },
  ] }), env, f);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { url: 'https://checkout.stripe.com/c/pay/cs_test_1' });
  assert.equal(f.calls.length, 1);
  const { url, init } = f.calls[0];
  assert.equal(url, 'https://api.stripe.com/v1/checkout/sessions');
  assert.equal(init.method, 'POST');
  assert.equal(init.headers.Authorization, 'Bearer sk_test_dummy');
  const p = new URLSearchParams(init.body);
  assert.equal(p.get('mode'), 'payment');
  assert.equal(p.get('success_url'), `${ORIGIN}/success/?session_id={CHECKOUT_SESSION_ID}`);
  assert.equal(p.get('cancel_url'), `${ORIGIN}/cart/`);
  assert.equal(p.get('line_items[0][quantity]'), '2');
  assert.equal(p.get('line_items[0][price_data][currency]'), 'usd');
  assert.equal(p.get('line_items[0][price_data][unit_amount]'), '10900');
  assert.equal(p.get('line_items[0][price_data][product_data][name]'), 'Bamboo sheet set (Queen)');
  assert.equal(p.get('line_items[0][price_data][product_data][metadata][slug]'), 'bamboo-sheet-set');
  assert.equal(p.get('line_items[0][price_data][product_data][metadata][option]'), 'Queen');
  assert.equal(p.get('line_items[1][price_data][unit_amount]'), '3400');
  assert.equal(p.get('metadata[cart]'), 'bamboo-sheet-set:Queen:2,bamboo-pillowcases:Standard:1');
  assert.equal(p.get('shipping_address_collection[allowed_countries][0]'), null);
});

test('COLLECT_SHIPPING_US=true adds US shipping collection', async () => {
  const f = stripeOk();
  await handleCheckout(req({ items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1 }] }), { ...env, COLLECT_SHIPPING_US: 'true' }, f);
  assert.equal(new URLSearchParams(f.calls[0].init.body).get('shipping_address_collection[allowed_countries][0]'), 'US');
});

test('validation rejects bad carts with 400 and never calls Stripe', async () => {
  const bad = [
    {},
    { items: [] },
    { items: 'x' },
    { items: [{ slug: 'nope', option: 'x', qty: 1 }] },
    { items: [{ slug: 'bamboo-sheet-set', option: 'Gold', qty: 1 }] },
    { items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 0 }] },
    { items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 11 }] },
    { items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1.5 }] },
    { items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: '2' }] },
    { items: [null] },
    { items: Array.from({ length: 21 }, () => ({ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1 })) },
    { items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 6 }, { slug: 'bamboo-sheet-set', option: 'Queen', qty: 6 }] },
  ];
  for (const b of bad) {
    const f = stripeOk();
    const res = await handleCheckout(req(b), env, f);
    assert.equal(res.status, 400, JSON.stringify(b).slice(0, 80));
    assert.ok((await res.json()).error);
    assert.equal(f.calls.length, 0);
  }
  const res = await handleCheckout(req(null, 'not json'), env, stripeOk());
  assert.equal(res.status, 400);
});

test('duplicate lines merge', () => {
  const r = validateItems([{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 2 }, { slug: 'bamboo-sheet-set', option: 'Queen', qty: 3 }]);
  assert.equal(r.lines.length, 1);
  assert.equal(r.lines[0].qty, 5);
});

test('Stripe errors return 502 JSON without leaking the key', async () => {
  const fail = async () => new Response(JSON.stringify({ error: { message: 'Invalid API Key provided: sk_test_dummy' } }), { status: 401 });
  const res = await handleCheckout(req({ items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1 }] }), env, fail);
  assert.equal(res.status, 502);
  const text = await res.text();
  assert.ok(!text.includes('sk_test_dummy'));
  const down = async () => { throw new Error('network'); };
  const res2 = await handleCheckout(req({ items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1 }] }), env, down);
  assert.equal(res2.status, 502);
});

test('non-POST methods get 405', async () => {
  const res = await onRequest({ request: new Request(`${ORIGIN}/api/checkout`) });
  assert.equal(res.status, 405);
  assert.equal(typeof onRequestPost, 'function');
});

test('buildSession encodes brackets as form data', () => {
  const { lines } = validateItems([{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1 }]);
  assert.match(buildSession(lines, ORIGIN).toString(), /line_items%5B0%5D%5Bquantity%5D=1/);
});

test('client helper sends only slug/option/qty and returns the url', async () => {
  const payload = toPayload([{ key: 'k', slug: 'bamboo-sheet-set', name: 'x', option: 'Queen', qty: 2, price: 1 }]);
  assert.deepEqual(payload, { items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 2 }] });
  const ok = async () => new Response(JSON.stringify({ url: 'https://checkout.stripe.com/x' }), { status: 200 });
  assert.equal(await startCheckout([{ slug: 'a', option: 'b', qty: 1 }], ok), 'https://checkout.stripe.com/x');
  const bad = async () => new Response(JSON.stringify({ error: 'Cart is empty.' }), { status: 400 });
  await assert.rejects(startCheckout([], bad), /Cart is empty/);
});

test('missing server key surfaces the friendly one-at-a-time message, never the internal error', async () => {
  const missing = async () => new Response(JSON.stringify({ error: 'Checkout is not configured: STRIPE_SECRET_KEY is missing.', code: 'missing_stripe_key' }), { status: 500 });
  const items = [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1 }, { slug: 'bamboo-pillow', option: 'Standard', qty: 1 }];
  await assert.rejects(startCheckout(items, missing), (e) => e instanceof CheckoutError && e.code === 'one_at_a_time' && e.message === ONE_AT_A_TIME && !/STRIPE_SECRET_KEY/.test(e.message));
  assert.match(ONE_AT_A_TIME, /one product at a time/);
});

test('per-line payment links: each product line has its own link; multi-line bags have none', () => {
  const a = { slug: 'bamboo-sheet-set', option: 'Queen', qty: 2 };
  const b = { slug: 'bamboo-pillow', option: 'King', qty: 1 };
  const la = new URL(paymentLinkFor([a]));
  const lb = new URL(paymentLinkFor([b]));
  assert.equal(la.origin, 'https://buy.stripe.com');
  assert.notEqual(la.pathname, lb.pathname);
  assert.equal(la.searchParams.get('client_reference_id'), 'bamboo-sheet-set-Queen-2');
  assert.equal(paymentLinkFor([a, b]), null);
  assert.equal(paymentLinkFor([]), null);
});

test('single-line bag never calls the API (goes straight to the payment link)', async () => {
  let called = false;
  const spy = async () => { called = true; return new Response('{}'); };
  const url = await startCheckout([{ slug: 'bamboo-pillow', option: 'Standard', qty: 1 }], spy);
  assert.match(url, /^https:\/\/buy\.stripe\.com\//);
  assert.equal(called, false);
});

test('order note: client sends trimmed note; server stores it in metadata and strips control chars', async () => {
  assert.deepEqual(toPayload([{ slug: 'a', option: 'b', qty: 1 }], '  hello  ').note, 'hello');
  assert.equal('note' in toPayload([{ slug: 'a', option: 'b', qty: 1 }], '   '), false);
  const f = stripeOk();
  await handleCheckout(req({ items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1 }, { slug: 'bamboo-pillow', option: 'Standard', qty: 1 }], note: 'Gift\nfor Sam' }), env, f);
  assert.equal(new URLSearchParams(f.calls[0].init.body).get('metadata[note]'), 'Gift for Sam');
  const g = stripeOk();
  await handleCheckout(req({ items: [{ slug: 'bamboo-sheet-set', option: 'Queen', qty: 1 }], note: 42 }), env, g);
  assert.equal(new URLSearchParams(g.calls[0].init.body).get('metadata[note]'), null);
});
