import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { store, products, money, findProduct } from '../lib/store.js';

test('store branding', () => {
  assert.equal(store.name, 'BedPrince');
  assert.equal(store.tagline, 'Bamboo bedding that sleeps cool.');
});

test('catalog has unique slugs, integer cent prices, options, and local images', () => {
  const slugs = products.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(products.length >= 6);
  for (const p of products) {
    assert.ok(p.name);
    assert.ok(Number.isInteger(p.price) && p.price > 0);
    assert.ok(p.compareAt == null || p.compareAt > p.price);
    assert.ok(p.options.length);
    assert.ok(p.images.length);
    for (const img of p.images) {
      assert.match(img, /^\/images\/[a-z0-9-]+\.(jpg|webp)$/);
      assert.ok(fs.existsSync(new URL(`../public${img}`, import.meta.url)), `missing image ${img}`);
    }
    assert.equal(findProduct(p.slug).name, p.name);
  }
});

test('bamboo sheet set is the best seller with four sizes', () => {
  const p = findProduct('bamboo-sheet-set');
  assert.equal(p.badge, 'Best seller');
  assert.deepEqual(p.options, ['Queen', 'King', 'Full', 'Twin']);
  assert.equal(p.price, 10900);
  assert.equal(money(p.price), '$109.00');
});

test('site is indexable: robots.txt allows crawling, no noindex anywhere in config', () => {
  const read = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
  assert.match(read('public/robots.txt'), /^Allow: \/$/m);
  assert.doesNotMatch(read('public/robots.txt'), /^Disallow: \/\s*$/m);
  for (const f of ['public/_headers', 'functions/api/checkout.js', 'app/layout.js', 'app/products/page.js', 'app/products/[slug]/page.js']) {
    assert.doesNotMatch(read(f), /noindex|X-Robots-Tag: *noindex|index: false/i, f);
  }
});
