import CartView from '../../components/CartView';
import Breadcrumbs from '../../components/Breadcrumbs';
import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({ title: 'Your bag', description: 'Review your BedPrince bag.', path: '/cart/', noindex: true });

export default function CartPage() {
  return (
    <main>
      <div className="container">
        <div className="page-head">
          <Breadcrumbs trail={[{ name: 'Home', path: '/' }, { name: 'Your bag', path: '/cart/' }]} />
          <h1 className="h1">Your bag</h1>
        </div>
        <CartView />
      </div>
    </main>
  );
}
