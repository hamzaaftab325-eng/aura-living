import type { Metadata } from 'next';
import ShippingView from '@/components/ShippingView';

export const metadata: Metadata = {
  title: 'Shipping Information | Aura Living',
  description:
    'Delivery options across Pakistan — Standard, Express, and Same-Day Lahore. Free shipping on orders over PKR 2,999.',
  alternates: { canonical: '/shipping' },
};

export default function ShippingPage() {
  return <ShippingView />;
}
