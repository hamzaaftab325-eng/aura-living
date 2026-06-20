import type { Metadata } from 'next';
import FAQView from '@/components/FAQView';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers to common questions about orders, shipping, returns, products, payment, and the Aura Rewards program.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions',
    description:
      'Answers to common questions about orders, shipping, returns, products, payment, and the Aura Rewards program.',
  },
};

export default function FAQPage() {
  return <FAQView />;
}
