// Native <details> accordion: keyboard accessible, no JS.
export default function FaqList({ items }) {
  return (
    <div className="accordion">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
