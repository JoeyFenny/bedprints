'use client';

import { useState } from 'react';
import Link from 'next/link';
import { money } from '../lib/store';
import { redirectToCheckout, paymentLinkFor } from '../lib/checkout';
import { readNote } from '../lib/cart';
import BagLines from './BagLines';
import ShippingProgress from './ShippingProgress';

// Subtotal + checkout button + friendly multi-product fallback. Used by the cart page and the drawer.
// Renders the line list itself so it can attach per-line "Buy this item" buttons after a multi-product failure.
export default function CheckoutPanel({ items, subtotal, onNavigate, compact = false, showViewBag = false }) {
  const [busy, setBusy] = useState(false);
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');
  const [perLine, setPerLine] = useState(false);

  async function checkout() {
    setBusy(true);
    setError('');
    try {
      await redirectToCheckout(items, readNote());
    } catch (e) {
      setError(e.message);
      if (e.code === 'one_at_a_time') setPerLine(true);
      setBusy(false);
    }
  }
  async function buyLine(item) {
    setBusyKey(item.key);
    setError('');
    const link = paymentLinkFor([item]);
    if (link) { window.location.assign(link); return; }
    try {
      await redirectToCheckout([item]);
    } catch (e) {
      setError(e.message);
      setBusyKey('');
    }
  }

  return (
    <>
      <div className="bag-scroll">
        <BagLines items={items} compact={compact} onNavigate={onNavigate} onBuyLine={perLine && items.length > 1 ? buyLine : undefined} busyKey={busyKey} />
      </div>
      <div className="bag-foot">
        <ShippingProgress subtotal={subtotal} />
        <div className="subtotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
        <p className="fine">Taxes and shipping are calculated at checkout.</p>
        <button type="button" className="btn btn-block" disabled={busy} onClick={checkout}>{busy ? 'Redirecting to secure checkout…' : 'Checkout'}</button>
        {error ? <p className={perLine ? 'notice' : 'notice error'} role="alert">{error}</p> : null}
        {showViewBag ? <Link href="/cart/" className="link-center" onClick={onNavigate}>View full bag</Link> : null}
        <p className="fine center">Secure checkout by Stripe. 30-night sleep trial.</p>
      </div>
    </>
  );
}
