import NewsletterForm from '../NewsletterForm';

export default function EmailCapture() {
  return (
    <section className="section email" aria-labelledby="email-h">
      <div className="container narrow center">
        <p className="kicker light">Stay in the loop</p>
        <h2 id="email-h" className="h2">New arrivals and sleep tips</h2>
        <p className="lede light">Join the list for launches and the occasional offer.</p>
        <NewsletterForm />
      </div>
    </section>
  );
}
