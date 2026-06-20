import type { Metadata } from 'next';
import NewArrivalsView from '@/components/NewArrivalsView';

export const metadata: Metadata = {
  title: 'New Arrivals',
  description: 'Fresh additions to the Aura Living collection — newly crafted pieces for the modern Pakistani home.',
  alternates: { canonical: '/new-arrivals' },
};

export default function NewArrivalsPage() {
  return <NewArrivalsView />;
}
