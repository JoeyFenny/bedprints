import Link from 'next/link';
import { pageMeta } from '../../lib/seo';
import PageShell from '../../components/PageShell';
import { benefits } from '../../lib/content';

export const metadata = pageMeta({ title: 'About BedPrince', description: 'BedPrince makes soft, breathable bedding from bamboo viscose, built for people who run warm at night.', path: '/about/' });

export default function About() {
  return (
    <PageShell title="About BedPrince" kicker="Our story" intro="Soft, breathable bedding made from bamboo viscose, for people who run warm at night." path="/about/">
      <div className="prose">
        <div className="accordion about-acc">
          <details open>
            <summary>Why we started</summary>
            <p>A good night’s sleep starts with what is on your bed. BedPrince began with a simple idea: make sheets, pillows and blankets that feel silky, breathe well and are easy to live with, then let you try them at home before you commit.</p>
          </details>
          <details>
            <summary>What we make</summary>
            <p>Our range covers the whole bed: a sheet set, pillowcases, a duvet cover, an adjustable pillow, a cooling comforter and a knit throw. Everything is made with bamboo viscose or bamboo fibre and is machine washable.</p>
          </details>
          <details>
            <summary>What we believe</summary>
            <ul>{benefits.map((b) => <li key={b.title}><strong>{b.title}.</strong> {b.text}</li>)}</ul>
          </details>
          <details>
            <summary>Honest about claims</summary>
            <p>We keep our claims simple. We tell you what our products are made from, and we do not display certifications or awards we have not earned. If that changes, you will see the proof here.</p>
          </details>
        </div>
        <p className="about-cta"><Link href="/shop/" className="btn btn-lg">Shop the collection</Link></p>
      </div>
    </PageShell>
  );
}
