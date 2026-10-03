# AGENTS.md

Rules for AI agents working on this repo. Keep it short, follow it exactly. Full details in README.md.

## What this is
BedPrince: bamboo bedding store. Static Next.js 15 site (`output:'export'`, `trailingSlash:true`) on Cloudflare Pages + one Pages Function (`functions/api/checkout.js`) that creates Stripe Checkout Sessions. No Stripe SDK, no database.

## Files that matter
- `lib/store.js`: store info and **all products** (slug, name, price in integer cents, options, images). Single source of truth for prices.
- `functions/api/checkout.js`: POST `{items:[{slug,option,qty}]}` → validates against `lib/store.js` → Stripe `POST /v1/checkout/sessions` with `price_data` → returns `{url}`.
- `lib/checkout.js`: browser helper that POSTs to `/api/checkout` and redirects.
- `components/CheckoutPanel.js` (bag/drawer checkout + friendly multi-product fallback with per-line "Buy this item"), `components/BuyBox.js` (Add to bag / Buy now), `components/CartDrawer.js`, `components/CartView.js`.
- `lib/cart.js`: cart in localStorage (+ order note, recently viewed). `components/SuccessView.js` clears it on `/success/`.
- `lib/seo.js`: `pageMeta()` (canonical, OG, Twitter) and JSON-LD builders. Use `pageMeta()` on every new page; `lib/content.js` holds FAQ/benefits/sample reviews/size tables.
- `app/globals.css`: the design system. Use its tokens (`--tan-ink` for tan text on white, `--tan` on black); no new CSS framework.
- `docs/FEATURE_AUDIT.md`: per-page checklist and status; update it when you add or drop features.
- `public/_headers`, `public/robots.txt`: site is public and indexable (no noindex). Do not re-add.
- `public/images/`: product photos referenced as `/images/xxx.jpg` from `lib/store.js`; prompts in `docs/IMAGE_PROMPTS.md`.

## Do
- Add/edit a product: edit the `products` array in `lib/store.js` only. `price` is cents. `slug` unique. `options` non-empty. Run `npm test`.
- Checkout flow: cart → `POST /api/checkout` → Stripe URL → pay → `/success/?session_id=...` (cart cleared) or `/cart/` on cancel.
- Secret: `STRIPE_SECRET_KEY` (restricted key with only Checkout Sessions: Write, or a secret key). Set in Cloudflare Pages → Settings → Variables and Secrets as a **Secret**, for **Production** (`sk_live_`/`rk_live_`) and **Preview** (`sk_test_`). Locally: `.dev.vars` (gitignored). Template: `.dev.vars.example`.
- Local dev: `npm run dev` for UI; `npm run build && npx wrangler pages dev out` to include the Function.
- Test purchase (test mode only): card `4242 4242 4242 4242`, any future date/CVC/ZIP.
- Deploy: push to `main`; Cloudflare builds (`npm run build`, output `out`). If builds sit in "Queued", old queued deployments are blocking: cancel them in the dashboard.
- Before committing: `npm test` and `npm run build` must pass.

- New page: add it to `app/sitemap.js` (STATIC list) and give it `pageMeta()` with a trailing-slash `path`. New product image: also add the 640px `-sm.jpg` twin.
- Unknown business details stay as visible `<Todo>` placeholders or empty `store.supportEmail` / `businessAddress` / `newsletterUrl`. Never invent an email, address, certification, customer name, star rating or review. Sample reviews must stay labelled as samples. Exception (self-audit): sample reviews, the newsletter forms and the contact form are now HIDDEN from shoppers unless `store.showSampleReviews`, `store.newsletterUrl` or `store.supportEmail` is set; the other `<Todo>` chips stay visible.

## Don't (gotchas)
- Don't delete or move `functions/`. Without it checkout silently disappears (404).
- Don't trust or send prices from the client. The client sends slug/option/qty only.
- Don't put the secret in `NEXT_PUBLIC_*`, frontend code, commits, logs, tests, or docs. Tests use fake keys and mocked `fetch`.
- Don't remove `trailingSlash:true` or `output:'export'`. Links and Stripe return URLs end in `/` (`/cart/`, `/success/`).
- Don't recreate a Vite `src/` directory: Next treats `src/pages` as the Pages Router and the build breaks.
- Don't switch to OpenNext/Worker/SSR; keep it a static export.
- Don't call the Stripe API with a live key from scripts/tests. Use `sk_test_`.
- `public/_headers` does not apply to Function responses; security headers are set in code in `checkout.js`. Keep them (there is intentionally no `X-Robots-Tag`).
- `stripePaymentLink` in products IS used in MVP mode (single-product checkout and per-line "Buy this item"). Do not remove it until the `STRIPE_SECRET_KEY` TODO in README is done.
- The shop is `/shop/`; `/products/` is only a legacy redirect page. Product URLs stay `/products/<slug>/`.

## Customization checklist
1. Name/tagline/announcement/support email/address: `lib/store.js`; default metadata: `app/layout.js`.
2. Replace products in `lib/store.js`.
3. Edit success page copy in `components/SuccessView.js` (keep `clearCart()`).
4. Set `STRIPE_SECRET_KEY` (Production + Preview), redeploy.
5. Custom domain in Cloudflare Pages (no code change needed).
6. Already public: noindex removed (only `/cart/` keeps `robots: noindex`).

- Images: palette is black/white/bamboo tan, no sage. Pollinations now returns HTTP 402 (needs a key); the current photos were generated with the AI Horde anonymous queue (see docs/IMAGE_PROMPTS.md). They are AI concept images, not the real products. Regenerate or replace with real photos before claiming they depict the item.
- Payment Links cannot be pre-filled with size/qty: `components/HandoffNotice.js` tells the shopper Stripe asks again. Keep it until Checkout Sessions (`STRIPE_SECRET_KEY`) are live.
- See docs/SELF_AUDIT.md for open issues.
