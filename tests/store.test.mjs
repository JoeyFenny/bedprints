import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { store, products, categories, money, findProduct, productsIn, savePercent, smallImage, absoluteUrl } from '../lib/store.js';

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
      assert.ok(fs.existsSync(new URL(`../public${smallImage(img)}`, import.meta.url)), `missing small image for ${img}`);
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
  for (const f of ['public/_headers', 'functions/api/checkout.js', 'app/layout.js', 'app/page.js', 'app/shop/page.js', 'app/products/[slug]/page.js', 'app/collections/[category]/page.js', 'app/faq/page.js']) {
    assert.doesNotMatch(read(f), /noindex|X-Robots-Tag: *noindex|index: false/i, f);
  }
});

test('every product has categories, highlights, size guide kind and valid cross-sells', () => {
  const slugs = new Set(products.map((p) => p.slug));
  const cats = new Set(categories.map((c) => c.slug));
  for (const p of products) {
    assert.ok(p.categories.length && p.categories.every((c) => cats.has(c)), p.slug);
    assert.ok(p.highlights.length >= 3, p.slug);
    assert.ok(['sheets', 'duvet', 'pillow', 'none'].includes(p.sizeGuide), p.slug);
    assert.ok(p.pairsWith.length && p.pairsWith.every((s) => slugs.has(s) && s !== p.slug), p.slug);
    assert.match(p.stripePaymentLink, /^https:\/\/buy\.stripe\.com\//);
  }
  for (const c of categories) assert.ok(productsIn(c.slug).length >= 1, c.slug);
  assert.equal(productsIn('').length, products.length);
});

test('helpers: save percent, small image, absolute url', () => {
  assert.equal(savePercent(findProduct('bamboo-sheet-set')), 22);
  assert.equal(savePercent(findProduct('bamboo-pillow')), 0);
  assert.equal(smallImage('/images/a.jpg'), '/images/a-sm.jpg');
  assert.equal(smallImage('https://x.test/a.jpg'), 'https://x.test/a.jpg');
  assert.equal(absoluteUrl('/shop/'), 'https://bedprints.pages.dev/shop/');
});

test('site content does not invent certifications or fake named reviews', async () => {
  const { faqs, sampleReviews, comparison, benefits } = await import('../lib/content.js');
  const text = JSON.stringify([faqs, sampleReviews, comparison, benefits, products]);
  assert.doesNotMatch(text, /OEKO|GOTS|FSC|certified by|award-winning|★/i);
  assert.ok(sampleReviews.every((r) => !('name' in r) && !('rating' in r)));
});

test('SEO: sitemap lists every page, robots.txt points to it', async () => {
  const sitemap = (await import('../app/sitemap.js')).default();
  const urls = sitemap.map((s) => s.url);
  for (const p of products) assert.ok(urls.includes(`https://bedprints.pages.dev/products/${p.slug}/`), p.slug);
  for (const c of categories) assert.ok(urls.includes(`https://bedprints.pages.dev/collections/${c.slug}/`), c.slug);
  for (const path of ['/', '/shop/', '/about/', '/faq/', '/shipping-returns/', '/size-guide/', '/contact/', '/privacy/', '/terms/']) assert.ok(urls.includes(`https://bedprints.pages.dev${path}`), path);
  assert.ok(!urls.some((u) => /cart|success/.test(u)));
  assert.match(fs.readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8'), /^Sitemap: https:\/\/bedprints\.pages\.dev\/sitemap\.xml$/m);
});

test('SEO helpers build canonical, OG, Twitter and JSON-LD', async () => {
  const { pageMeta, productLd, breadcrumbLd, faqLd, organizationLd } = await import('../lib/seo.js');
  const m = pageMeta({ title: 'Shop', description: 'd', path: '/shop/' });
  assert.equal(m.alternates.canonical, 'https://bedprints.pages.dev/shop/');
  assert.equal(m.openGraph.url, 'https://bedprints.pages.dev/shop/');
  assert.equal(m.twitter.card, 'summary_large_image');
  assert.equal(pageMeta({ title: 'x', description: 'd', path: '/cart/', noindex: true }).robots.index, false);
  const ld = productLd(findProduct('bamboo-sheet-set'));
  assert.equal(ld['@type'], 'Product');
  assert.equal(ld.offers.price, '109.00');
  assert.equal(ld.offers.priceCurrency, 'USD');
  assert.ok(!('aggregateRating' in ld) && !('review' in ld), 'no fake ratings');
  assert.equal(breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop/' }]).itemListElement[1].position, 2);
  assert.equal(faqLd([{ q: 'a', a: 'b' }]).mainEntity[0]['@type'], 'Question');
  assert.ok(organizationLd()['@graph'].some((n) => n['@type'] === 'Organization'));
});

test('placeholders: no invented support email anywhere in app/components', () => {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]));
  const root = new URL('..', import.meta.url).pathname;
  for (const f of [...walk(`${root}app`), ...walk(`${root}components`), `${root}lib/store.js`, `${root}lib/content.js`].filter((f) => /\.(js|css)$/.test(f))) {
    assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /[a-z0-9._-]+@[a-z0-9-]+\.[a-z]{2,}/i, f);
  }
  assert.equal(store.supportEmail, '');
});

test('self-audit: placeholders hidden by default, colour option is labelled, Stripe business name known', () => {
  assert.equal(store.showSampleReviews, false);
  assert.equal(findProduct('bamboo-throw-blanket').optionLabel, 'Color');
  assert.ok(store.legalName);
  const headers = fs.readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
  assert.match(headers, /\/_next\/static\/\*\s+Cache-Control: public, max-age=31536000, immutable/);
});
