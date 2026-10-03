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
14. No analytics/pixels (deferred; needs an account and a privacy-page update).

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
