import Link from 'next/link';
import { products, money } from '../../lib/store';

export const metadata = { title: 'Shop bamboo bedding' };

export default function Catalog() {
  return (
    <main>
      <h1 className="page-title">Shop</h1>
      <section className="grid">
        {products.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="card">
            <img src={p.images[0]} alt="" />
            <div className="card-meta"><span>{p.name}</span><span>{money(p.price)}</span></div>
            <p className="blurb">{p.blurb}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
