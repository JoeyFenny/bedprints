'use client';

import { useMemo, useState } from 'react';
import { products, categories } from '../lib/store';
import ProductCard from './ProductCard';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export default function ShopGrid({ initialCategory = '' }) {
  const [cat, setCat] = useState(initialCategory);
  const [sort, setSort] = useState('featured');
  const list = useMemo(() => {
    const l = cat ? products.filter((p) => p.categories.includes(cat)) : [...products];
    if (sort === 'price-asc') l.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') l.sort((a, b) => b.price - a.price);
    return l;
  }, [cat, sort]);
  const tabs = [{ slug: '', name: 'All' }, ...categories];
  return (
    <>
      <div className="toolbar">
        <div className="tabs" role="group" aria-label="Filter by category">
          {tabs.map((t) => (
            <button key={t.slug} type="button" className={t.slug === cat ? 'on' : ''} aria-pressed={t.slug === cat} onClick={() => setCat(t.slug)}>{t.name}</button>
          ))}
        </div>
        <label className="sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>
      <p className="result-count" role="status" aria-live="polite">{list.length} product{list.length === 1 ? '' : 's'}</p>
      <div className="grid grid-3">
        {list.map((p, i) => <ProductCard key={p.slug} product={p} priority={i < 3} />)}
      </div>
    </>
  );
}
