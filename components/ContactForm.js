'use client';

import { useState } from 'react';
import { store } from '../lib/store';

// Builds a mailto: link from the form. Works only once store.supportEmail is set; never claims a message was sent.
export default function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', message: '' });
  const [note, setNote] = useState('');
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  function submit(e) {
    e.preventDefault();
    if (!store.supportEmail) {
      setNote('The contact form will work once a support email is set up. Nothing was sent.');
      return;
    }
    const body = `${v.message}\n\n— ${v.name}${v.email ? ` (${v.email})` : ''}`;
    window.location.href = `mailto:${store.supportEmail}?subject=${encodeURIComponent('BedPrince question')}&body=${encodeURIComponent(body)}`;
    setNote('Opening your email app. Please press send there to deliver your message.');
  }
  return (
    <form onSubmit={submit} className="contact-form">
      <div className="field"><label htmlFor="c-name">Name</label><input id="c-name" required autoComplete="name" value={v.name} onChange={set('name')} /></div>
      <div className="field"><label htmlFor="c-email">Your email</label><input id="c-email" type="email" required autoComplete="email" value={v.email} onChange={set('email')} /></div>
      <div className="field"><label htmlFor="c-msg">How can we help?</label><textarea id="c-msg" required rows={5} value={v.message} onChange={set('message')} /></div>
      <button type="submit" className="btn">Write us an email</button>
      <p className="fine" role="status">{note || 'This opens your email app with your message ready to send.'}</p>
    </form>
  );
}
