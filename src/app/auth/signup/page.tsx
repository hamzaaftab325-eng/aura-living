import type { Metadata } from 'next';
import AuthView from '@/components/AuthView';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create an Aura Living account to track orders, save addresses, and earn rewards.',
  alternates: { canonical: '/auth/signup' },
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <AuthView mode="signup" />;
}
