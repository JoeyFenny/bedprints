import { store } from '../lib/store';
import Todo from './Todo';

// Renders the support email as a mailto link, or a visible placeholder until store.supportEmail is set.
export function SupportEmail({ subject }) {
  if (!store.supportEmail) return <Todo>support email</Todo>;
  const href = `mailto:${store.supportEmail}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  return <a href={href}>{store.supportEmail}</a>;
}
