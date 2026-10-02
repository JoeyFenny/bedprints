'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { store } from '../lib/store';
import { readCart } from '../lib/cart';

export default function Header() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sync = () => setCount(readCart().reduce((n, i) => n + i.qty, 0));
    sync();
    window.addEventListener('cart', sync);
    return () => window.removeEventListener('cart', sync);
  }, []);
  return (
    <header className="top">
      <Link href="/" className="logo">{store.name}</Link>
      <nav>
        <Link href="/products">Shop</Link>
        <Link href="/cart">Bag{count ? ` (${count})` : ''}</Link>
      </nav>
    </header>
  );
}
