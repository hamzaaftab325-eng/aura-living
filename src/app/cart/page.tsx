import type { Metadata } from 'next';
import CartView from '@/components/CartView';

export const metadata: Metadata = {
  title: 'Your Cart | Aura Living',
  description: 'Review the items in your shopping cart before checking out.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: false } };

export default function CartPage() {
  return <CartView />;
}
