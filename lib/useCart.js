'use client';

import { useEffect, useState } from 'react';
import { readCart, hydrate, cartCount, cartSubtotal } from './cart';

// Live cart from localStorage. `ready` is false until the first client read (avoids hydration mismatch).
export function useCart() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => { setItems(hydrate(readCart())); setReady(true); };
    sync();
    window.addEventListener('cart', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('cart', sync); window.removeEventListener('storage', sync); };
  }, []);
  return { items, ready, count: cartCount(items), subtotal: cartSubtotal(items) };
}
