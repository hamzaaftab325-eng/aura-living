import type { Metadata } from 'next';
import ShopView from '@/components/ShopView';

export const metadata: Metadata = {
  title: 'Shop All Home Decor',
  description:
    'Browse our full collection of handcrafted lamps, vases, candles, planters, wall art, and tableware — delivered across Pakistan.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop All Home Decor',
    description:
      'Handcrafted lamps, vases, candles, planters, wall art, and tableware — delivered across Pakistan.',
  },
};

export default function ShopPage() {
  return <ShopView />;
}
