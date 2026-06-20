import type { Metadata } from 'next';
import ForgotPasswordView from '@/components/ForgotPasswordView';

export const metadata: Metadata = {
  title: 'Reset Your Password',
  description: 'Request a password reset link for your Aura Living account.',
  alternates: { canonical: '/auth/forgot-password' },
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
