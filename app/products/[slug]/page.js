import { notFound } from 'next/navigation';
import { findProduct, products } from '../../../lib/store';
import BuyBox from '../../../components/BuyBox';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const product = findProduct(params.slug);
  return product ? { title: product.name, description: product.blurb, openGraph: { title: product.name, description: product.blurb, images: product.images.slice(0, 1) } } : { title: 'Not found' };
}

export default function ProductPage({ params }) {
  const product = findProduct(params.slug);
  if (!product) notFound();
  return (
    <main className="product">
      <div className="gallery">
        {product.images.map((src, i) => (
          <img key={src} src={src} alt={i === 0 ? product.name : `${product.name}, detail ${i}`} />
        ))}
      </div>
      <BuyBox product={product} />
    </main>
  );
}
