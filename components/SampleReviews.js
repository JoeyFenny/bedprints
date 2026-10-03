import { sampleReviews } from '../lib/content';

// Placeholder reviews. Clearly labelled; no names and no star counts so nothing reads as real customer feedback.
export default function SampleReviews({ heading = 'What customers will say here' }) {
  return (
    <section className="section" aria-labelledby="reviews-h">
      <div className="container">
        <p className="kicker">Reviews</p>
        <h2 id="reviews-h" className="h2">{heading}</h2>
        <p className="notice" role="note"><strong>Placeholder content.</strong> These are sample reviews that show the layout. They are not from real customers. Real reviews will replace them after launch.</p>
        <div className="grid grid-3">
          {sampleReviews.map((r) => (
            <figure key={r.title} className="review">
              <span className="badge badge-muted">Sample review</span>
              <figcaption><strong>{r.title}</strong></figcaption>
              <blockquote>{r.body}</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
