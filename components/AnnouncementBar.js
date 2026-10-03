import Link from 'next/link';
import { store } from '../lib/store';

// The whole line is one link to the policy page (bigger tap target than a tiny "Details" link, and it
// stays on one line on phones).
export default function AnnouncementBar() {
  return (
    <div className="announce" role="region" aria-label="Announcement">
      <p><Link href="/shipping-returns/">{store.announcement} <span className="announce-more">Details</span></Link></p>
    </div>
  );
}
