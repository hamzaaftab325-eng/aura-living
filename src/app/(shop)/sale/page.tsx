import type { Metadata } from 'next';
import SaleView from '@/components/SaleView';

export const metadata: Metadata = {
  title: 'Sale',
  description: 'Limited-time prices on selected Aura Living pieces — shop the sale before it ends.',
  alternates: { canonical: '/sale' },
};

export default function SalePage() {
  return <SaleView />;
}
