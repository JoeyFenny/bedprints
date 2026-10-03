import Link from 'next/link';
import { store } from '../lib/store';

export default function AnnouncementBar() {
  return (
    <div className="announce" role="region" aria-label="Announcement">
      <p>{store.announcement} <Link href="/shipping-returns/">Details</Link></p>
    </div>
  );
}
