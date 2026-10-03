import { money, savePercent } from '../lib/store';

export default function Price({ product, size = '' }) {
  const save = savePercent(product);
  return (
    <span className={`price ${size}`}>
      <span className="price-now">{money(product.price)}</span>
      {product.compareAt ? (
        <>
          <s className="price-was"><span className="sr-only">Was </span>{money(product.compareAt)}</s>
          <span className="price-save">Save {save}%</span>
        </>
      ) : null}
    </span>
  );
}
