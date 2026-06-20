import type { Metadata } from 'next';
import SaleView from '@/components/SaleView';

export const metadata: Metadata = {
  title: 'Sale | Aura Living',
  description: 'Limited-time prices on selected Aura Living pieces — shop the sale before it ends.',
  alternates: { canonical: '/sale' },
  openGraph: {
    title: 'Sale | Aura Living',
    description: 'Limited-time prices on selected Aura Living pieces — shop the sale before it ends.',
    type: 'website',
    images: [{ url: '/og/sale.png', width: 1344, height: 768, alt: 'Sale | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'Sale | Aura Living',
    description: 'Limited-time prices on selected pieces — shop the sale before it ends.',
    images: ['/og/sale.png'] } };

export default function SalePage() {
  return <SaleView />;
}
