import type { Metadata } from 'next';
import ShippingView from '@/components/ShippingView';

// Revalidate every 24 hours
export const revalidate = 86400;


export const metadata: Metadata = {
  title: 'Shipping Information | Aura Living',
  description:
    'Delivery options across Pakistan — Standard, Express, and Same-Day Lahore. Free shipping on orders over PKR 2,999.',
  alternates: { canonical: '/shipping' },
  openGraph: {
    title: 'Shipping Information | Aura Living',
    description: 'Standard, Express, and Same-Day delivery across Pakistan. Free shipping over PKR 2,999.',
    type: 'website',
    images: [{ url: '/og/shipping.png', width: 1344, height: 768, alt: 'Shipping Information | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipping Information | Aura Living',
    description: 'Standard, Express, and Same-Day delivery across Pakistan. Free shipping over PKR 2,999.',
    images: ['/og/shipping.png'] } };

export default function ShippingPage() {
  return <ShippingView />;
}
