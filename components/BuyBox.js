'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { money, store } from '../lib/store';
import { addItem, openCart } from '../lib/cart';
import { redirectToCheckout, paymentLinkFor } from '../lib/checkout';
import HandoffNotice from './HandoffNotice';
import Price from './Price';
import QtyStepper from './QtyStepper';
import Icon from './Icons';

const SIZE_GUIDES = { sheets: true, duvet: true, pillow: true };

export default function BuyBox({ product }) {
  const [option, setOption] = useState(product.options[0]);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const actions = useRef(null);
  const multi = product.options.length > 1;

  // Sticky mobile bar appears once the main buttons scroll out of view.
  useEffect(() => {
    const el = actions.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => {
      const gone = !e.isIntersecting && e.boundingClientRect.top < 0;
      setStuck(gone);
      document.body.classList.toggle('has-sticky-atc', gone);
    });
    io.observe(el);
    return () => { io.disconnect(); document.body.classList.remove('has-sticky-atc'); };
  }, []);

  function add() {
    addItem(product, option, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
    openCart();
  }
  function pickSize() {
    const el = document.getElementById('opt-label');
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  function buyNow() {
    // Payment Link mode: confirm size and quantity first, because Stripe asks again.
    if (paymentLinkFor([{ slug: product.slug, option, qty }])) { setHandoff(true); return; }
    goCheckout();
  }
  async function goCheckout() {
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
    <div className="buybox">
      {product.badge ? <span className="badge">{product.badge}</span> : null}
      <h1>{product.name}</h1>
      <Price product={product} size="lg" />
      <p className="lede">{product.description}</p>

      {multi ? (
        <>
          <div className="opt-label" id="opt-label">
            <span>{product.optionLabel || 'Size'}: <span className="opt-current">{option}</span></span>
            {SIZE_GUIDES[product.sizeGuide] ? <Link href="/size-guide/">Size guide</Link> : null}
          </div>
          <div className="options" role="group" aria-labelledby="opt-label">
            {product.options.map((o) => (
              <button key={o} type="button" aria-pressed={o === option} onClick={() => setOption(o)}>{o}</button>
            ))}
          </div>
        </>
      ) : null}

      <div className="buy-row" ref={actions}>
        <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, q))} label="Quantity" />
        <button type="button" className="btn btn-lg grow" onClick={add}>{added ? <><Icon name="check" size={18} /> Added to bag</> : `Add to bag · ${money(product.price * qty)}`}</button>
      </div>
      {handoff ? (
        <HandoffNotice item={{ slug: product.slug, name: product.name, option, qty }} busy={busy} onContinue={goCheckout} onCancel={() => setHandoff(false)} />
      ) : (
        <>
          <button type="button" className="btn btn-outline btn-lg btn-block" disabled={busy} onClick={buyNow}>{busy ? 'Redirecting to secure checkout…' : 'Buy now'}</button>
          <p className="fine center buy-fine">Buy now opens Stripe&rsquo;s secure payment page. Add to bag keeps shopping.</p>
        </>
      )}
      {error ? <p className="notice error" role="alert">{error}</p> : null}

      <p className="shipinfo">
        <span><strong>Free US shipping</strong> on orders over {money(store.freeShippingThreshold)}.</span>
        <span><strong>{store.trialNights}-night sleep trial.</strong> See <Link href="/shipping-returns/">shipping &amp; returns</Link>.</span>
      </p>

      <ul className="perks" aria-label="Why you can buy with confidence">
        <li><Icon name="truck" size={22} /> Free US shipping over $75</li>
        <li><Icon name="moon" size={22} /> 30-night sleep trial</li>
        <li><Icon name="wash" size={22} /> Machine washable</li>
        <li><Icon name="lock" size={22} /> Secure checkout by Stripe</li>
      </ul>

      <div className={`sticky-atc${stuck ? ' show' : ''}`} aria-hidden={!stuck}>
        <div className="sa-info"><span className="sa-price">{money(product.price)}</span><span className="sa-name">{product.name}</span></div>
        {multi ? <button type="button" className="sa-size" tabIndex={stuck ? 0 : -1} onClick={pickSize} aria-label={`${product.optionLabel || 'Size'}: ${option}. Change`}>{option}<span className="chev" aria-hidden="true" /></button> : null}
        <button type="button" className="btn sa-add" tabIndex={stuck ? 0 : -1} onClick={add}>{added ? 'Added' : 'Add to bag'}</button>
      </div>
    </div>
  );
}
