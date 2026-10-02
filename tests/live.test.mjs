import test from 'node:test';
import assert from 'node:assert/strict';

// Live smoke tests. They only run when SITE_URL is set, e.g.
//   SITE_URL=https://bedprints.pages.dev npm test
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
  assert.doesNotMatch(home.robots, /noindex/);
});

test('product, shop, bag, and success pages respond', opts, async () => {
  for (const path of ['/products/', '/products/bamboo-sheet-set/', '/cart/', '/success/']) {
    const res = await page(path);
    assert.equal(res.status, 200, path);
  }
});

test('robots.txt allows crawling', opts, async () => {
  const res = await page('/robots.txt');
  assert.equal(res.status, 200);
  assert.match(res.html, /Allow: \//);
});
