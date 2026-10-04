# BedPrince self-audit (3 Oct 2026)

Method: skeptical shopper + designer pass on the LIVE site (https://bedprints.pages.dev) with headless Chrome (puppeteer-core) at 390px and 1440px, full-page screenshots of home, shop, six product pages, FAQ, cart/drawer, success, 404 and the info pages; interactive shots (menu, quick add, drawer, sticky bar); axe-core; Lighthouse; a link/asset crawl; and a read-only look at each Stripe Payment Link page (no purchase made). Stripe, the Cloudflare dashboard and secrets were not touched.

Baseline Lighthouse (before): performance 98-100, accessibility 100, best-practices 100, SEO 100, CLS 0, mobile LCP ~2.3 s. Crawl: no broken internal links or assets, no console errors except the expected 404 page. The big problems were visual, trust/copy and checkout correctness, which Lighthouse does not see.

## Fixed

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | **Mobile menu was broken**: only "Shop" showed. `backdrop-filter` on the sticky header made it the containing block of the `position: fixed` nav (collapsed to a sliver); `top` also assumed a 37px announcement bar | High | `backdrop-filter` dropped while `body.menu-open`; header height measured into `--menu-top` (Header.js) |
| 2 | **Size/quantity chosen on the site never reached Stripe.** Payment Links open at Qty 1 with a "Select..." size dropdown, so qty 2 on site meant qty 1 on Stripe | High | New `HandoffNotice` in Buy now and drawer/cart checkout: repeats the choice ("size King, quantity 2"), says Stripe will ask again and starts at 1, mentions the business name shown (Fenny Ventures, LLC). `client_reference_id` still sent. Real fix needs Checkout Sessions (see "Remaining") |
| 3 | **Photos were soft, sage-green, 768px upscaled** (palette should be black/white/tan) | High | All 7 product photos, 6 detail photos, the hero and the OG image regenerated (AI Horde, Juggernaut XL, 1024px, picked by eye) and re-sized to 1200px plus 640px `-sm` variants. Method and prompts: `docs/IMAGE_PROMPTS.md`. Pollinations now returns HTTP 402, so it could not be used |
| 4 | **Hero**: sage crop, white text over the bright part of the photo at 4.1-4.4:1 contrast, and on phones the text sat on a cropped photo | High | Phones (<=700px): photo on top, copy on solid black. Desktop: stronger left scrim (measured 8-9:1). Responsive `srcSet` (960w/1600w), accurate alt text |
| 5 | Mobile announcement bar wrapped to two lines with a tiny "Details" link | Low | Whole line is one link; "Details" hidden <=480px |
| 6 | Home comparison table hid the cotton column behind sideways scroll on phones | Med | Stacked cards (`.table.stack` + `data-label`) |
| 7 | About page `.btn` text contrast 3.56:1 (`.prose a` overrode button colour) | Med | `.prose a:not(.btn)` |
| 8 | Compare-at price contrast 4.16:1 | Low | uses `--muted` |
| 9 | 404 page heading order (h1 then h3) | Low | cards render `h2` |
| 10 | Duplicate "Save N%" (badge on image and price pill) on cards | Low | pill hidden inside `.card` |
| 11 | Small tap targets (footer links, breadcrumbs, shipping info and "link-arrow" links) | Low | padding added. Inline links inside paragraphs remain below 44px (WCAG 2.2 allows inline text) |
| 12 | Gallery main image shipped the 1200px file to phones; first card lacked `fetchpriority` | Low | `srcSet`/`sizes`, `fetchPriority="high"` on the first card |
| 13 | Placeholder content shown to shoppers: "sample reviews", dead newsletter forms, dead contact form | Med | Hidden unless `store.showSampleReviews` / `newsletterUrl` / `supportEmail` is set. `AGENTS.md` rule relaxed for these three |
| 14 | Unsupported claim: "Taxes and shipping are calculated at checkout". The Payment Link page shows no shipping or tax lines | Med | Reworded to "Any shipping or taxes are shown on the secure checkout page before you pay" (CheckoutPanel, content.js, shipping page) |
| 15 | Home `og:title`/`twitter:title` were only "BedPrince"; product meta descriptions duplicated/awkward | Low | Full tagline; description = blurb + options + from-price + shipping/trial |
| 16 | Hashed `/_next/static/*` had `max-age=0`; images uncached | Low | `_headers`: static immutable 1 year; `/images/*` 1 day + SWR 7 days |
| 17 | Throw blanket option label was hard-coded "Size" | Low | `optionLabel: 'Color'` |
| 18 | Test coverage for these defaults | - | `tests/store.test.mjs` (25 pass, 5 live tests skipped) |

## Remaining (not fixed) and why

Needs Joey (cannot be invented, per AGENTS.md):
1. **No support email, business address, delivery time or return terms.** Yellow `[...]` Todo chips remain in the footer, policy pages, success page and the PDP accordion. Privacy and terms are drafts, and the shipping page says "Draft policy". Needs real details (and ideally legal review).
2. **Product specs were written by the earlier pass and are unverified**: "100% bamboo-derived viscose", 16" pockets, corner ties/hidden zip on the duvet, memory-foam pillow fill, throw 50 x 60 in and "bamboo-cotton yarn", box stitching, "machine washable". Confirm against the supplier spec sheet or remove.
3. **All imagery is AI-generated and does not show the real products** (details such as piping, straps and weave are invented by the model). Replace with real photos or add a visible "illustrative images" note before launch; this is also a consumer-protection risk.
4. **Compare-at prices ($139 / $179 -> "Save 22% / 17%") are unsupported.** A reference price that was never charged can be a deceptive-pricing problem. Remove them or confirm a genuine prior price.
5. **Throw blanket colours "Sage / Cream"** match the Stripe dropdown, but the new photos are tan. Rename in Stripe (dashboard, not touched) and then in `lib/store.js`.
6. **Same price for every size** (Twin = King). Probably wrong for sheets and duvets; confirm.
7. "Free US shipping over $75": every Payment Link page shows no shipping charge, so in practice shipping is free for all orders. Decide the policy and configure shipping rates in Stripe.

Technical / structural:
8. **Payment Links cannot be pre-filled with size or quantity**, and only one product can be bought per checkout. The proper fix is `STRIPE_SECRET_KEY` (restricted key, Checkout Sessions write) as a Cloudflare Pages secret, then remove `paymentLinkFor()` (README TODO). The handoff notice is a mitigation, not a fix. Not done because it needs secrets/dashboard.
9. **`/success/` says "Thank you" to anyone who visits directly** and clears the cart. Fix by passing the Checkout Session id in the redirect and verifying server-side (needs item 8).
10. Product JSON-LD has no `shippingDetails`/`hasMerchantReturnPolicy` (add once policies are real). No ratings (correct: no real reviews).
11. Sitemap `lastmod` is the build time for every URL. `robots.txt` disallows `/cart/` and `/success/` which are also noindex (harmless). 404 canonical points to `/` (harmless).
12. Images are 1024px sources upscaled to 1200px; fine for cards, a little soft when zoomed. Real photography would fix this.
13. The Stripe page shows "Fenny Ventures, LLC" rather than BedPrince; branding and statement descriptor are set in the Stripe dashboard.
14. **/shop/ mobile LCP is 3.5 s (Lighthouse perf 91, throttled slow-4G)**: the first card downloads the 1200px image (~914 KiB image-delivery saving over the page). Unchanged from before; fix by adding a ~900w variant to the card srcset or lowering `sizes`.
15. No analytics/pixels (deferred; needs an account and a privacy-page update).

Post-deploy Lighthouse (live, mobile): home 99 / LCP 2.2 s, product page 97 / LCP 2.6 s, shop 91 / LCP 3.5 s; accessibility, best-practices and SEO all 100, CLS 0. Desktop: 100 everywhere. Live deploy of the new images was verified byte-for-byte (md5) and the mobile menu, drawer and handoff notice were re-shot on the live site.

## Recommended next steps (in order)
1. Fill in `supportEmail`, `businessAddress`, shipping/returns terms; finish policies (items 1, 7).
2. Verify product specs and the compare-at prices (items 2, 4); decide on real photos vs disclosure (item 3).
3. Add the `STRIPE_SECRET_KEY` secret and switch to Checkout Sessions: size, quantity, multi-product carts, shipping and tax lines, verified success page (items 8, 9).
4. Rename throw colours in Stripe (item 5) and set per-size prices (item 6).
5. Add review collection after real orders; then turn on `showSampleReviews: false` -> real reviews and Review JSON-LD.
6. Add a post-deploy smoke test (menu opens, hero contrast, handoff notice) to CI using the puppeteer scripts from this audit.

## Commits (on main)
d174b65 UI fixes (menu, announcement, table, tap targets, contrast, 404, gallery srcset) | 3ea0fb9 checkout handoff notice | ce23c89 hide placeholders, OG/meta | e90aebc cache headers + test | 5815dc3 copy fix, hide contact form | 4449b83 hero rework | 677d3b7 regenerated images | e179623 docs notes | plus this file.

Screenshots: `/workspace/bedprince-shots/before` and `/after`; headline pairs in `/workspace/bedprince-shots/` (`1-*`, `2-*`, `3-*`).


---

# Mobile redesign pass (4 Oct 2026)

Trigger: "On mobile it looks like shit." Method: puppeteer-core + Chrome, iPhone Safari UA, touch, `deviceScaleFactor: 3`, at 390x844 and 430x932; home (every ~viewport slice), shop, two product pages, bag drawer, cart page, FAQ, About, menu, footer; `document.scrollWidth`, tap-target sizes and field font sizes measured in the page, hero text contrast measured from pixels. Before/after shots in `/workspace/bedprince-shots/mobile-v2/` (`before/`, `live1/`, `live2/`, final picks in the folder root). Scripts: `/workspace/tools/mobile-shots.mjs` (all pages + overflow/tap report), `inter2.mjs` (header hide, menu, quick add, sticky bar, swipe, drawer), `desk.mjs` (1440 regression). Stripe, Cloudflare dashboard and secrets untouched.

## What was wrong (390px, before)

| Problem | Detail |
|---|---|
| Home was 6,585 px tall (7.8 screens) | 4-up product grid collapsed to a long stack, 3 full-width category tiles (~1,000 px), 4 benefit blocks, a 10-block stacked comparison table, 3-up bundle thumbnails at ~100 px |
| Chrome ate the first screen | 37 px announcement + 68 px header; header never got out of the way; hero was photo, then a separate black copy block, then two equal CTAs, then a 2x2 trust block: first screen had no product |
| Quick add was a big white pill sitting on every product photo | covered the product on a 170 px-wide card |
| Product page | square photo with 68 px thumbnails (not swipeable), 4-line description before the size chips, "Add to bag" and "Buy now" stacked with similar weight, a 4-row trust box plus a duplicate shipping paragraph, no add-to-cart in view on arrival; the sticky bar only appeared after scrolling past the buttons |
| Cart drawer | right-hand drawer, 440 px max, header 28 px serif, close button 40 px; footer could grow taller than the screen when the Stripe hand-off notice opened |
| Footer | three full link lists + brand + chips: ~1,100 px |
| iOS details | `viewport-fit=cover` missing, so `env(safe-area-inset-*)` was always 0; form fields were 15 px (iOS zooms the page on focus); `vh` in hero and `#main`; `backdrop-filter` blur on the sticky header (scroll jank); `:hover` zoom effects stuck after a tap |
| Tap targets | logo link 25 px high, announcement link 18 px, bag line names 19 px, breadcrumb links 43x29, quantity buttons 32-38 px, shop filter chips 38 px |
| Shop | tall header + lede, wrapped filter chips, 15 px sort select |
| Long text | About page was one long scroll; product description sat in front of the buy button |

## What changed

Phones (<=700 px for most things, <=860 px for product page/footer behaviour); desktop rules untouched. Code: `app/globals.css` (sections "Mobile v2, phase 1-4" at the end), `components/Gallery.js`, `BuyBox.js`, `FooterCols.js` (new), `Header.js`, `ProductCard.js`, `ProductDetails.js`, `app/about/page.js`, plus `snap-m` class additions on home/product/cart.

- **Header**: 56 px (was 68), 44 px icon buttons, white and opaque (no blur), hides on scroll down and returns on any scroll up; the open menu is measured below it and is exempt (a transform/`will-change` on the header would trap the fixed menu again: see the CSS comment). Announcement is a full-width 44 px tap target.
- **Hero**: one full-bleed photo (`min(74svh, 640px)`), copy over a bottom scrim (measured background luminance gives >= 6:1 behind the kicker and ~14:1 behind headline/lede), one primary tan CTA, the second action is a text link. Trust points are a swipeable single row.
- **Home rhythm**: best sellers, categories and benefits are edge-to-edge scroll-snap carousels with a peeking next card; bundle thumbnails are a carousel; comparison table is label + two side-by-side columns; sections 44 px padding; 28 px h2s. Home is 4,750 px (-28%).
- **Cards**: 2-up grid on shop/collections, quiet badges (sale badge dropped on phones, price shows the strike-through), 44 px round quick-add (single-option products add directly; multi-size opens a 2x2 chip sheet on the photo).
- **Product page**: edge-to-edge swipe gallery (CSS scroll-snap, `scroll-snap-stop: always`, dots with 28x40 tap areas, 1/3 counter; desktop keeps thumbnails + zoom and loads the same first image URL), one-line pitch under the title with the full description in the accordion, size chips in an even grid (48 px), stepper + "Add to bag - $price" on one 56 px row, "Buy now" secondary, 2x2 perks without a box, duplicate shipping paragraph hidden. Sticky bar: price + name, size pill (scrolls to the chips) and Add to bag, with `env(safe-area-inset-bottom)`; it shows whenever the main buttons are off-screen (including on arrival) and the footer gets matching bottom padding.
- **Bag**: bottom sheet (<=90dvh, rounded, grab handle), 76 px thumbs, 40 px steppers, 54 px Checkout, footer scrolls if the hand-off notice makes it tall, safe-area padding. Cart page tightened.
- **Shop**: short page header, filter chips scroll horizontally (44 px), 44 px sort select.
- **Footer**: brand line + three accordions (`FooterCols`, real buttons with `aria-expanded`; plain headings and always-open lists from 861 px) + scrolling payment chips: ~460 px closed.
- **iOS/browser**: `viewportFit: 'cover'`, fields >= 16 px everywhere, `svh`/`dvh` with `vh` fallbacks, `touch-action: manipulation`, no tap highlight, hover effects only on `(hover: hover)`, `overscroll-behavior: contain` on carousels and the bag, `body { overflow-x: clip }` guard.
- **About**: sections are accordions.

## Bugs found while doing it (and fixed)

1. `.sr-only` text inside a horizontally scrolling carousel is `position: absolute` and escaped the scroller, making the page 846 px wide (the whole mobile layout viewport widened). Fix: `.snap-m { position: relative }`. Check `document.documentElement.scrollWidth` after any new carousel.
2. `will-change: transform` on the sticky header (added for the hide-on-scroll) made the open menu collapse again (same family as audit item 1). Removed; the header only has a transform while hidden, and never while the menu is open.
3. `.pdp-gallery` kept its desktop `top: 76px` as `position: relative` on phones, pushing the photo 76 px down.

## Verified

- Live (https://bedprints.pages.dev) at 390 and 430: `scrollWidth == innerWidth` on home, shop, two products, drawer, cart, FAQ, About; no fields under 16 px on shop, cart, contact, home; header hides/returns; menu fills the screen below the header; swipe counter follows the scroll; "Add to bag" opens the sheet; 1440 desktop screenshots re-checked (home, product, shop, cart).
- `npm test` 25 pass / 5 live skipped, `npm run build` ok.

## Not done / ideas

- No real-device test (iOS Safari toolbar collapse, rubber-banding, the 300 ms tap behaviour): everything above is Chrome emulation. Worth one check on Joey's phone.
- Hero photo is a 1600x900 landscape AI image cropped to portrait (upscaled ~1.6x at 3x DPR); a portrait crop or real photo would be sharper.
- Policy pages (privacy, terms, shipping) are still long prose; they could be accordions once the real text exists.
- Header hide-on-scroll could also collapse the announcement bar permanently once dismissed.
