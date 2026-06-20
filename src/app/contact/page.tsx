import type { Metadata } from 'next';
import ContactView from '@/components/ContactView';

export const metadata: Metadata = {
  title: 'Get in Touch | Aura Living',
  description:
    'Questions about an order, a product, or a custom commission? Reach the Aura Living team in Lahore, Pakistan.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Get in Touch | Aura Living',
    description:
      'Reach the Aura Living team in Lahore, Pakistan.',
  },
};

export default function ContactPage() {
  return <ContactView />;
}
