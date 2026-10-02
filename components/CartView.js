'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readCart, setQty } from '../lib/cart';
import { money } from '../lib/store';
import { redirectToCheckout } from '../lib/checkout';

export default function CartView() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function checkout() {
    setBusy(true);
    setError('');
    try {
      await redirectToCheckout(items);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener('cart', sync);
    return () => window.removeEventListener('cart', sync);
  }, []);
  const total = items.reduce((n, i) => n + i.price * i.qty, 0);
  if (!items.length) return <p>Your bag is empty. <Link href="/products">Shop</Link></p>;
  return (
    <>
      <ul className="bag">
        {items.map((i) => (
          <li key={i.key}>
            <img src={i.image} alt="" />
            <div>
              <strong>{i.name}</strong>
              <span>{i.option}</span>
              <label>Qty <input type="number" min="0" max="10" value={i.qty} onChange={(e) => setQty(i.key, Number(e.target.value) || 0)} /></label>
            </div>
            <div className="bag-side">
              <span>{money(i.price * i.qty)}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="total">
        <span>Subtotal {money(total)}</span>
        <button type="button" className="btn" disabled={busy} onClick={checkout}>{busy ? 'Redirecting…' : 'Checkout'}</button>
        {error ? <p className="note" role="alert">{error}</p> : null}
        <p className="note">Everything in your bag is paid for in one secure Stripe checkout.</p>
      </div>
    </>
  );
}
