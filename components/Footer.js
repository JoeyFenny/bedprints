import Link from 'next/link';
import { store } from '../lib/store';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import Todo from './Todo';

const cols = [
  { title: 'Shop', links: [['All bedding', '/shop/'], ['Sheets', '/collections/sheets/'], ['Pillows', '/collections/pillows/'], ['Blankets', '/collections/blankets/'], ['Size guide', '/size-guide/']] },
  { title: 'Help', links: [['FAQ', '/faq/'], ['Shipping & returns', '/shipping-returns/'], ['Contact', '/contact/'], ['Your bag', '/cart/']] },
  { title: 'Company', links: [['About', '/about/'], ['Privacy policy', '/privacy/'], ['Terms of service', '/terms/']] },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>{store.tagline} Silky, breathable bedding made from bamboo viscose.</p>
          <h2 className="footer-h">Get news first</h2>
          <NewsletterForm />
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="footer-h">{c.title}</h2>
            <ul>{c.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="container footer-bottom">
        <ul className="pay-chips" aria-label="Payment and trust">
          <li>Secure checkout by Stripe</li>
          <li>Visa</li>
          <li>Mastercard</li>
          <li>Amex</li>
          <li>30-night sleep trial</li>
        </ul>
        <p>
          &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
          {' '}{store.businessAddress ? store.businessAddress : <Todo>business address</Todo>}
        </p>
      </div>
    </footer>
  );
}
