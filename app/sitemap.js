import { products, categories, absoluteUrl } from '../lib/store.js';

export const dynamic = 'force-static';

const STATIC = ['/', '/shop/', '/about/', '/faq/', '/shipping-returns/', '/size-guide/', '/contact/', '/privacy/', '/terms/'];

export default function sitemap() {
  const now = new Date();
  return [
    ...STATIC.map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: p === '/' ? 'weekly' : 'monthly', priority: p === '/' ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/collections/${c.slug}/`), lastModified: now, changeFrequency: 'weekly', priority: 0.8 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}/`), lastModified: now, changeFrequency: 'weekly', priority: 0.9 })),
  ];
}
