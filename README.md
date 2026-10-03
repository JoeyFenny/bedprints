# BedPrince

Bamboo bedding that sleeps cool. This store (concept brand: Bed Prince) was created from the [ecom-template](https://github.com/JoeyFenny/ecom-template) starter.

A small storefront: **Next.js 15 static export** on **Cloudflare Pages**, with one **Pages Function** that creates **Stripe Checkout Sessions**. Public and indexable (set up the Cloudflare Pages project / domain, then add the URL here).

AI agents: read [AGENTS.md](./AGENTS.md) first.

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
| `stripePaymentLink` | legacy, unused by checkout. Leave it |

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
npm test      # catalog tests, Function unit tests (mocked fetch), and live-site smoke tests
npm run build # must produce out/
```

`tests/live.test.mjs` hits the deployed site and is skipped unless `SITE_URL` is set (e.g. `SITE_URL=https://bedprints.pages.dev npm test`). No test calls Stripe.

## Deploy

Push to `main`. Cloudflare Pages builds automatically:

- Framework preset: Next.js (static export). Build command `npm run build`. Output directory `out`.
- No deploy command; do not use OpenNext or a Worker.

Known issue: stale **Queued** deployments can block new builds. In the dashboard (Deployments) cancel the old queued ones.

Verify: `curl -i -X POST https://<your-site>/api/checkout -H 'content-type: application/json' -d '{"items":[]}'` → 400 (or 500 `missing_stripe_key` if the secret isn't set).

## Customization checklist

- [ ] Store name, tagline, announcement in `lib/store.js`; page `<title>` in `app/layout.js`
- [ ] Products in `lib/store.js` (prices in cents)
- [ ] Success page copy: `app/success/page.js` (it must keep calling `clearCart()`)
- [ ] `STRIPE_SECRET_KEY` set for Production and Preview
- [ ] Custom domain: Pages → Custom domains (the Function derives URLs from the request origin, nothing to change in code)
- [x] Public/indexable: noindex has been removed everywhere (`public/_headers`, `public/robots.txt`, `app/layout.js`, `functions/api/checkout.js`). `/cart/` is `noindex` on purpose (thin page).
- [ ] Optional SEO: add a `Sitemap:` line to `public/robots.txt` once the final domain is known
- [ ] Test a purchase in test mode, then a real one in live mode

## Legacy

`scripts/legacy-create-stripe-links.mjs` (`npm run stripe:links:legacy`) created per-product Payment Links. It is not used any more.

## Images

Product photos live in `public/images/` and were AI-generated. Prompts are in [docs/IMAGE_PROMPTS.md](./docs/IMAGE_PROMPTS.md); regenerate better ones any time and overwrite the files (keep names, ~1200px square, under 300KB).


## TODO (post-MVP): real multi-product checkout
BedPrince currently runs in MVP mode: each product has a live Stripe Payment Link in `lib/store.js`, and a bag with ONE product line goes straight to it. A bag with several different products calls `/api/checkout`, which needs the `STRIPE_SECRET_KEY` secret.
To finish: (1) in Stripe create a restricted key with only *Checkout Sessions: Write*; (2) in Cloudflare Pages project `bedprints` > Settings > Variables and Secrets add secret `STRIPE_SECRET_KEY`; (3) retry the deployment; (4) remove `paymentLinkFor()` in `lib/checkout.js` so every checkout uses one Checkout Session; (5) optionally archive the per-product Payment Links in Stripe.
