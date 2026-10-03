'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { clearCart } from '../lib/cart';
import Icon from './Icons';
import Todo from './Todo';
import { store } from '../lib/store';

export default function SuccessView() {
  useEffect(() => { clearCart(); }, []);
  const email = store.supportEmail ? <a href={`mailto:${store.supportEmail}`}>{store.supportEmail}</a> : <Todo>support email</Todo>;
  return (
    <main className="container narrow center page-pad">
      <div className="success-mark"><Icon name="check" size={32} /></div>
      <p className="kicker">Order confirmed</p>
      <h1 className="h1">Thank you for your order.</h1>
      <p className="lede">Your payment went through and your bag has been cleared. A receipt is on its way to the email you used at checkout.</p>
      <ol className="steps">
        <li><span><strong>Check your inbox.</strong> Your payment receipt comes from Stripe. If you do not see it, look in spam.</span></li>
        <li><span><strong>We get your bedding ready.</strong> We will email you when your order ships.</span></li>
        <li><span><strong>Try it for {store.trialNights} nights.</strong> Questions or need to change something? Email {email}.</span></li>
      </ol>
      <div className="row-center">
        <Link className="btn" href="/shop/">Continue shopping</Link>
        <Link className="btn btn-outline" href="/faq/">Read the FAQ</Link>
      </div>
    </main>
  );
}
