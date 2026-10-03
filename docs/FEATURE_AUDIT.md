# Feature audit: BedPrince vs top DTC bedding sites

Benchmark: Cozy Earth, Brooklinen, Boll & Branch. This is the common-denominator checklist of what the best ecommerce sites ship, per page.
**Before** = state of the repo before this work (a bare wireframe). **Status** = final state, filled in at the end.

Legend: ✅ done · 🟡 done with a caveat · ⛔ not feasible on a static site (reason given) · ⏭ deferred (feasible, not worth it yet)

**Final verification (2026-10-03):** `npm test` (29 tests incl. live smoke) and `npm run build` pass; axe-core finds 0 WCAG A/AA violations on home, shop, collection, product, cart, FAQ, contact, size guide and success; live checks of `/`, `/shop/`, a product page, `/faq/`, `/sitemap.xml`, `/robots.txt` all return 200 with expected content; `/products/` 301s to `/shop/`; unknown URLs return the 404 page; `POST /api/checkout` still responds (500 `missing_stripe_key` until the secret is set). Interactions (drawer, qty, remove, filters, sort, quick add, recently viewed, sticky bar, mobile menu, per-line Buy buttons) were exercised in headless Chrome.

## Global (every page)

| Item | Before | Status | Notes |
| --- | --- | --- | --- |
| Announcement bar (shipping / trial) | Present (plain text) | ✅ done | Black bar, tan text, links to Shipping & Returns |
| Sticky header with logo wordmark | Present (text only) | ✅ done | Serif wordmark + SVG mark, backdrop blur |
| Primary nav: Shop, Sheets, Pillows, Blankets, About, FAQ | Missing | ✅ done | Collections are real static pages; active link is marked `aria-current` |
| Cart icon with live count | Present (text link) | ✅ done | Icon + badge, updates across tabs via `storage` event |
| Slide-out mini-cart drawer | Missing | ✅ done | Qty stepper, remove, subtotal, free-shipping bar, Checkout, focus trap, Esc, scroll lock |
| Free-shipping progress bar | Missing | ✅ done | Threshold in `store.freeShippingThreshold` ($75) |
| Responsive mobile menu | Missing | ✅ done | Full-height panel, Esc closes, `aria-expanded` |
| Rich footer: shop/help/company links | Missing | ✅ done |  |
| Newsletter signup UI | Missing | 🟡 done, no backend | Form posts only if `store.newsletterUrl` is set; otherwise says plainly signup is not open. No fake success |
| Payment / trust badges | Missing | ✅ done | Text chips: Stripe, Visa, Mastercard, Amex, 30-night trial. Confirm card brands in Stripe |
| Copyright and business address | Missing | 🟡 placeholder | Address is a visible `[business address]` todo until `store.businessAddress` is set |
| Favicon + logo mark | Missing | ✅ done | `app/icon.svg`, `app/apple-icon.png` |
| Font pairing (sans + serif) | Present (Inter via render-blocking CDN) | ✅ done | Self-hosted Inter + Cormorant Garamond via `next/font/local` (no third-party request, no layout shift) |
| Design system (tokens, buttons, cards, forms) | Missing | ✅ done | `app/globals.css`: CSS variables, one source of truth |
| Skip link, focus-visible, reduced motion | Missing | ✅ done | axe-core (WCAG 2 A/AA + best practice) reports 0 violations on 9 key pages |
| Search | Missing | ⏭ deferred | Six products; filter tabs cover it. Easy to add client-side later |
| Account / login / order history | Missing | ⛔ not feasible | Needs a backend; Stripe receipts cover order emails |
| Live chat, loyalty, wishlist | Missing | ⛔ not feasible / out of scope | Third-party services or backend |

## Home

| Item | Before | Status | Notes |
| --- | --- | --- | --- |
| Full-bleed hero with headline + CTA | Present (split card) | ✅ done | Photo hero, two CTAs |
| Trust bar | Missing | ✅ done | Free shipping >$75, 30-night trial, bamboo viscose, Stripe. No certifications claimed |
| Best-sellers grid | Present (all products) | ✅ done | Driven by `bestSeller` flag in `lib/store.js`; owner should confirm which are real best sellers |
| Shop-by-category tiles | Missing | ✅ done |  |
| Why-bamboo benefits | Missing | ✅ done | Softly phrased, no medical claims |
| Comparison table vs cotton | Missing | ✅ done | General fabric comparison with a disclaimer |
| Reviews / testimonials | Missing | 🟡 placeholder | Labelled 'Sample review', no names, no star counts, banner says not real customers |
| FAQ accordion | Missing | ✅ done | Native `<details>`, five questions + link to full FAQ |
| Bundle / upsell banner | Missing | ✅ done | 'Build your whole bed' with sheet set, pillowcases, duvet cover. No fake discount |
| Email capture | Missing | 🟡 done, no backend | Same honest behaviour as footer form |
| Press logos / 'as seen in' | Missing | ⛔ not applicable | No press to show; we will not invent any |
| UGC / Instagram feed | Missing | ⛔ not feasible | Needs API/backend and real content |

## Collection / shop

| Item | Before | Status | Notes |
| --- | --- | --- | --- |
| Category filter tabs | Missing | ✅ done | All, Sheets, Pillows, Blankets (client-side) |
| Sort (featured, price low/high) | Missing | ✅ done |  |
| Product cards: price, compare-at, badges | Present (name + price) | ✅ done | Save % pill, Best seller badge |
| Hover second image | Missing | ✅ done | Every product now has a detail crop derived from its photo |
| Quick add | Missing | ✅ done | Size chooser inline, opens the drawer |
| Per-category pages + breadcrumbs + intro | Missing | ✅ done | `/collections/sheets|pillows|blankets/` |
| Result count | Missing | ✅ done | `aria-live` |
| Faceted filters (color, price range) | Missing | ⏭ deferred | Not useful with six products |
| Pagination / infinite scroll | Missing | ⏭ deferred | Not needed at this catalogue size |

## Product page

| Item | Before | Status | Notes |
| --- | --- | --- | --- |
| Image gallery with thumbnails | Present (stacked images) | ✅ done | Thumbs, keyboard accessible |
| Zoom | Missing | ✅ done | Click to toggle 2x, move pointer to pan |
| Breadcrumbs | Missing | ✅ done | Plus BreadcrumbList JSON-LD |
| Price, compare-at, save % | Present (price + strike) | ✅ done |  |
| Option / size selector | Present | ✅ done | Pressed-state pills, size-guide link |
| Quantity stepper | Present (number input) | ✅ done | Accessible +/- buttons |
| Add to bag + Buy now | Present | ✅ done | Add opens drawer; Buy now goes to the product's payment link |
| Sticky mobile add-to-cart bar | Missing | ✅ done | Appears when the main buttons scroll out of view |
| Shipping / returns / trial info | Missing | ✅ done | Inline + accordion |
| Accordion: details, materials & care, shipping & returns, size guide | Missing | ✅ done | Delivery estimate is a `[delivery time]` placeholder |
| Size guide table (sheets / duvet / pillow) | Missing | ✅ done | Standard US mattress/duvet/pillow sizes; finished product dimensions are placeholders |
| Trust badges | Missing | ✅ done |  |
| Complete the set (cross-sell) | Missing | ✅ done | `pairsWith` in `lib/store.js` |
| Recently viewed | Missing | ✅ done | localStorage |
| Reviews section | Missing | 🟡 placeholder | Clearly labelled sample content; no ratings in JSON-LD |
| Product JSON-LD | Missing | ✅ done | Offer with price/currency/availability; no fake aggregateRating |
| Real customer reviews + star rating | Missing | ⛔ not feasible | Needs a review backend and real customers |
| Stock / inventory status | Missing | ⛔ not feasible | No inventory system; JSON-LD says InStock |
| Color swatches with different images | Missing | ⏭ deferred | Single set of photos per product |

## Cart (page + drawer)

| Item | Before | Status | Notes |
| --- | --- | --- | --- |
| Line items with image, option, qty, remove | Present (qty input, no remove) | ✅ done |  |
| Subtotal | Present | ✅ done | Prices re-read from the catalogue, not localStorage |
| Free-shipping progress | Missing | ✅ done |  |
| Order notes | Missing | 🟡 partial | Sent with multi-product Checkout Sessions (`metadata[note]`). Stripe Payment Links (single product) cannot carry it; the page says so |
| Upsell / cross-sell | Missing | ✅ done | 'You might also like', excludes items already in the bag |
| Empty state | Present (one line) | ✅ done | CTA + popular picks |
| Honest multi-product handling | Present (raw error text) | ✅ done | If `/api/checkout` has no key: 'Please check out one product at a time for now', then per-line **Buy this item** buttons use each product's payment link |
| Discount code field | Missing | ⛔ not feasible | No discount engine without Stripe config/backend |
| Shipping/tax estimator | Missing | ⛔ not feasible | Calculated by Stripe at checkout |
| Express checkout (Apple/Google Pay) | Missing | ⛔ not feasible here | Depends on Stripe account settings |

## Success page

| Item | Before | Status | Notes |
| --- | --- | --- | --- |
| Confirmation message | Present | ✅ done |  |
| Cart cleared | Present | ✅ done | `clearCart()` kept; also clears the saved note |
| Next steps | Missing | ✅ done | Receipt, shipping email, trial, contact |
| Continue-shopping CTAs | Present | ✅ done |  |
| Order number / summary | Missing | ⛔ not feasible | Needs a server call with a Stripe key to read the session |

## Footer / policy pages

| Item | Before | Status | Notes |
| --- | --- | --- | --- |
| About | Missing | ✅ done | Draft copy; claims kept cautious |
| FAQ (+ FAQPage JSON-LD) | Missing | ✅ done | 10 questions |
| Shipping & returns | Missing | 🟡 draft with placeholders | Processing time, carriers, return address etc. are yellow `[todo]` markers |
| Contact (mailto) | Missing | 🟡 placeholder | `[support email]` shown until `store.supportEmail` is set; form builds a mailto and never claims a send |
| Privacy policy | Missing | 🟡 draft | Needs legal review; effective date and business details are placeholders |
| Terms of service | Missing | 🟡 draft | Needs legal review |
| Size guide | Missing | ✅ done |  |
| Accessibility statement | Missing | ⏭ deferred |  |

## Global SEO / production

| Item | Before | Status | Notes |
| --- | --- | --- | --- |
| Per-page title + description | Present (partial) | ✅ done | `pageMeta()` in `lib/seo.js` |
| Canonical URLs (base https://bedprints.pages.dev) | Missing | ✅ done | Every indexable page |
| Open Graph + Twitter cards + default OG image | Present (minimal) | ✅ done | 1200x630 `og-bedprince.jpg`, per-product images |
| JSON-LD: Organization, WebSite, Product, BreadcrumbList, FAQPage | Missing | ✅ done |  |
| sitemap.xml | Missing | ✅ done | `app/sitemap.js`, all pages, excludes cart/success |
| robots.txt with Sitemap line | Present | ✅ done |  |
| 404 page | Missing | ✅ done | `app/not-found.js` -> `404.html`, with product suggestions |
| noindex for cart/success | Present | ✅ done | Kept |
| Legacy `/products/` URL | Present | ✅ done | Now `/shop/`; `_redirects` 301 + meta refresh + canonical |
| Image sizing, lazy loading, no layout shift | Missing | ✅ done | width/height on every `<img>`, 640px `-sm` variants + `srcset`, hero is eager + high priority |
| Accessibility (alt, labels, focus, contrast) | Missing | ✅ done | Tan text on white uses darker `#7a6128` for AA contrast |
| Security headers | Present | ✅ done | Unchanged `public/_headers` |
| Analytics / pixels | Missing | ⏭ deferred | Needs an account/ID; privacy page has a todo |
| Custom domain | Missing | ⏭ owner action | Change `store.url`, sitemap/robots then follow |

## Product / content gaps the owner must fill (not code)

- `[support email]`, `[business address]`, return address, processing and delivery times, return conditions (all visible yellow placeholders on the live site).
- Real customer reviews (sample reviews are placeholders).
- Confirm which products are truly best sellers (`bestSeller` flag) and the exact fabric composition for pillowcases, duvet cover, throw, comforter.
- Legal review of Privacy and Terms.
- Finished product dimensions for the size guide.
- Photography: all photos are the existing AI-generated sage set; detail views are crops of them. Real photography would lift conversion.
- Stripe: Payment Links carry one product at a time. Confirm in Stripe that each link allows adjustable quantity (the site passes size and quantity in `client_reference_id`, but cannot force the link's quantity). Set `STRIPE_SECRET_KEY` (see README TODO) to enable true multi-product checkout and order notes.
