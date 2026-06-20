import type { Metadata } from 'next';
import CheckoutView from '@/components/CheckoutView';

export const metadata: Metadata = {
  title: 'Checkout | Aura Living',
  description: 'Complete your purchase securely with COD, JazzCash, or EasyPaisa.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
