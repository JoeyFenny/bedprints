'use client';

import { useRef, useState } from 'react';
import { smallImage } from '../lib/store';
import Icon from './Icons';

// Phones (<=860px): edge-to-edge swipeable gallery (CSS scroll-snap) with dots and a counter.
// Desktop: thumbnails + main image; click (or Enter) toggles 2x zoom, move the pointer to pan.
export default function Gallery({ images, name }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [s, setS] = useState(0); // swipe position
  const track = useRef(null);
  const label = (n) => (n === 0 ? name : `${name}, view ${n + 1}`);
  const sizes = '(min-width: 861px) 52vw, 100vw';

  function move(e) {
    if (!zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  }
  function onScroll(e) {
    const el = e.currentTarget;
    const n = Math.round(el.scrollLeft / (el.clientWidth || 1));
    if (n !== s) setS(n);
  }
  function go(n) {
    const el = track.current;
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  }
  return (
    <div className="pdp-gallery">
      <div className="pdp-swipe" role="group" aria-roledescription="carousel" aria-label={`${name} photos`}>
        <div className="swipe-track" ref={track} onScroll={onScroll}>
          {images.map((src, n) => (
            <img key={src} src={src} srcSet={`${smallImage(src)} 640w, ${src} 1200w`} sizes={sizes} alt={label(n)} width="1200" height="1200" loading={n === 0 ? 'eager' : 'lazy'} fetchPriority={n === 0 ? 'high' : undefined} decoding="async" />
          ))}
        </div>
        {images.length > 1 ? (
          <>
            <span className="swipe-count" aria-hidden="true">{s + 1} / {images.length}</span>
            <div className="swipe-dots">
              {images.map((src, n) => (
                <button key={src} type="button" aria-label={`Show photo ${n + 1} of ${images.length}`} aria-current={n === s} onClick={() => go(n)}><span /></button>
              ))}
            </div>
          </>
        ) : null}
      </div>
      <div className="pdp-desk">
        <div className="thumbs" role="group" aria-label="Product images">
          {images.map((src, n) => (
            <button key={src} type="button" aria-current={n === i} aria-label={`Show image ${n + 1} of ${images.length}`} onClick={() => { setI(n); setZoom(false); }}>
              <img src={smallImage(src)} alt="" width="76" height="76" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
        <button type="button" className={`zoom${zoom ? ' on' : ''}`} onClick={() => setZoom(!zoom)} onMouseMove={move} onMouseLeave={() => setZoom(false)} aria-label={zoom ? 'Zoom out' : 'Zoom in on image'}>
          <img src={images[i]} srcSet={`${smallImage(images[i])} 640w, ${images[i]} 1200w`} sizes={sizes} alt={label(i)} width="1200" height="1200" loading={i === 0 ? 'eager' : undefined} fetchPriority={i === 0 ? 'high' : undefined} decoding="async" style={zoom ? { transform: 'scale(2)', transformOrigin: origin } : undefined} />
          {!zoom ? <span className="zoom-hint"><Icon name="zoom" size={16} /> Zoom</span> : null}
        </button>
      </div>
    </div>
  );
}
