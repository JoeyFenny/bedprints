import Link from 'next/link';
import { pageMeta } from '../../lib/seo';
import PageShell from '../../components/PageShell';
import { benefits } from '../../lib/content';

export const metadata = pageMeta({ title: 'About BedPrince', description: 'BedPrince makes soft, breathable bedding from bamboo viscose, built for people who run warm at night.', path: '/about/' });

export default function About() {
  return (
    <PageShell title="About BedPrince" kicker="Our story" intro="Soft, breathable bedding made from bamboo viscose, for people who run warm at night." path="/about/">
      <div className="prose">
        <h2>Why we started</h2>
        <p>A good night’s sleep starts with what is on your bed. BedPrince began with a simple idea: make sheets, pillows and blankets that feel silky, breathe well and are easy to live with, then let you try them at home before you commit.</p>
        <h2>What we make</h2>
        <p>Our range covers the whole bed: a sheet set, pillowcases, a duvet cover, an adjustable pillow, a cooling comforter and a knit throw. Everything is made with bamboo viscose or bamboo fibre and is machine washable.</p>
        <h2>What we believe</h2>
        <ul>{benefits.map((b) => <li key={b.title}><strong>{b.title}.</strong> {b.text}</li>)}</ul>
        <h2>Honest about claims</h2>
        <p>We keep our claims simple. We tell you what our products are made from, and we do not display certifications or awards we have not earned. If that changes, you will see the proof here.</p>
        <p><Link href="/shop/" className="btn">Shop the collection</Link></p>
      </div>
    </PageShell>
  );
}
