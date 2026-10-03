'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  useEffect(() => { setMenu(false); }, [path]);
  useEffect(() => {
    document.body.classList.toggle('menu-open', menu);
    const onKey = (e) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('menu-open'); };
  }, [menu]);

  return (
    <header className="site-header">
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
