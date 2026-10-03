import Link from 'next/link';

export default function Logo({ light = false }) {
  return (
    <Link href="/" className={`logo${light ? ' light' : ''}`} aria-label="BedPrince home">
      <svg className="logo-mark" width="26" height="26" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 22V10m0 0h5a3 3 0 0 1 0 6H9m0 0h6a3.200 3.200 0 0 1 0 6.400H9" fill="none" stroke="#c8b273" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo-word">Bed<span>Prince</span></span>
    </Link>
  );
}
