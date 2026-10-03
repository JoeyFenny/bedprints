'use client';

import { useState } from 'react';
import { smallImage } from '../lib/store';
import Icon from './Icons';

// Thumbnails + main image. Click (or Enter) toggles 2x zoom; move the pointer to pan.
export default function Gallery({ images, name }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const label = (n) => (n === 0 ? name : `${name}, view ${n + 1}`);

  function move(e) {
    if (!zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  }
  return (
    <div className="pdp-gallery">
      <div className="thumbs" role="group" aria-label="Product images">
        {images.map((src, n) => (
          <button key={src} type="button" aria-current={n === i} aria-label={`Show image ${n + 1} of ${images.length}`} onClick={() => { setI(n); setZoom(false); }}>
            <img src={smallImage(src)} alt="" width="76" height="76" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <button type="button" className={`zoom${zoom ? ' on' : ''}`} onClick={() => setZoom(!zoom)} onMouseMove={move} onMouseLeave={() => setZoom(false)} aria-label={zoom ? 'Zoom out' : 'Zoom in on image'}>
        <img src={images[i]} srcSet={`${smallImage(images[i])} 640w, ${images[i]} 1200w`} sizes="(min-width: 861px) 52vw, 100vw" alt={label(i)} width="1200" height="1200" fetchPriority={i === 0 ? 'high' : undefined} decoding="async" style={zoom ? { transform: 'scale(2)', transformOrigin: origin } : undefined} />
        {!zoom ? <span className="zoom-hint"><Icon name="zoom" size={16} /> Zoom</span> : null}
      </button>
    </div>
  );
}
