import type { Metadata } from 'next';
import NewArrivalsView from '@/components/NewArrivalsView';

export const metadata: Metadata = {
  title: 'New Arrivals | Aura Living',
  description: 'Fresh additions to the Aura Living collection — newly crafted pieces for the modern Pakistani home.',
  alternates: { canonical: '/new-arrivals' },
  openGraph: {
    title: 'New Arrivals | Aura Living',
    description: 'Fresh additions to the Aura Living collection — newly crafted pieces for the modern Pakistani home.',
    type: 'website',
    images: [{ url: '/og/new-arrivals.png', width: 1344, height: 768, alt: 'New Arrivals | Aura Living' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Arrivals | Aura Living',
    description: 'Fresh additions to the Aura Living collection.',
    images: ['/og/new-arrivals.png'],
  },
};

export default function NewArrivalsPage() {
  return <NewArrivalsView />;
}
