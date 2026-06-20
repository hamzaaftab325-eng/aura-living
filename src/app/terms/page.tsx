import type { Metadata } from 'next';
import TermsView from '@/components/TermsView';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing the use of auraliving.com and purchases made on the Aura Living store.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return <TermsView />;
}
