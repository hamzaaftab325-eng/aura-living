import type { Metadata } from 'next';
import TrackOrdersView from '@/components/TrackOrdersView';

export const metadata: Metadata = {
  title: 'Track Your Orders',
  description: 'View and track your Aura Living orders.',
  alternates: { canonical: '/account/orders' },
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return <TrackOrdersView />;
}
