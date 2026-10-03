import Link from 'next/link';
import { findProduct, smallImage, money } from '../../lib/store';

const SET = ['bamboo-sheet-set', 'bamboo-pillowcases', 'bamboo-duvet-cover'];

export default function BundleBanner() {
  const items = SET.map(findProduct);
  return (
    <section className="section tinted" aria-labelledby="bundle-h">
      <div className="container bundle">
        <div className="bundle-copy">
          <p className="kicker">Complete the bed</p>
          <h2 id="bundle-h" className="h2">Build your whole bed in bamboo</h2>
          <p className="lede">Start with the sheet set, add matching pillowcases and a duvet cover. Spend over $75 and US shipping is free.</p>
          <Link href="/shop/" className="btn">Build your set</Link>
        </div>
        <ul className="bundle-items">
          {items.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}/`}>
                <img src={smallImage(p.images[0])} alt="" width="640" height="640" loading="lazy" decoding="async" />
                <span>{p.name}</span>
                <small>from {money(p.price)}</small>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
