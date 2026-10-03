import { benefits, comparison } from '../../lib/content';
import Icon from '../Icons';

export default function WhyBamboo() {
  return (
    <>
      <section className="section dark" aria-labelledby="why-h">
        <div className="container">
          <p className="kicker light">Why bamboo</p>
          <h2 id="why-h" className="h2">Bedding that is easy to sleep in</h2>
          <div className="grid grid-4">
            {benefits.map((b) => (
              <div key={b.title} className="benefit">
                <Icon name={b.icon} size={32} />
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="cmp-h">
        <div className="container narrow-lg">
          <p className="kicker">Bamboo vs cotton</p>
          <h2 id="cmp-h" className="h2">How bamboo viscose compares</h2>
          <div className="table-wrap">
            <table className="table stack">
              <caption className="sr-only">Comparison of bamboo viscose and typical cotton bedding</caption>
              <thead><tr>{comparison.head.map((h, i) => <th key={i} scope="col">{h || <span className="sr-only">Feature</span>}</th>)}</tr></thead>
              <tbody>
                {comparison.rows.map(([a, b, c]) => <tr key={a}><th scope="row">{a}</th><td data-label={comparison.head[1]}>{b}</td><td data-label={comparison.head[2]}>{c}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="fine">{comparison.note}</p>
        </div>
      </section>
    </>
  );
}
