import Link from 'next/link';
import { pageMeta } from '../../lib/seo';
import PageShell from '../../components/PageShell';
import Todo from '../../components/Todo';
import { SupportEmail } from '../../components/Contact';

export const metadata = pageMeta({ title: 'Shipping & returns', description: 'Free US shipping over $75, a 30-night sleep trial, and how returns work at BedPrince.', path: '/shipping-returns/' });

export default function ShippingReturns() {
  return (
    <PageShell title="Shipping & returns" kicker="Help" intro="Free US shipping over $75 and a 30-night sleep trial." path="/shipping-returns/">
      <div className="prose">
        <p className="notice" role="note"><strong>Draft policy.</strong> Items in <Todo>yellow brackets</Todo> are details the store owner still needs to fill in before launch.</p>
        <h2>Shipping</h2>
        <ul>
          <li><strong>Free US shipping</strong> on orders over $75.</li>
          <li>Orders under $75: shipping is calculated at checkout.</li>
          <li>Processing time: <Todo>processing time, e.g. 1–3 business days</Todo></li>
          <li>Delivery time: <Todo>delivery estimate by region</Todo></li>
          <li>Carriers: <Todo>carrier names</Todo></li>
          <li>We currently ship within the United States. International shipping: <Todo>confirm</Todo></li>
        </ul>
        <p>You will get an email with tracking when your order ships.</p>
        <h2>30-night sleep trial</h2>
        <p>Try your bedding at home for 30 nights. If it is not right for you, contact us within the trial and we will help you return it.</p>
        <ul>
          <li>Condition of returned items: <Todo>e.g. clean, in original packaging</Todo></li>
          <li>Return shipping cost: <Todo>who pays</Todo></li>
          <li>Refund method and timing: <Todo>e.g. original payment method, 5–10 business days</Todo></li>
          <li>Return address: <Todo>return address</Todo></li>
        </ul>
        <h2>Damaged or wrong item</h2>
        <p>If something arrives damaged or is not what you ordered, email <SupportEmail subject="Order problem" /> with your order number and a photo and we will make it right.</p>
        <h2>Cancellations and changes</h2>
        <p>Need to change an order? Contact us as soon as you can at <SupportEmail subject="Change my order" />. Once an order has shipped we cannot change it. <Todo>confirm cancellation window</Todo></p>
        <p>More questions? See the <Link href="/faq/">FAQ</Link> or <Link href="/contact/">contact us</Link>.</p>
      </div>
    </PageShell>
  );
}
