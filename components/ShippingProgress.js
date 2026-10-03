import { store, money } from '../lib/store';

export default function ShippingProgress({ subtotal }) {
  const t = store.freeShippingThreshold;
  const left = Math.max(0, t - subtotal);
  const pct = Math.min(100, Math.round((subtotal / t) * 100));
  return (
    <div className="ship-progress">
      <p>{left > 0 ? <>You are <strong>{money(left)}</strong> away from free US shipping.</> : <><strong>You have unlocked free US shipping.</strong></>}</p>
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Progress to free shipping"><span style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
