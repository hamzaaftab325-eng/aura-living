import type { Metadata } from 'next';
import FAQView from '@/components/FAQView';

// Revalidate every 24 hours
export const revalidate = 86400;


export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Aura Living',
  description:
    'Answers to common questions about orders, shipping, returns, products, payment, and the Aura Rewards program.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions | Aura Living',
    description: 'Answers about orders, shipping, returns, products, payment, and the Aura Rewards program.',
    type: 'website',
    images: [{ url: '/og/faq.png', width: 1344, height: 768, alt: 'FAQ | Aura Living' }] },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | Aura Living',
    description: 'Answers about orders, shipping, returns, products, payment, and rewards.',
    images: ['/og/faq.png'] } };

export default function FAQPage() {
  return <FAQView />;
}
