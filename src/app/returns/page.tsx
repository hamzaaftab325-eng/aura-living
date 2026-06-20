import type { Metadata } from 'next';
import ReturnsView from '@/components/ReturnsView';

// Revalidate every 24 hours
export const revalidate = 86400;


export const metadata: Metadata = {
  title: 'Returns & Exchanges | Aura Living',
  description:
    '14-day return window, easy exchanges, refunds in 5–7 business days. Read our full returns policy.',
  alternates: { canonical: '/returns' },
  openGraph: {
    title: 'Returns & Exchanges | Aura Living',
    description: '14-day return window, easy exchanges, refunds in 5–7 business days.',
    type: 'website',
    images: [{ url: '/og/returns.png', width: 1344, height: 768, alt: 'Returns & Exchanges | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'Returns & Exchanges | Aura Living',
    description: '14-day return window, easy exchanges, fast refunds.',
    images: ['/og/returns.png'] } };

export default function ReturnsPage() {
  return <ReturnsView />;
}
