import type { Metadata } from 'next';
import AddressesView from '@/components/AddressesView';

export const metadata: Metadata = {
  title: 'Saved Addresses | Aura Living',
  description: 'Manage your shipping and billing addresses.',
  alternates: { canonical: '/account/addresses' },
  robots: { index: false, follow: false },
};

export default function AddressesPage() {
  return <AddressesView />;
}
