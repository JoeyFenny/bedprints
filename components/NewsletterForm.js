'use client';

import { useId, useState } from 'react';
import { store } from '../lib/store';

// No backend yet. With store.newsletterUrl set it posts to that endpoint; otherwise it says plainly
// that signup is not open, and nothing is sent or stored.
export default function NewsletterForm({ tone = 'dark' }) {
  const id = useId();
  const [msg, setMsg] = useState('');
  const live = Boolean(store.newsletterUrl);
  function onSubmit(e) {
    if (live) return;
    e.preventDefault();
    setMsg('Email signup is not open yet. This form is not connected to a mailing list, so nothing was saved. Please check back soon.');
  }
  return (
    <form className={`newsletter ${tone}`} onSubmit={onSubmit} {...(live ? { action: store.newsletterUrl, method: 'post' } : {})} noValidate={!live}>
      <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
      <input id={`${id}-email`} name="email" type="email" required placeholder="Email address" autoComplete="email" />
      <button type="submit" className="btn btn-accent">Subscribe</button>
      <p className="fine" role="status">{msg || (live ? 'Occasional news and offers. Unsubscribe anytime.' : 'Email signup is coming soon.')}</p>
    </form>
  );
}
