export const store = {
  name: 'Bedprints',
  tagline: 'Bamboo bedding that sleeps cool.',
  announcement: 'Free US shipping over $75. 30-night sleep trial.',
};

export const products = [
  {
    slug: 'bamboo-sheet-set',
    name: 'Bamboo sheet set',
    price: 10900,
    compareAt: 13900,
    badge: 'Best seller',
    blurb: 'Silky, breathable sheets that stay cool all night.',
    description: 'Four-piece set: fitted sheet, flat sheet and two pillowcases, woven from 100% bamboo-derived viscose. Softer than cotton, naturally temperature-regulating and gentle on sensitive skin. Deep pockets fit mattresses up to 16 inches. Machine washable and softer with every wash. Pick your size.',
    images: ['/images/bamboo-sheet-set.jpg', '/images/bamboo-sheet-set-2.jpg'],
    options: ['Queen', 'King', 'Full', 'Twin'],
    stripePaymentLink: '',
  },
  {
    slug: 'bamboo-pillowcases',
    name: 'Bamboo pillowcase pair',
    price: 3400,
    compareAt: null,
    badge: null,
    blurb: 'Cool, smooth pillowcases for hair and skin.',
    description: 'A pair of envelope-closure pillowcases in breathable bamboo viscose. The smooth, low-friction weave helps reduce frizz and sleep creases, and stays cool against your face. Machine washable.',
    images: ['/images/bamboo-pillowcases.jpg'],
    options: ['Standard', 'King'],
    stripePaymentLink: '',
  },
  {
    slug: 'bamboo-duvet-cover',
    name: 'Bamboo duvet cover',
    price: 12900,
    compareAt: null,
    badge: null,
    blurb: 'A feather-soft cover with corner ties and a hidden zip.',
    description: 'Cool, drapey bamboo viscose duvet cover with a hidden zipper closure and interior corner ties that keep your duvet in place. Includes two matching pillow shams. Machine washable.',
    images: ['/images/bamboo-duvet-cover.jpg'],
    options: ['Full/Queen', 'King', 'Twin'],
    stripePaymentLink: '',
  },
  {
    slug: 'bamboo-pillow',
    name: 'Bamboo pillow',
    price: 5900,
    compareAt: null,
    badge: null,
    blurb: 'Shredded bamboo and memory foam fill you can adjust.',
    description: 'A medium-firm pillow filled with shredded memory foam and bamboo fibre, with a breathable bamboo-viscose cover. Unzip to add or remove fill and find your perfect loft. Cover is removable and machine washable.',
    images: ['/images/bamboo-pillow.jpg'],
    options: ['Standard', 'King'],
    stripePaymentLink: '',
  },
  {
    slug: 'bamboo-throw-blanket',
    name: 'Bamboo throw blanket',
    price: 7900,
    compareAt: null,
    badge: null,
    blurb: 'A breathable knit throw for the sofa or the end of the bed.',
    description: 'Chunky-soft knit throw (50 x 60 in) in bamboo-cotton yarn. Cozy without overheating, and naturally breathable. Machine washable on gentle.',
    images: ['/images/bamboo-throw-blanket.jpg'],
    options: ['Sage', 'Cream'],
    stripePaymentLink: '',
  },
  {
    slug: 'bamboo-cooling-comforter',
    name: 'Bamboo cooling comforter',
    price: 14900,
    compareAt: 17900,
    badge: null,
    blurb: 'A lightweight quilted comforter for hot sleepers.',
    description: 'Lightweight all-season comforter with a quilted bamboo-viscose shell and breathable bamboo-fibre fill. Box-stitched so the fill stays put, with corner loops for a duvet cover. Machine washable.',
    images: ['/images/bamboo-cooling-comforter.jpg'],
    options: ['Full/Queen', 'King'],
    stripePaymentLink: '',
  },
];

export function money(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((cents || 0) / 100);
}

export function findProduct(slug) {
  return products.find((p) => p.slug === slug);
}
