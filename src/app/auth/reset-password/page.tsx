import type { Metadata } from 'next';
import ResetPasswordView from '@/components/ResetPasswordView';

export const metadata: Metadata = {
  title: 'Reset Password | Aura Living',
  description: 'Set a new password for your Aura Living account.',
  alternates: { canonical: '/auth/reset-password' },
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
