'use client';

import Link from 'next/link';
import { useState } from 'react';
import { money } from '../lib/store';
import { addItem } from '../lib/cart';
import { redirectToCheckout } from '../lib/checkout';

export default function BuyBox({ product }) {
  const [option, setOption] = useState(product.options[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function buyNow() {
    setBusy(true);
    setError('');
    try {
      await redirectToCheckout([{ slug: product.slug, option, qty }]);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <div>
      {product.badge ? <p className="kicker">{product.badge}</p> : null}
      <h1>{product.name}</h1>
      <p className="price">{money(product.price)}{product.compareAt ? <s>{money(product.compareAt)}</s> : null}</p>
      <p>{product.description}</p>
      <div className="options">
        {product.options.map((o) => (
          <button key={o} type="button" className={o === option ? 'on' : ''} onClick={() => setOption(o)}>{o}</button>
        ))}
      </div>
      <label className="qty">Qty <input type="number" min="1" max="10" value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} /></label>
      <div className="actions">
        <button type="button" className="btn" onClick={() => { addItem(product, option, qty); setAdded(true); }}>Add to bag</button>
        <button type="button" className="btn ghost" disabled={busy} onClick={buyNow}>{busy ? 'Redirecting…' : 'Buy now'}</button>
      </div>
      {added ? <p className="note">In the bag. <Link href="/cart">View bag</Link></p> : null}
      {error ? <p className="note" role="alert">{error}</p> : null}
    </div>
  );
}
