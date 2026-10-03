'use client';

import { findProduct, store } from '../lib/store';

// Shown just before we send a shopper to a Stripe Payment Link. Payment Links cannot be pre-filled with a
// size, colour or quantity, so Stripe's page asks again (and starts at quantity 1). Say so, and repeat what
// they chose, so nobody pays for the wrong size or the wrong number of items.
export default function HandoffNotice({ item, onContinue, onCancel, busy = false }) {
  const product = findProduct(item.slug);
  const label = (product && product.optionLabel) || 'Size';
  const multi = !product || product.options.length > 1;
  return (
    <div className="handoff" role="group" aria-label="Before you pay">
      <p className="handoff-title">One quick thing before you pay</p>
      <p>
        You chose <strong>{item.name}</strong>{multi ? <>, {label.toLowerCase()} <strong>{item.option}</strong></> : null}, quantity <strong>{item.qty}</strong>.
        Stripe&rsquo;s secure page will ask you to pick {multi ? `your ${label.toLowerCase()}` : 'the product options'} again{item.qty > 1 ? <> and will start at quantity 1, so please set it to <strong>{item.qty}</strong></> : null}.
      </p>
      <p className="fine">The payment page shows our business name as {store.legalName}.</p>
      <button type="button" className="btn btn-block" disabled={busy} onClick={onContinue}>{busy ? 'Redirecting to secure checkout…' : 'Continue to secure checkout'}</button>
      <button type="button" className="link-btn handoff-back" onClick={onCancel}>Back</button>
    </div>
  );
}
