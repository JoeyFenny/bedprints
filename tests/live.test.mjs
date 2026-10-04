import test from 'node:test';
import assert from 'node:assert/strict';

// Live smoke tests. They only run when SITE_URL is set, e.g.
//   SITE_URL=https://bedprince.pages.dev npm test
const origin = process.env.SITE_URL;
const opts = { skip: origin ? false : 'set SITE_URL to run live smoke tests' };

async function page(path) {
  const res = await fetch(origin + path);
  const html = await res.text();
  return { status: res.status, html, robots: res.headers.get('x-robots-tag') || '' };
}

test('home is the BedPrince store and is indexable', opts, async () => {
  const home = await page('/');
  assert.equal(home.status, 200);
  assert.match(home.html, /BedPrince/);
  assert.match(home.html, /Bamboo sheet set/);
  assert.match(home.html, /_next\/static/);
  assert.match(home.html, /Free US shipping/);
  assert.doesNotMatch(home.robots, /noindex/);
});

test('product, shop, bag, and success pages respond', opts, async () => {
  for (const path of ['/shop/', '/products/bamboo-sheet-set/', '/collections/sheets/', '/faq/', '/about/', '/cart/', '/success/']) {
    const res = await page(path);
    assert.equal(res.status, 200, path);
  }
});

test('robots.txt allows crawling', opts, async () => {
  const res = await page('/robots.txt');
  assert.equal(res.status, 200);
  assert.match(res.html, /Allow: \//);
});

test('sitemap.xml and 404 behave', opts, async () => {
  const sm = await page('/sitemap.xml');
  assert.equal(sm.status, 200);
  assert.match(sm.html, /<loc>https:\/\/bedprints\.pages\.dev\/products\/bamboo-sheet-set\/<\/loc>/);
  assert.equal((await page('/definitely-not-a-page/')).status, 404);
});

test('product page has JSON-LD and canonical', opts, async () => {
  const p = await page('/products/bamboo-sheet-set/');
  assert.match(p.html, /"@type":"Product"/);
  assert.match(p.html, /rel="canonical" href="https:\/\/bedprints\.pages\.dev\/products\/bamboo-sheet-set\/"/);
});
