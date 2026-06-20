import type { Metadata } from 'next';
import CareGuideView from '@/components/CareGuideView';

// Revalidate every 24 hours
export const revalidate = 86400;


export const metadata: Metadata = {
  title: 'Care Guide | Aura Living',
  description:
    'Keep your Aura Living pieces looking their best — care tips for lighting, plants, vases, candles, wall art, and kitchenware.',
  alternates: { canonical: '/care-guide' },
  openGraph: {
    title: 'Care Guide | Aura Living',
    description: 'Keep your Aura Living pieces looking their best — care tips for every product category.',
    type: 'website',
    images: [{ url: '/og/care-guide.png', width: 1344, height: 768, alt: 'Care Guide | Aura Living' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Care Guide | Aura Living',
    description: 'Care tips for lighting, plants, vases, candles, wall art, and kitchenware.',
    images: ['/og/care-guide.png'],
  },
};

export default function CareGuidePage() {
  return <CareGuideView />;
}
