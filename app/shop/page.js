import { pageMeta, breadcrumbLd } from '../../lib/seo';
import ShopGrid from '../../components/ShopGrid';
import Breadcrumbs from '../../components/Breadcrumbs';
import JsonLd from '../../components/JsonLd';

export const metadata = pageMeta({
  title: 'Shop bamboo bedding',
  description: 'Shop bamboo viscose sheet sets, pillowcases, duvet covers, pillows, comforters and throw blankets. Free US shipping over $75 and a 30-night sleep trial.',
  path: '/shop/',
});

const trail = [{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop/' }];

export default function Shop() {
  return (
    <main>
      <div className="collection-head">
        <div className="container">
          <Breadcrumbs trail={trail} />
          <h1 className="h1">Shop bamboo bedding</h1>
          <p className="lede">Sheets, pillows and blankets made from bamboo viscose, designed to sleep cool.</p>
        </div>
      </div>
      <div className="container shop-body"><ShopGrid /></div>
      <JsonLd data={breadcrumbLd(trail)} />
    </main>
  );
}
