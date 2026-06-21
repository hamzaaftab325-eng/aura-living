import type { Metadata } from 'next';
import TermsView from '@/components/TermsView';

// Revalidate every 720 hours
export const revalidate = 2592000;


export const metadata: Metadata = {
  title: 'Terms of Service | Aura Living',
  description: 'Terms governing the use of auraliving.com and purchases made on the Aura Living store.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service | Aura Living',
    description: 'Terms governing the use of auraliving.com and purchases made on the Aura Living store.',
    type: 'article',
    images: [{ url: '/og/terms.png', width: 1344, height: 768, alt: 'Terms of Service | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Aura Living',
    description: 'Terms governing the use of auraliving.com.',
    images: ['/og/terms.png'] } };

export default function TermsPage() {
  return <TermsView />;
}
