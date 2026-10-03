import { store, absoluteUrl } from './store.js';

export const DEFAULT_OG = '/images/og-bedprince.jpg';

// Per-page metadata with canonical URL, Open Graph and Twitter cards.
// `path` must end with a slash (trailingSlash: true), e.g. '/shop/'.
export function pageMeta({ title, description, path = '/', image = DEFAULT_OG, type = 'website', noindex = false }) {
  const url = absoluteUrl(path);
  const img = [{ url: absoluteUrl(image), alt: title || store.name }];
  const fullTitle = title ? `${title} — ${store.name}` : store.name;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, siteName: store.name, type, locale: 'en_US', images: img },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: img.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function breadcrumbLd(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: absoluteUrl(t.path) })),
  };
}

export function productLd(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    sku: p.slug,
    image: p.images.map((i) => absoluteUrl(i)),
    brand: { '@type': 'Brand', name: store.name },
    category: 'Bedding',
    url: absoluteUrl(`/products/${p.slug}/`),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/products/${p.slug}/`),
      priceCurrency: 'USD',
      price: (p.price / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': absoluteUrl('/#org'), name: store.name, url: absoluteUrl('/'), logo: absoluteUrl('/icon.svg'), slogan: store.tagline },
      { '@type': 'WebSite', '@id': absoluteUrl('/#site'), url: absoluteUrl('/'), name: store.name, publisher: { '@id': absoluteUrl('/#org') } },
    ],
  };
}

export function faqLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } })),
  };
}
