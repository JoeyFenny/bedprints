import Link from 'next/link';
import { store } from '../lib/store';
import SizeTable from './SizeTable';
import Todo from './Todo';

// Accordion on the product page: details, materials & care, shipping & returns, size guide.
export default function ProductDetails({ product }) {
  const tables = product.sizeGuide === 'sheets' ? ['mattress'] : product.sizeGuide === 'duvet' ? ['duvet'] : product.sizeGuide === 'pillow' ? ['pillow'] : [];
  return (
    <div className="accordion">
      <details open>
        <summary>Details</summary>
        <ul>{product.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
      </details>
      <details>
        <summary>Materials &amp; care</summary>
        <p><strong>Materials:</strong> {product.materials}</p>
        <p>Machine washable. For best results use a gentle cycle in cool water and tumble dry low, and always follow the care label on your item.</p>
      </details>
      <details>
        <summary>Shipping &amp; returns</summary>
        <ul>
          <li>Free US shipping on orders over $75.</li>
          <li>{store.trialNights}-night sleep trial: try it at home.</li>
          <li>Delivery estimate: <Todo>delivery time</Todo></li>
        </ul>
        <p>Full details on the <Link href="/shipping-returns/">Shipping &amp; Returns</Link> page.</p>
      </details>
      {tables.length ? (
        <details>
          <summary>Size guide</summary>
          {product.sizeGuide === 'sheets' ? <p>Fits mattresses up to 16 inches deep. Choose the size that matches your mattress.</p> : null}
          {tables.map((t) => <SizeTable key={t} kind={t} />)}
          <p><Link href="/size-guide/">Full size guide</Link></p>
        </details>
      ) : null}
    </div>
  );
}
