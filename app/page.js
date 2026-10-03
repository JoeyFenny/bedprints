import Link from 'next/link';
import { products, store } from '../lib/store';
import { faqs } from '../lib/content';
import { pageMeta } from '../lib/seo';
import ProductCard from '../components/ProductCard';
import FaqList from '../components/FaqList';
import SampleReviews from '../components/SampleReviews';
import Hero from '../components/home/Hero';
import TrustBar from '../components/home/TrustBar';
import CategoryTiles from '../components/home/CategoryTiles';
import WhyBamboo from '../components/home/WhyBamboo';
import BundleBanner from '../components/home/BundleBanner';
import EmailCapture from '../components/home/EmailCapture';

export const metadata = pageMeta({
  title: undefined,
  description: 'Silky, breathable bamboo bedding that sleeps cool: sheet sets, pillowcases, duvet covers, pillows and blankets. Free US shipping over $75 and a 30-night sleep trial.',
  path: '/',
});
metadata.title = { absolute: 'BedPrince — Bamboo bedding that sleeps cool' };
metadata.openGraph.title = 'BedPrince — Bamboo bedding that sleeps cool';
metadata.twitter.title = 'BedPrince — Bamboo bedding that sleeps cool';

export default function Home() {
  const best = products.filter((p) => p.bestSeller).slice(0, 4);
  return (
    <main>
      <Hero />
      <TrustBar />
      <section className="section" aria-labelledby="best-h">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Best sellers</p>
              <h2 id="best-h" className="h2">Start with the essentials</h2>
            </div>
            <Link href="/shop/" className="link-arrow">Shop all</Link>
          </div>
          <div className="grid grid-4">
            {best.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>
      <CategoryTiles />
      <WhyBamboo />
      <BundleBanner />
      {store.showSampleReviews ? <SampleReviews heading="Reviews, coming soon" /> : null}
      <section className="section" aria-labelledby="faq-h">
        <div className="container narrow-lg">
          <p className="kicker">Questions</p>
          <h2 id="faq-h" className="h2">Frequently asked</h2>
          <FaqList items={faqs.slice(0, 5)} />
          <p className="center"><Link href="/faq/" className="link-arrow">See all FAQs</Link></p>
        </div>
      </section>
      <EmailCapture />
    </main>
  );
}
