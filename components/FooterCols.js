'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Footer link columns. On phones each column is an accordion (a long footer is the last thing a thumb wants to scroll);
// from 861px up they are plain headings with the links always visible (CSS shows the lists regardless of state).
export default function FooterCols({ cols }) {
  const [open, setOpen] = useState(-1);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)');
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return cols.map((c, i) => {
    const id = `footer-col-${i}`;
    const isOpen = open === i;
    return (
      <nav key={c.title} aria-label={c.title} className={`footer-col${isOpen ? ' open' : ''}`}>
        {wide ? <h2 className="footer-h">{c.title}</h2> : (
          <h2 className="footer-h">
            <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? -1 : i)}>
              {c.title}<span className="chev" aria-hidden="true" />
            </button>
          </h2>
        )}
        <ul id={id}>{c.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
      </nav>
    );
  });
}
