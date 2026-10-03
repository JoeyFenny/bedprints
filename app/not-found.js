import Link from 'next/link';
import { products } from '../lib/store';
import ProductCard from '../components/ProductCard';

export const metadata = { title: 'Page not found', robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <main className="container narrow center page-pad">
      <p className="kicker">Error 404</p>
      <h1 className="display">We couldn’t find that page.</h1>
      <p className="lede">The link may be old or mistyped. Try one of these instead.</p>
      <div className="row-center">
        <Link href="/shop/" className="btn">Shop all bedding</Link>
        <Link href="/" className="btn btn-outline">Back to home</Link>
      </div>
      <div className="grid grid-3 left page-pad-top">
        {products.slice(0, 3).map((p) => <ProductCard key={p.slug} product={p} as="h2" />)}
      </div>
    </main>
  );
}
