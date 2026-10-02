// Client-side helper. Sends only {slug, option, qty}; the server (functions/api/checkout.js)
// looks up prices in lib/store.js. Never send or trust prices from the browser.
export function toPayload(items) {
  return { items: items.map((i) => ({ slug: i.slug, option: i.option, qty: i.qty })) };
}

export async function startCheckout(items, fetchImpl = fetch) {
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
