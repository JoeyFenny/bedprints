import Icon from '../Icons';

const items = [
  ['truck', 'Free US shipping', 'on orders over $75'],
  ['moon', '30-night sleep trial', 'try it at home'],
  ['leaf', 'Made from bamboo viscose', 'soft and breathable'],
  ['lock', 'Secure checkout', 'payments by Stripe'],
];

export default function TrustBar() {
  return (
    <section className="trustbar" aria-label="Why shop with us">
      <ul className="container">
        {items.map(([icon, t, s]) => (
          <li key={t}><Icon name={icon} size={28} /><span><strong>{t}</strong><small>{s}</small></span></li>
        ))}
      </ul>
    </section>
  );
}
