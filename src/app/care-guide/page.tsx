import type { Metadata } from 'next';
import CareGuideView from '@/components/CareGuideView';

export const metadata: Metadata = {
  title: 'Care Guide',
  description:
    'Keep your Aura Living pieces looking their best — care tips for lighting, plants, vases, candles, wall art, and kitchenware.',
  alternates: { canonical: '/care-guide' },
};

export default function CareGuidePage() {
  return <CareGuideView />;
}
