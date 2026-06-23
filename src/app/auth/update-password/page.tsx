'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/lib/auth/actions';
import PremiumButton from '@/components/ui/PremiumButton';
import Input from '@/components/ui/Input';
import { Lock, CheckCircle2 } from 'lucide-react';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('password', password);

    const result = await updatePassword(formData);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push('/account'), 2000);
    } else {
      setError(result.error || 'Failed to update password.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 aura-bg-page">
        <div className="max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 aura-text-gold" />
          <h1 className="aura-h2 aura-text-primary mb-2">Password Updated</h1>
          <p className="aura-body aura-text-muted">Redirecting to your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 aura-bg-page">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 aura-bg-gold-tint">
            <Lock className="w-6 h-6 aura-text-gold" />
          </div>
          <h1 className="aura-h2 aura-text-primary">Set New Password</h1>
          <p className="aura-body-small aura-text-muted mt-1">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftAdornment={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            leftAdornment={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
          />

          {error && (
            <p className="text-sm aura-text-danger p-3 aura-bg-danger-tint rounded-md" role="alert">
              {error}
            </p>
          )}

          <PremiumButton type="submit" variant="primary" fullWidth loading={loading}>
            Update Password
          </PremiumButton>
        </form>
      </div>
    </div>
  );
}
