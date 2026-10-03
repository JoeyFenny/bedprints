import Link from 'next/link';
import { categories } from '../../lib/store';

export default function CategoryTiles() {
  return (
    <section className="section" aria-labelledby="cat-h">
      <div className="container">
        <p className="kicker">Shop by category</p>
        <h2 id="cat-h" className="h2">Find your fit</h2>
        <div className="grid grid-3 tiles">
          {categories.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}/`} className="tile">
              <img src={c.image.replace(/\.jpg$/, '-sm.jpg')} alt="" width="640" height="640" loading="lazy" decoding="async" />
              <span className="tile-label"><strong>{c.name}</strong><small>{c.blurb}</small></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
