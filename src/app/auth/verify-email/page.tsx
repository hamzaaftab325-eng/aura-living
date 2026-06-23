import type { Metadata } from 'next';
import VerifyEmailView from '@/components/VerifyEmailView';

export const metadata: Metadata = {
  title: 'Verify Your Email | Aura Living',
  description: 'Verify your email address to activate your Aura Living account.',
  alternates: { canonical: '/auth/verify-email' },
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return <VerifyEmailView />;
}
