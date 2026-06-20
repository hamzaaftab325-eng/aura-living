import type { Metadata } from 'next';
import WishlistView from '@/components/WishlistView';

export const metadata: Metadata = {
  title: 'Your Wishlist | Aura Living',
  description: 'The pieces you have saved for later.',
  alternates: { canonical: '/wishlist' },
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return <WishlistView />;
}
