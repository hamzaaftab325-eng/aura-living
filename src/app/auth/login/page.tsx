import type { Metadata } from 'next';
import AuthView from '@/components/AuthView';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Aura Living account.',
  alternates: { canonical: '/auth/login' },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthView mode="login" />;
}
