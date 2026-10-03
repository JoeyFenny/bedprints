import { pageMeta } from '../../lib/seo';
import PageShell from '../../components/PageShell';
import ContactForm from '../../components/ContactForm';
import Todo from '../../components/Todo';
import { SupportEmail } from '../../components/Contact';
import { store } from '../../lib/store';

export const metadata = pageMeta({ title: 'Contact us', description: 'Get in touch with the BedPrince team about orders, sizing or anything else.', path: '/contact/' });

export default function ContactPage() {
  return (
    <PageShell title="Contact us" kicker="Help" intro="Questions about an order, sizing or care? We are happy to help." path="/contact/">
      <div className="contact-grid">
        <div className="prose">
          <h2>Email</h2>
          <p><SupportEmail subject="BedPrince question" /></p>
          <p>Response time: <Todo>typical response time</Todo></p>
          <h2>Mailing address</h2>
          <p>{store.businessAddress || <Todo>business address</Todo>}</p>
          <h2>Before you write</h2>
          <p>Many answers are on the <a href="/faq/">FAQ</a> and <a href="/shipping-returns/">Shipping &amp; returns</a> pages. Include your order number if you have one.</p>
        </div>
        <ContactForm />
      </div>
    </PageShell>
  );
}
