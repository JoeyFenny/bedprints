import Link from 'next/link';
import { pageMeta } from '../../lib/seo';

// Legacy URL: the shop lives at /shop/. A static export cannot send a 301, so this page declares /shop/ as
// canonical and refreshes visitors there; public/_redirects adds a real 301 on Cloudflare Pages.
export const metadata = pageMeta({ title: 'Shop bamboo bedding', description: 'Shop BedPrince bamboo bedding.', path: '/shop/' });

export default function ProductsIndex() {
  return (
    <main className="container narrow center page-pad">
      <meta httpEquiv="refresh" content="0; url=/shop/" />
      <p className="lede">Taking you to the <Link href="/shop/">shop</Link>…</p>
    </main>
  );
}
