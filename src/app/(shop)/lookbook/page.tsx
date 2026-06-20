import type { Metadata } from 'next';
import LookbookView from '@/components/LookbookView';

export const metadata: Metadata = {
  title: 'The Lookbook | Aura Living',
  description: 'Styled room scenes and mood boards featuring Aura Living pieces — inspiration for every corner of your home.',
  alternates: { canonical: '/lookbook' },
  openGraph: {
    title: 'The Lookbook | Aura Living',
    description: 'Styled room scenes and mood boards featuring Aura Living pieces.',
    type: 'website',
    images: [{ url: '/og/lookbook.png', width: 1344, height: 768, alt: 'The Lookbook | Aura Living' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Lookbook | Aura Living',
    description: 'Styled room scenes and mood boards featuring Aura Living pieces.',
    images: ['/og/lookbook.png'],
  },
};

export default function LookbookPage() {
  return <LookbookView />;
}
