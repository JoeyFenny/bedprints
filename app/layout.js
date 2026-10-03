import './globals.css';
import localFont from 'next/font/local';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import JsonLd from '../components/JsonLd';
import { store } from '../lib/store';
import { organizationLd, DEFAULT_OG } from '../lib/seo';

// Self-hosted variable fonts (latin subset, SIL OFL): no build-time network fetch, no layout shift.
const inter = localFont({ src: './fonts/inter-latin.woff2', weight: '400 700', display: 'swap', variable: '--font-sans' });
const serif = localFont({ src: './fonts/cormorant-latin.woff2', weight: '500 700', display: 'swap', variable: '--font-serif' });

const description = 'BedPrince makes silky, breathable bamboo bedding: sheet sets, pillowcases, duvet covers, pillows and blankets that sleep cool. Free US shipping over $75 and a 30-night sleep trial.';

export const metadata = {
  metadataBase: new URL(store.url),
  title: { default: 'BedPrince — Bamboo bedding that sleeps cool', template: '%s — BedPrince' },
  description,
  applicationName: store.name,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'BedPrince — Bamboo bedding that sleeps cool',
    description,
    url: '/',
    siteName: store.name,
    type: 'website',
    locale: 'en_US',
    images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: 'BedPrince bamboo bedding on a made bed' }],
  },
  twitter: { card: 'summary_large_image', title: 'BedPrince — Bamboo bedding that sleeps cool', description, images: [DEFAULT_OG] },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: '#000000', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <AnnouncementBar />
        <Header />
        <div id="main" tabIndex={-1}>{children}</div>
        <Footer />
        <CartDrawer />
        <JsonLd data={organizationLd()} />
      </body>
    </html>
  );
}
