'use client';

import { useEffect, useState } from 'react';
import { findProduct } from '../lib/store';
import { readRecent, pushRecent } from '../lib/cart';
import ProductCard from './ProductCard';

// Records this product in localStorage and shows the others seen before. Renders nothing until there is something to show.
export default function RecentlyViewed({ slug }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    const prev = readRecent().filter((s) => s !== slug);
    pushRecent(slug);
    setList(prev.map(findProduct).filter(Boolean).slice(0, 4));
  }, [slug]);
  if (!list.length) return null;
  return (
    <section className="section" aria-labelledby="rv-h">
      <div className="container">
        <h2 id="rv-h" className="h2">Recently viewed</h2>
        <div className="grid grid-4">{list.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
      </div>
    </section>
  );
}
