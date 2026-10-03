export const store = {
  name: 'BedPrince',
  tagline: 'Bamboo bedding that sleeps cool.',
  announcement: 'Free US shipping over $75. 30-night sleep trial.',
  url: 'https://bedprints.pages.dev', // canonical base URL; change when a custom domain is attached
  freeShippingThreshold: 7500, // cents
  trialNights: 30,
  // Business details we do not know yet. Leave '' to show a visible "[placeholder]" on the site.
  supportEmail: '', // set to your support address; empty shows a [support email] placeholder
  businessAddress: '',
  newsletterUrl: '', // optional form endpoint (Buttondown, Formspree...). Empty = "coming soon" note, nothing is collected.
};

export const categories = [
  { slug: 'sheets', name: 'Sheets', blurb: 'Silky bamboo-viscose sheet sets, pillowcases and duvet covers.', image: '/images/bamboo-sheet-set-2.jpg' },
  { slug: 'pillows', name: 'Pillows', blurb: 'Adjustable-fill pillows and smooth pillowcases.', image: '/images/bamboo-pillow.jpg' },
  { slug: 'blankets', name: 'Blankets', blurb: 'Lightweight comforters, duvet covers and breathable throws.', image: '/images/bamboo-cooling-comforter.jpg' },
];

export const products = [
  {
    slug: 'bamboo-sheet-set',
    name: 'Bamboo sheet set',
    price: 10900,
    compareAt: 13900,
    badge: 'Best seller',
    bestSeller: true,
    blurb: 'Silky, breathable sheets that stay cool all night.',
    description: 'Four-piece set: fitted sheet, flat sheet and two pillowcases, woven from 100% bamboo-derived viscose. Soft, breathable and light on the skin, so many sleepers find it comfortable on warm nights. Deep pockets fit mattresses up to 16 inches. Machine washable and softer with every wash. Pick your size.',
    images: ['/images/bamboo-sheet-set.jpg', '/images/bamboo-sheet-set-2.jpg', '/images/bamboo-sheet-set-detail.jpg'],
    options: ['Queen', 'King', 'Full', 'Twin'],
    categories: ['sheets'],
    highlights: [
      'Fitted sheet, flat sheet and two pillowcases',
      'Deep pockets fit mattresses up to 16 inches',
      'Woven from bamboo-derived viscose, soft and breathable',
      'Machine washable',
    ],
    materials: '100% bamboo-derived viscose.',
    sizeGuide: 'sheets',
    pairsWith: ['bamboo-pillowcases', 'bamboo-duvet-cover', 'bamboo-pillow'],
    stripePaymentLink: 'https://buy.stripe.com/14AcN56351t2cZKdfZ9Ve0n',
  },
  {
    slug: 'bamboo-pillowcases',
    bestSeller: true,
    name: 'Bamboo pillowcase pair',
    price: 3400,
    compareAt: null,
    badge: null,
    blurb: 'Cool, smooth pillowcases for hair and skin.',
    description: 'A pair of envelope-closure pillowcases in breathable bamboo viscose. The smooth, low-friction weave helps reduce frizz and sleep creases, and stays cool against your face. Machine washable.',
    images: ['/images/bamboo-pillowcases.jpg', '/images/bamboo-pillowcases-detail.jpg'],
    options: ['Standard', 'King'],
    categories: ['sheets', 'pillows'],
    highlights: [
      'Set of two envelope-closure pillowcases',
      'Smooth, low-friction weave',
      'Breathable bamboo viscose',
      'Machine washable',
    ],
    materials: 'Bamboo viscose.',
    sizeGuide: 'pillow',
    pairsWith: ['bamboo-sheet-set', 'bamboo-pillow', 'bamboo-duvet-cover'],
    stripePaymentLink: 'https://buy.stripe.com/5kQ8wPdvx9Zyf7S4Jt9Ve0o',
  },
  {
    slug: 'bamboo-duvet-cover',
    name: 'Bamboo duvet cover',
    price: 12900,
    compareAt: null,
    badge: null,
    blurb: 'A feather-soft cover with corner ties and a hidden zip.',
    description: 'Cool, drapey bamboo viscose duvet cover with a hidden zipper closure and interior corner ties that keep your duvet in place. Includes two matching pillow shams. Machine washable.',
    images: ['/images/bamboo-duvet-cover.jpg', '/images/bamboo-duvet-cover-detail.jpg'],
    options: ['Full/Queen', 'King', 'Twin'],
    categories: ['sheets', 'blankets'],
    highlights: [
      'Hidden zipper closure',
      'Interior corner ties keep the duvet in place',
      'Includes two matching pillow shams',
      'Machine washable',
    ],
    materials: 'Bamboo viscose.',
    sizeGuide: 'duvet',
    pairsWith: ['bamboo-cooling-comforter', 'bamboo-sheet-set', 'bamboo-pillowcases'],
    stripePaymentLink: 'https://buy.stripe.com/00wcN5dvx8Vu6Bma3N9Ve0r',
  },
  {
    slug: 'bamboo-pillow',
    bestSeller: true,
    name: 'Bamboo pillow',
    price: 5900,
    compareAt: null,
    badge: null,
    blurb: 'Shredded bamboo and memory foam fill you can adjust.',
    description: 'A medium-firm pillow filled with shredded memory foam and bamboo fibre, with a breathable bamboo-viscose cover. Unzip to add or remove fill and find your perfect loft. Cover is removable and machine washable.',
    images: ['/images/bamboo-pillow.jpg', '/images/bamboo-pillow-detail.jpg'],
    options: ['Standard', 'King'],
    categories: ['pillows'],
    highlights: [
      'Shredded memory foam and bamboo fibre fill',
      'Adjustable loft: unzip to add or remove fill',
      'Removable, breathable bamboo-viscose cover',
      'Cover is machine washable',
    ],
    materials: 'Cover: bamboo viscose. Fill: shredded memory foam and bamboo fibre.',
    sizeGuide: 'pillow',
    pairsWith: ['bamboo-pillowcases', 'bamboo-sheet-set', 'bamboo-cooling-comforter'],
    stripePaymentLink: 'https://buy.stripe.com/aFa3cvajlc7G1h2a3N9Ve0p',
  },
  {
    slug: 'bamboo-throw-blanket',
    name: 'Bamboo throw blanket',
    price: 7900,
    compareAt: null,
    badge: null,
    blurb: 'A breathable knit throw for the sofa or the end of the bed.',
    description: 'Chunky-soft knit throw (50 x 60 in) in bamboo-cotton yarn. Cozy without overheating, and naturally breathable. Machine washable on gentle.',
    images: ['/images/bamboo-throw-blanket.jpg', '/images/bamboo-throw-blanket-detail.jpg'],
    options: ['Sage', 'Cream'],
    categories: ['blankets'],
    highlights: [
      'Chunky-soft knit, 50 x 60 in',
      'Bamboo-cotton yarn',
      'Cozy without overheating',
      'Machine washable on gentle',
    ],
    materials: 'Bamboo-cotton yarn.',
    sizeGuide: 'none',
    pairsWith: ['bamboo-cooling-comforter', 'bamboo-duvet-cover', 'bamboo-pillow'],
    stripePaymentLink: 'https://buy.stripe.com/aFadR9fDF6Nm9Nyb7R9Ve0q',
  },
  {
    slug: 'bamboo-cooling-comforter',
    bestSeller: true,
    name: 'Bamboo cooling comforter',
    price: 14900,
    compareAt: 17900,
    badge: null,
    blurb: 'A lightweight quilted comforter for hot sleepers.',
    description: 'Lightweight all-season comforter with a quilted bamboo-viscose shell and breathable bamboo-fibre fill. Box-stitched so the fill stays put, with corner loops for a duvet cover. Machine washable.',
    images: ['/images/bamboo-cooling-comforter.jpg', '/images/bamboo-cooling-comforter-detail.jpg'],
    options: ['Full/Queen', 'King'],
    categories: ['blankets'],
    highlights: [
      'Lightweight, all-season quilted comforter',
      'Bamboo-viscose shell with bamboo-fibre fill',
      'Box-stitched so the fill stays put',
      'Corner loops for use with a duvet cover',
    ],
    materials: 'Shell: bamboo viscose. Fill: bamboo fibre.',
    sizeGuide: 'duvet',
    pairsWith: ['bamboo-duvet-cover', 'bamboo-sheet-set', 'bamboo-pillow'],
    stripePaymentLink: 'https://buy.stripe.com/4gMfZhajl7Rq1h27VF9Ve0s',
  },
];

export function money(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((cents || 0) / 100);
}

export function findProduct(slug) {
  return products.find((p) => p.slug === slug);
}

export function categoryOf(slug) {
  return categories.find((c) => c.slug === slug);
}

export function productsIn(slug) {
  return slug ? products.filter((p) => p.categories.includes(slug)) : products;
}

// Whole-number "save N%" for compare-at pricing; 0 when there is no discount.
export function savePercent(p) {
  return p && p.compareAt && p.compareAt > p.price ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
}

// Small (640px) variant of a product image, generated next to the original: name.jpg -> name-sm.jpg
export function smallImage(src) {
  return /^\/images\/.+\.jpg$/.test(src) ? src.replace(/\.jpg$/, '-sm.jpg') : src;
}

export function absoluteUrl(path = '/') {
  return new URL(path, store.url).toString();
}
