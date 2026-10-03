import NewsletterForm from '../NewsletterForm';

import { store } from '../../lib/store';

// Hidden until a real signup endpoint exists (store.newsletterUrl): a dead "coming soon" form looks unfinished.
export default function EmailCapture() {
  if (!store.newsletterUrl) return null;
  return (
    <section className="section email" aria-labelledby="email-h">
      <div className="container narrow center">
        <p className="kicker light">Stay in the loop</p>
        <h2 id="email-h" className="h2">New arrivals and sleep tips</h2>
        <p className="lede light">Join the list for launches and the occasional offer.</p>
        <NewsletterForm />
      </div>
    </section>
  );
}
