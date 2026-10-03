import { notFound } from 'next/navigation';
import { categories, categoryOf } from '../../../lib/store';
import { pageMeta, breadcrumbLd } from '../../../lib/seo';
import ShopGrid from '../../../components/ShopGrid';
import Breadcrumbs from '../../../components/Breadcrumbs';
import JsonLd from '../../../components/JsonLd';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const c = categoryOf(category);
  if (!c) return { title: 'Not found' };
  return pageMeta({ title: `Bamboo ${c.name.toLowerCase()}`, description: `${c.blurb} Free US shipping over $75 and a 30-night sleep trial.`, path: `/collections/${c.slug}/`, image: c.image });
}

export default async function Collection({ params }) {
  const { category } = await params;
  const c = categoryOf(category);
  if (!c) notFound();
  const trail = [{ name: 'Home', path: '/' }, { name: 'Shop', path: '/shop/' }, { name: c.name, path: `/collections/${c.slug}/` }];
  return (
    <main>
      <div className="collection-head">
        <div className="container">
          <Breadcrumbs trail={trail} />
          <h1 className="h1">Bamboo {c.name.toLowerCase()}</h1>
          <p className="lede">{c.blurb}</p>
        </div>
      </div>
      <div className="container shop-body"><ShopGrid initialCategory={c.slug} /></div>
      <JsonLd data={breadcrumbLd(trail)} />
    </main>
  );
}
