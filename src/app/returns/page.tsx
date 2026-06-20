import type { Metadata } from 'next';
import ReturnsView from '@/components/ReturnsView';

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Aura Living',
  description:
    '14-day return window, easy exchanges, refunds in 5–7 business days. Read our full returns policy.',
  alternates: { canonical: '/returns' },
};

export default function ReturnsPage() {
  return <ReturnsView />;
}
