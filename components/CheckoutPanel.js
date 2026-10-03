'use client';

import { useState } from 'react';
import Link from 'next/link';
import { money } from '../lib/store';
import { redirectToCheckout, paymentLinkFor } from '../lib/checkout';
import { readNote } from '../lib/cart';
import BagLines from './BagLines';
import ShippingProgress from './ShippingProgress';
import HandoffNotice from './HandoffNotice';

// Subtotal + checkout button + friendly multi-product fallback. Used by the cart page and the drawer.
// Renders the line list itself so it can attach per-line "Buy this item" buttons after a multi-product failure.
export default function CheckoutPanel({ items, subtotal, onNavigate, compact = false, showViewBag = false, children = null }) {
  const [busy, setBusy] = useState(false);
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');
  const [perLine, setPerLine] = useState(false);
  const [handoffKey, setHandoff] = useState(null); // key of the line about to go to a Stripe Payment Link (needs a heads-up first)
  const handoff = handoffKey ? items.find((i) => i.key === handoffKey) || null : null;

  function checkout() {
    if (items.length === 1 && paymentLinkFor(items)) { setHandoff(items[0].key); return; }
    goCheckout();
  }
  async function goCheckout() {
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
  function buyLine(item) {
    if (paymentLinkFor([item])) { setHandoff(item.key); return; }
    goLine(item);
  }
  function continueHandoff() {
    const link = paymentLinkFor([handoff]);
    setBusyKey(handoff.key);
    window.location.assign(link);
  }
  async function goLine(item) {
    setBusyKey(item.key);
    setError('');
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
        {children}
      </div>
      <div className="bag-foot">
        <ShippingProgress subtotal={subtotal} />
        <div className="subtotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
        <p className="fine">Any shipping or taxes are shown on the secure checkout page before you pay.</p>
        {handoff ? (
          <HandoffNotice item={handoff} busy={Boolean(busyKey)} onContinue={continueHandoff} onCancel={() => { setHandoff(null); setBusyKey(''); }} />
        ) : (
          <button type="button" className="btn btn-block" disabled={busy} onClick={checkout}>{busy ? 'Redirecting to secure checkout…' : 'Checkout'}</button>
        )}
        {error ? <p className={perLine ? 'notice' : 'notice error'} role="alert">{error}</p> : null}
        {showViewBag ? <Link href="/cart/" className="link-center" onClick={onNavigate}>View full bag</Link> : null}
        <p className="fine center">Secure checkout by Stripe. 30-night sleep trial.</p>
      </div>
    </>
  );
}
