import CartView from '../../components/CartView';

export const metadata = { title: 'Bag', robots: { index: false, follow: true } };

export default function CartPage() {
  return (
    <main>
      <h1 className="page-title">Bag</h1>
      <CartView />
    </main>
  );
}
