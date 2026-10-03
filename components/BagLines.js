'use client';

import Link from 'next/link';
import { money } from '../lib/store';
import { setQty, removeItem } from '../lib/cart';
import QtyStepper from './QtyStepper';
import Icon from './Icons';

// Shared line-item list for the cart page and the drawer.
// `onBuyLine` (optional) renders a per-line "Buy this item" button that uses that product's own payment link.
export default function BagLines({ items, onBuyLine, busyKey, onNavigate, compact = false }) {
  return (
    <ul className={`bag-lines${compact ? ' compact' : ''}`}>
      {items.map((i) => (
        <li key={i.key}>
          <Link href={`/products/${i.slug}/`} onClick={onNavigate} className="bl-img">
            <img src={i.image.replace(/\.jpg$/, '-sm.jpg')} alt={i.name} width="96" height="96" loading="lazy" decoding="async" />
          </Link>
          <div className="bl-main">
            <Link href={`/products/${i.slug}/`} onClick={onNavigate} className="bl-name">{i.name}</Link>
            <span className="bl-opt">{i.option}</span>
            <span className="bl-unit">{money(i.price)} each</span>
            <div className="bl-controls">
              <QtyStepper value={i.qty} min={1} onChange={(q) => setQty(i.key, q)} label={`Quantity for ${i.name}, ${i.option}`} />
              <button type="button" className="link-btn" onClick={() => removeItem(i.key)} aria-label={`Remove ${i.name}, ${i.option}`}><Icon name="trash" size={16} /> Remove</button>
            </div>
            {onBuyLine ? (
              <button type="button" className="btn btn-sm btn-outline buy-line" disabled={busyKey === i.key} onClick={() => onBuyLine(i)}>
                {busyKey === i.key ? 'Redirecting…' : 'Buy this item'}
              </button>
            ) : null}
          </div>
          <strong className="bl-total">{money(i.price * i.qty)}</strong>
        </li>
      ))}
    </ul>
  );
}
