import type { Metadata } from 'next';
import LookbookView from '@/components/LookbookView';

export const metadata: Metadata = {
  title: 'The Lookbook',
  description: 'Styled room scenes and mood boards featuring Aura Living pieces — inspiration for every corner of your home.',
  alternates: { canonical: '/lookbook' },
};

export default function LookbookPage() {
  return <LookbookView />;
}
