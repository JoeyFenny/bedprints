import Link from 'next/link';
import { store } from '../../lib/store';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <img className="hero-img" src="/images/hero-bedroom.jpg" srcSet="/images/hero-bedroom-sm.jpg 960w, /images/hero-bedroom.jpg 1600w" sizes="100vw" alt="A bed made with crisp white bedding, a tan lumbar pillow and a black slatted headboard in a bright bedroom" width="1600" height="900" fetchPriority="high" decoding="async" />
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
