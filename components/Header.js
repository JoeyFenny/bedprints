'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { openCart } from '../lib/cart';
import { useCart } from '../lib/useCart';
import Logo from './Logo';
import Icon from './Icons';

export const NAV = [
  { href: '/shop/', label: 'Shop' },
  { href: '/collections/sheets/', label: 'Sheets' },
  { href: '/collections/pillows/', label: 'Pillows' },
  { href: '/collections/blankets/', label: 'Blankets' },
  { href: '/about/', label: 'About' },
  { href: '/faq/', label: 'FAQ' },
];

export default function Header() {
  const { count, ready } = useCart();
  const [menu, setMenu] = useState(false);
  const path = usePathname();
  const header = useRef(null);
  useEffect(() => { setMenu(false); }, [path]);
  // Phones: the header slides away when scrolling down and returns on any upward scroll (more room to read, still one flick from the bag).
  useEffect(() => {
    let last = window.scrollY; let ticking = false;
    const run = () => {
      ticking = false;
      const el = header.current; if (!el) return;
      const y = Math.max(0, window.scrollY); const d = y - last;
      if (document.body.classList.contains('menu-open')) { el.classList.remove('hide'); last = y; return; }
      if (y < 80 || d < -6) el.classList.remove('hide');
      else if (d > 8) el.classList.add('hide');
      if (Math.abs(d) > 6 || y < 80) last = y;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('menu-open', menu);
    // The mobile menu is position:fixed below the header; measure instead of guessing the announcement height.
    const place = () => { if (header.current) document.documentElement.style.setProperty('--menu-top', `${Math.round(header.current.getBoundingClientRect().bottom)}px`); };
    if (menu) { place(); window.addEventListener('resize', place); }
    const onKey = (e) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', place); document.body.classList.remove('menu-open'); };
  }, [menu]);

  return (
    <header className="site-header" ref={header}>
      <div className="header-inner">
        <button type="button" className="icon-btn menu-btn" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="primary-nav" onClick={() => setMenu(!menu)}>
          <Icon name={menu ? 'close' : 'menu'} />
        </button>
        <Logo />
        <nav id="primary-nav" className={`primary-nav${menu ? ' open' : ''}`} aria-label="Primary">
          {NAV.map((n) => {
            const current = path === n.href || (n.href !== '/shop/' && path.startsWith(n.href)) ? 'page' : undefined;
            return <Link key={n.href} href={n.href} aria-current={current}>{n.label}</Link>;
          })}
        </nav>
        <button type="button" className="icon-btn cart-btn" onClick={openCart} aria-label={`Open bag${ready && count ? `, ${count} item${count > 1 ? 's' : ''}` : ''}`}>
          <Icon name="bag" />
          {ready && count ? <span className="cart-count" aria-hidden="true">{count}</span> : null}
        </button>
      </div>
    </header>
  );
}
