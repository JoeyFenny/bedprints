import './globals.css';
import Header from '../components/Header';
import { store } from '../lib/store';

export const metadata = {
  title: { default: 'BedPrince — Bamboo bedding that sleeps cool', template: '%s — BedPrince' },
  description: 'BedPrince makes silky, breathable bamboo bedding: sheet sets, pillowcases, duvet covers, pillows and blankets that sleep cool.',
  openGraph: { title: 'BedPrince', description: store.tagline, siteName: 'BedPrince', type: 'website' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="announce">{store.announcement}</div>
        <Header />
        {children}
        <footer>
          <span>{store.name}</span>
          <span>{store.tagline} Secure checkout by Stripe.</span>
        </footer>
      </body>
    </html>
  );
}
