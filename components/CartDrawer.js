'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../lib/useCart';
import { usePathname } from 'next/navigation';
import CheckoutPanel from './CheckoutPanel';
import Icon from './Icons';

export default function CartDrawer() {
  const { items, ready, count, subtotal } = useCart();
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const lastFocus = useRef(null);
  const path = usePathname();

  useEffect(() => {
    const show = () => { lastFocus.current = document.activeElement; setOpen(true); };
    window.addEventListener('cart:open', show);
    return () => window.removeEventListener('cart:open', show);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => panel.current && panel.current.querySelector('button, a')?.focus(), 30);
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab' && panel.current) { // keep focus inside the dialog
        const f = [...panel.current.querySelectorAll('a[href], button:not([disabled]), input, textarea')];
        if (!f.length) return;
        const first = f[0]; const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <div className={`drawer-root${open ? ' open' : ''}`} aria-hidden={!open}>
      <div className="drawer-overlay" onClick={close} />
      <aside ref={panel} className="drawer" role="dialog" aria-modal="true" aria-label="Shopping bag" tabIndex={-1} inert={!open}>
        <header className="drawer-head">
          <h2>Your bag{ready && count ? <span> ({count})</span> : null}</h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close bag"><Icon name="close" /></button>
        </header>
        {ready && items.length ? (
          <CheckoutPanel items={items} subtotal={subtotal} compact onNavigate={close} showViewBag />
        ) : (
          <div className="drawer-empty">
            <p>Your bag is empty.</p>
            <Link href="/shop/" className="btn" onClick={close}>Shop bamboo bedding</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
