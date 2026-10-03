'use client';

import Link from 'next/link';
import { useState } from 'react';
import { smallImage, savePercent } from '../lib/store';
import { addItem, openCart } from '../lib/cart';
import Price from './Price';
import Icon from './Icons';

export default function ProductCard({ product, priority = false, as: Heading = 'h3' }) {
  const [picking, setPicking] = useState(false);
  const [added, setAdded] = useState('');
  const href = `/products/${product.slug}/`;
  const [first, second] = product.images;
  const save = savePercent(product);

  function quickAdd(option) {
    addItem(product, option, 1);
    setAdded(option);
    setPicking(false);
    openCart();
    setTimeout(() => setAdded(''), 2500);
  }

  return (
    <article className="card">
      <div className="card-media">
        <Link href={href} className="card-link" tabIndex={-1} aria-hidden="true">
          <img className="img-a" src={smallImage(first)} srcSet={`${smallImage(first)} 640w, ${first} 1200w`} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw" width="640" height="640" alt="" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
          {second ? <img className="img-b" src={smallImage(second)} width="640" height="640" alt="" loading="lazy" decoding="async" /> : null}
        </Link>
        <div className="card-badges">
          {product.badge ? <span className="badge">{product.badge}</span> : null}
          {save ? <span className="badge badge-sale">Save {save}%</span> : null}
        </div>
        <div className={`quick${picking ? ' open' : ''}`}>
          {picking ? (
            <div role="group" aria-label={`Choose a size for ${product.name}`} className="quick-opts">
              {product.options.map((o) => <button key={o} type="button" onClick={() => quickAdd(o)}>{o}</button>)}
              <button type="button" className="quick-x" aria-label="Cancel" onClick={() => setPicking(false)}><Icon name="close" size={16} /></button>
            </div>
          ) : (
            <button type="button" className="quick-btn" onClick={() => setPicking(true)} aria-label={`Quick add ${product.name}`}>
              {added ? <><Icon name="check" size={16} /> Added ({added})</> : <><Icon name="plus" size={16} /> Quick add</>}
            </button>
          )}
        </div>
      </div>
      <div className="card-body">
        <Heading className="card-title"><Link href={href}>{product.name}</Link></Heading>
        <p className="card-blurb">{product.blurb}</p>
        <Price product={product} />
      </div>
    </article>
  );
}
