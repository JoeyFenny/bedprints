import { pageMeta } from '../../lib/seo';
import PageShell from '../../components/PageShell';
import Todo from '../../components/Todo';
import { SupportEmail } from '../../components/Contact';

export const metadata = pageMeta({ title: 'Privacy policy', description: 'How BedPrince handles your information.', path: '/privacy/' });

export default function Privacy() {
  return (
    <PageShell title="Privacy policy" kicker="Legal" intro="What we collect, why, and the choices you have." path="/privacy/">
      <div className="prose">
        <p className="notice" role="note"><strong>Draft, not legal advice.</strong> Have this reviewed before launch. <Todo>effective date</Todo></p>
        <h2>Information we handle</h2>
        <ul>
          <li><strong>Orders.</strong> When you check out, Stripe collects your payment details, email and shipping address. Card details go to Stripe and never touch this site. We receive the order details we need to fulfil it.</li>
          <li><strong>Your bag.</strong> Your bag, order note and recently viewed products are saved in your browser’s local storage on your device. We do not receive them until you check out.</li>
          <li><strong>Messages.</strong> If you email us, we keep your message to reply to you.</li>
          <li><strong>Email list.</strong> Email signup is not open yet. When it is, we will say what we collect and how to unsubscribe.</li>
        </ul>
        <h2>Cookies and analytics</h2>
        <p>This site does not set tracking cookies of its own. <Todo>update if analytics or ads are added</Todo></p>
        <h2>Service providers</h2>
        <p>We use Stripe to process payments and Cloudflare to host this site. They process data under their own privacy policies.</p>
        <h2>Your choices</h2>
        <p>You can clear local storage in your browser at any time. To ask about or delete information we hold about you, email <SupportEmail subject="Privacy request" />.</p>
        <h2>Contact</h2>
        <p>Business name and address: <Todo>legal business name and address</Todo></p>
      </div>
    </PageShell>
  );
}
