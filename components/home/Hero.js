import Link from 'next/link';
import { store } from '../../lib/store';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <img className="hero-img" src="/images/hero-bedroom.jpg" alt="A bed dressed in soft sage bamboo bedding in morning light" width="1600" height="900" fetchPriority="high" decoding="async" />
      <div className="hero-shade" />
      <div className="container hero-copy">
        <p className="kicker light">Bamboo viscose bedding</p>
        <h1 id="hero-h" className="display">{store.tagline}</h1>
        <p className="lede light">Silky, breathable sheets, pillows and blankets made from bamboo viscose. Try them for {store.trialNights} nights.</p>
        <div className="hero-cta">
          <Link href="/shop/" className="btn btn-accent btn-lg">Shop bamboo bedding</Link>
          <Link href="/products/bamboo-sheet-set/" className="btn btn-outline-light btn-lg">Shop the sheet set</Link>
        </div>
      </div>
    </section>
  );
}
