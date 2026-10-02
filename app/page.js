import Link from 'next/link';
import { products, store, money } from '../lib/store';

export default function Home() {
  const hero = products[0];
  return (
    <main>
      <section className="hero">
        <div>
          <p className="kicker">Bamboo bedding</p>
          <h1>{store.tagline}</h1>
          <p className="lede">Silky sheets, pillows and blankets made from breathable bamboo. Naturally cooler, softer with every wash.</p>
          <Link className="btn" href="/products">Shop all</Link>
        </div>
        <Link href={`/products/${hero.slug}`} className="hero-card">
          <img src={hero.images[0]} alt={hero.name} />
          <div><strong>{hero.name}</strong><span>{money(hero.price)}</span></div>
        </Link>
      </section>
      <section className="grid">
        {products.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="card">
            <img src={p.images[0]} alt="" />
            <div className="card-meta"><span>{p.name}</span><span>{money(p.price)}</span></div>
          </Link>
        ))}
      </section>
    </main>
  );
}
