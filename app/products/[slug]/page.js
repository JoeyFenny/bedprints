import { notFound } from 'next/navigation';
import { findProduct, products, categoryOf, store, money } from '../../../lib/store';
import { pageMeta, productLd, breadcrumbLd } from '../../../lib/seo';
import BuyBox from '../../../components/BuyBox';
import Gallery from '../../../components/Gallery';
import Breadcrumbs from '../../../components/Breadcrumbs';
import ProductDetails from '../../../components/ProductDetails';
import ProductCard from '../../../components/ProductCard';
import RecentlyViewed from '../../../components/RecentlyViewed';
import SampleReviews from '../../../components/SampleReviews';
import JsonLd from '../../../components/JsonLd';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) return { title: 'Not found' };
  return pageMeta({ title: p.name, description: `${p.blurb} ${p.options.length > 1 ? `Available in ${p.options.join(', ')}. ` : ''}From ${money(p.price)}. Free US shipping over $75 and a 30-night sleep trial.`, path: `/products/${p.slug}/`, image: p.images[0], type: 'website' });
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();
  const cat = categoryOf(product.categories[0]);
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop/' },
    { name: cat.name, path: `/collections/${cat.slug}/` },
    { name: product.name, path: `/products/${product.slug}/` },
  ];
  const pairs = product.pairsWith.map(findProduct).filter(Boolean);
  return (
    <main>
      <div className="container">
        <Breadcrumbs trail={trail} />
        <div className="product">
          <Gallery images={product.images} name={product.name} />
          <div>
            <BuyBox product={product} />
            <ProductDetails product={product} />
          </div>
        </div>
      </div>
      <section className="section tinted" aria-labelledby="set-h">
        <div className="container">
          <p className="kicker">Complete the set</p>
          <h2 id="set-h" className="h2">Pairs well with</h2>
          <div className="grid grid-3">{pairs.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
        </div>
      </section>
      {store.showSampleReviews ? <SampleReviews heading="Reviews are coming soon" /> : null}
      <RecentlyViewed slug={product.slug} />
      <JsonLd data={productLd(product)} />
      <JsonLd data={breadcrumbLd(trail)} />
    </main>
  );
}
