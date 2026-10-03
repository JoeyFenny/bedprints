import { pageMeta } from '../../lib/seo';
import PageShell from '../../components/PageShell';
import Todo from '../../components/Todo';
import { SupportEmail } from '../../components/Contact';

export const metadata = pageMeta({ title: 'Terms of service', description: 'Terms for shopping at BedPrince.', path: '/terms/' });

export default function Terms() {
  return (
    <PageShell title="Terms of service" kicker="Legal" intro="The basics of shopping with us." path="/terms/">
      <div className="prose">
        <p className="notice" role="note"><strong>Draft, not legal advice.</strong> Have this reviewed before launch. <Todo>effective date</Todo></p>
        <h2>Orders and pricing</h2>
        <p>Prices are in US dollars. By placing an order you offer to buy the products in your bag; we may decline or cancel an order, for example if an item is unavailable or a price is shown in error, and will refund any payment taken.</p>
        <h2>Payment</h2>
        <p>Payments are processed securely by Stripe. Taxes and shipping, where they apply, are shown at checkout.</p>
        <h2>Shipping, returns and sleep trial</h2>
        <p>See our Shipping &amp; returns page, which forms part of these terms.</p>
        <h2>Product information</h2>
        <p>We try to describe and photograph our products accurately. Colours may vary slightly by screen. Product photos are illustrative.</p>
        <h2>Liability</h2>
        <p>To the extent allowed by law, our liability for any order is limited to the amount you paid for it. Nothing here limits rights you have under consumer law. <Todo>review with a lawyer</Todo></p>
        <h2>Governing law</h2>
        <p><Todo>jurisdiction</Todo></p>
        <h2>Contact</h2>
        <p>Questions about these terms: <SupportEmail subject="Terms question" />.</p>
      </div>
    </PageShell>
  );
}
