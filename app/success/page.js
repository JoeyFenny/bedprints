'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { clearCart } from '../../lib/cart';

export default function Success() {
  useEffect(() => { clearCart(); }, []);
  return (
    <main>
      <p className="kicker">Order</p>
      <h1>Payment received.</h1>
      <p>Thank you for your order. A receipt is on its way to your inbox, and we will email you when your bedding ships.</p>
      <Link className="btn" href="/products">Back to shop</Link>
    </main>
  );
}
