'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { products } from '../lib/store';
import { readNote, writeNote } from '../lib/cart';
import { useCart } from '../lib/useCart';
import CheckoutPanel from './CheckoutPanel';
import ProductCard from './ProductCard';

export default function CartView() {
  const { items, ready, subtotal } = useCart();
  const [note, setNote] = useState('');
  useEffect(() => { setNote(readNote()); }, []);

  if (!ready) return <div className="bag-skeleton" style={{ minHeight: 320 }} aria-busy="true" />;

  // Cross-sell: products not already in the bag, preferring the "pairs with" lists of what is.
  const inBag = new Set(items.map((i) => i.slug));
  const wanted = items.flatMap((i) => i.product.pairsWith);
  const upsell = [...new Set([...wanted, ...products.map((p) => p.slug)])]
    .filter((s) => !inBag.has(s))
    .map((s) => products.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 3);

  if (!items.length) {
    return (
      <>
        <div className="empty-bag">
          <h2 className="h2">Your bag is empty</h2>
          <p className="lede">Add something soft and we will keep it here for you.</p>
          <Link href="/shop/" className="btn btn-lg">Shop bamboo bedding</Link>
        </div>
        <div className="upsell"><h2 className="h2">Popular picks</h2><div className="grid grid-3 snap-m">{products.filter((p) => p.bestSeller).slice(0, 3).map((p) => <ProductCard key={p.slug} product={p} />)}</div></div>
      </>
    );
  }

  return (
    <>
      <div className="bag-page">
        <CheckoutPanel items={items} subtotal={subtotal}>
          <div className="order-note field">
            <label htmlFor="order-note">Order note (optional)</label>
            <textarea id="order-note" maxLength={400} value={note} onChange={(e) => { setNote(e.target.value); writeNote(e.target.value); }} placeholder="Gift message, delivery instructions…" />
            <span className="fine">Saved on this device. A note travels with a multi-product checkout; if you check out a single product, please mention special requests when you contact us.</span>
          </div>
        </CheckoutPanel>
      </div>
      <div className="upsell">
        <h2 className="h2">You might also like</h2>
        <div className="grid grid-3 snap-m">{upsell.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
      </div>
    </>
  );
}
