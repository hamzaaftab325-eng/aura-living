import type { Metadata } from 'next';
import ContactView from '@/components/ContactView';

export const metadata: Metadata = {
  title: 'Get in Touch | Aura Living',
  description:
    'Questions about an order, a product, or a custom commission? Reach the Aura Living team in Lahore, Pakistan.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Get in Touch | Aura Living',
    description: 'Reach the Aura Living team in Lahore, Pakistan.',
    type: 'website',
    images: [{ url: '/og/contact.png', width: 1344, height: 768, alt: 'Get in Touch | Aura Living' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get in Touch | Aura Living',
    description: 'Reach the Aura Living team in Lahore, Pakistan.',
    images: ['/og/contact.png'],
  },
};

export default function ContactPage() {
  return <ContactView />;
}
