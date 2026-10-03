import { sizeTables } from '../lib/content';

export default function SizeTable({ kind }) {
  const t = sizeTables[kind];
  if (!t) return null;
  return (
    <div className="table-wrap">
      <table className="table">
        <caption>{t.caption}</caption>
        <thead><tr>{t.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{t.rows.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th>{r.slice(1).map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
