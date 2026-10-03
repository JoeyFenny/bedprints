import SuccessView from '../../components/SuccessView';
import { pageMeta } from '../../lib/seo';

export const metadata = pageMeta({ title: 'Order confirmed', description: 'Thank you for your BedPrince order.', path: '/success/', noindex: true });

export default function Success() {
  return <SuccessView />;
}
