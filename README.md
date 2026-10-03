# BedPrince

Bamboo bedding that sleeps cool. This store (concept brand: Bed Prince) was created from the [ecom-template](https://github.com/JoeyFenny/ecom-template) starter.

A small storefront: **Next.js 15 static export** on **Cloudflare Pages**, with one **Pages Function** that creates **Stripe Checkout Sessions**. Public and indexable (set up the Cloudflare Pages project / domain, then add the URL here).

AI agents: read [AGENTS.md](./AGENTS.md) first.

## Site structure

```
app/                    Next.js App Router pages (static export)
  layout.js             announcement bar, header, footer, cart drawer, fonts, Organization JSON-LD
  page.js               home (hero, trust bar, best sellers, categories, why bamboo, FAQ, email)
  shop/                 all products with filter tabs + sort
  collections/[category]/  sheets | pillows | blankets
  products/[slug]/      product page (gallery, buy box, accordion, cross-sell, recently viewed)
  products/             legacy URL, canonical -> /shop/ (+ public/_redirects 301)
  cart/  success/       bag page (noindex) and order confirmation (noindex, clears the bag)
  about/ faq/ shipping-returns/ contact/ privacy/ terms/ size-guide/
  sitemap.js            /sitemap.xml        not-found.js  404
  icon.svg apple-icon.png  favicon         fonts/  self-hosted Inter + Cormorant Garamond (woff2)
  globals.css           the design system (tokens at the top)
components/             Header, CartDrawer, CheckoutPanel, BagLines, ProductCard, ShopGrid, Gallery, BuyBox,
                        ProductDetails, SampleReviews, NewsletterForm, ... and home/ sections
lib/
  store.js              store info, categories, products, helpers
  content.js            FAQ, benefits, comparison table, SAMPLE reviews, size tables
  seo.js                pageMeta(), JSON-LD builders
  cart.js useCart.js    localStorage bag, order note, recently viewed
  checkout.js           payment-link / Checkout Session logic
docs/FEATURE_AUDIT.md   checklist of what top DTC bedding sites have, with final status
```

### Business details that are still placeholders
`lib/store.js` has `supportEmail`, `businessAddress`, `newsletterUrl` (all empty). While empty, the site shows visible yellow `[support email]` / `[business address]` markers and the email forms say signup is not open (nothing is collected). Fill them in and the markers become real mailto links. Policy pages (`app/shipping-returns`, `privacy`, `terms`) are drafts with `<Todo>` markers: search for `Todo` to find every open item. Reviews are labelled **sample** placeholders (`lib/content.js`); replace them with real ones, never invent customers or certifications.

## Architecture

```
 Browser                      Cloudflare Pages                           Stripe
 ───────                      ────────────────                           ──────
 static HTML/JS  <──────────  out/  (next build, output:'export')
 cart in localStorage
 POST /api/checkout ────────> functions/api/checkout.js
   {items:[{slug,option,qty}]}   • validates against lib/store.js
                                 • builds line_items with price_data  ──> POST /v1/checkout/sessions
                                 • uses env STRIPE_SECRET_KEY (secret)  <── {url}
 redirect to {url}  <───────  {url}
 pay on checkout.stripe.com ─────────────────────────────────────────────> payment
 /success/?session_id=...  <── Stripe redirects back; page clears the cart
```

- **Static site**: pages in `app/`, products in `lib/store.js`. No server rendering.
- **Function**: `functions/api/checkout.js` is the only server code. Cloudflare Pages deploys the `functions/` directory automatically alongside `out/`.
- **Stripe**: hosted Checkout. Cards never touch this site. Prices come from the catalog at request time via `price_data`, so there are no Stripe Products/Prices/Payment Links to create or keep in sync.

## Products

Edit `lib/store.js`:

| field | meaning |
| --- | --- |
| `slug` | unique, URL-safe; used in `/products/<slug>/` and in checkout |
| `name`, `blurb`, `description`, `badge` | display text |
| `price` | **integer cents** (USD). `4800` = $48.00. This is what Stripe charges |
| `compareAt` | optional strike-through price in cents (display only) |
| `images` | array of image paths (`/images/xxx.jpg`, files in `public/images/`) or https URLs; first is the main photo |
| `options` | e.g. `['S','M','L']`; the buyer picks one. Must have at least one |
| `categories` | array of `sheets` / `pillows` / `blankets` (drives the filter tabs and collection pages) |
| `highlights`, `materials` | bullets and material line shown in the product accordion |
| `sizeGuide` | `sheets`, `duvet`, `pillow` or `none` (which size table shows) |
| `pairsWith` | slugs shown under "Pairs well with" |
| `bestSeller` | shown in the home "Best sellers" grid |
| `stripePaymentLink` | **used in MVP mode** (single-product checkout and per-line "Buy this item"). Keep it until the TODO below is done |

Each image `/images/x.jpg` also needs a 640px twin `/images/x-sm.jpg` (used by cards, thumbnails, `srcset`); `npm test` checks this.

Change price/options in `lib/store.js` only. The server re-reads them on every checkout, so the browser can't change prices.

## Environment variable

| name | where | notes |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Cloudflare Pages secret | `sk_live_...` (prod) or `sk_test_...` (dev/preview). A restricted key (`rk_...`) with only **Checkout Sessions: Write** is enough and preferred |
| `COLLECT_SHIPPING_US` | optional | `true` to collect a US shipping address |

Never use a `NEXT_PUBLIC_` prefix, never commit keys.

### Set it in Cloudflare

1. Cloudflare dashboard → **Workers & Pages** → project **bedprints** → **Settings** → **Variables and Secrets** (called "Environment variables" in older UI).
2. **Add** → type **Secret**, name `STRIPE_SECRET_KEY`, value = your key. Do it for **Production** (live key) and **Preview** (test key `sk_test_...`).
3. Save, then redeploy (push a commit or Deployments → latest → Retry deployment). Secrets are only picked up by new deployments.

Until it is set, `POST /api/checkout` returns HTTP 500 `{"code":"missing_stripe_key", ...}`.

## Local development

```bash
npm install
npm run dev                      # Next dev server, UI only (/api/checkout does NOT exist here)
```

To exercise checkout locally, run the built site with the Function:

```bash
cp .dev.vars.example .dev.vars   # then put an sk_test_ key in it
npm run build
npx wrangler pages dev out       # http://localhost:8788, serves out/ + functions/
```

Test mode: use card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP. Use an `sk_test_` key; live keys charge real cards.

## Tests

```bash
npm test      # catalog/SEO/content tests, Function + checkout-helper tests (mocked fetch), live-site smoke tests
npm run build # must produce out/
```

`tests/live.test.mjs` hits the deployed site and is skipped unless `SITE_URL` is set (e.g. `SITE_URL=https://bedprints.pages.dev npm test`). No test calls Stripe.

## Deploy

Push to `main`. Cloudflare Pages builds automatically:

- Framework preset: Next.js (static export). Build command `npm run build`. Output directory `out`.
- No deploy command; do not use OpenNext or a Worker.

Known issue: stale **Queued** deployments can block new builds. In the dashboard (Deployments) cancel the old queued ones.

Verify: `curl -i -X POST https://<your-site>/api/checkout -H 'content-type: application/json' -d '{"items":[]}'` → 400 (or 500 `missing_stripe_key` if the secret isn't set).

## Checkout behaviour (MVP mode)

- One product line in the bag: straight to that product's Stripe Payment Link.
- Several different products: the site calls `/api/checkout`. With no `STRIPE_SECRET_KEY` it shows "Please check out one product at a time for now" and reveals a **Buy this item** button on each line (each uses its own payment link; the rest of the bag stays saved).
- Payment Links do not take the buyer's size or quantity from the site; both are sent in `client_reference_id` (e.g. `bamboo-sheet-set-Queen-2`). Make sure each link allows adjustable quantity in Stripe.
- Order notes (cart page) are only sent with real Checkout Sessions (`metadata[note]`).

## Customization checklist

- [ ] Store name, tagline, announcement in `lib/store.js`; default SEO in `app/layout.js`, per-page SEO via `pageMeta()` in `lib/seo.js`
- [ ] Fill in `supportEmail`, `businessAddress` (and optionally `newsletterUrl`) in `lib/store.js`; resolve the `Todo` placeholders on policy pages
- [ ] Replace sample reviews with real ones once they exist
- [ ] Products in `lib/store.js` (prices in cents)
- [ ] Success page copy: `components/SuccessView.js` (it must keep calling `clearCart()`)
- [ ] `STRIPE_SECRET_KEY` set for Production and Preview
- [ ] Custom domain: Pages → Custom domains (the Function derives URLs from the request origin, nothing to change in code)
- [x] Public/indexable: noindex has been removed everywhere (`public/_headers`, `public/robots.txt`, `app/layout.js`, `functions/api/checkout.js`). `/cart/` is `noindex` on purpose (thin page).
- [x] `/sitemap.xml` and the `Sitemap:` line in `public/robots.txt` exist. If you add a custom domain, change `store.url` in `lib/store.js` and the `Sitemap:` line
- [ ] Test a purchase in test mode, then a real one in live mode

## Legacy

`scripts/legacy-create-stripe-links.mjs` (`npm run stripe:links:legacy`) created per-product Payment Links. It is not used any more.

## Images

Product photos live in `public/images/` and were AI-generated. Prompts are in [docs/IMAGE_PROMPTS.md](./docs/IMAGE_PROMPTS.md); regenerate better ones any time and overwrite the files (keep names, ~1200px square, under 300KB).


## TODO (post-MVP): real multi-product checkout
BedPrince currently runs in MVP mode: each product has a live Stripe Payment Link in `lib/store.js`, and a bag with ONE product line goes straight to it. A bag with several different products calls `/api/checkout`, which needs the `STRIPE_SECRET_KEY` secret.
To finish: (1) in Stripe create a restricted key with only *Checkout Sessions: Write*; (2) in Cloudflare Pages project `bedprints` > Settings > Variables and Secrets add secret `STRIPE_SECRET_KEY`; (3) retry the deployment; (4) remove `paymentLinkFor()` in `lib/checkout.js` so every checkout uses one Checkout Session; (5) optionally archive the per-product Payment Links in Stripe.
