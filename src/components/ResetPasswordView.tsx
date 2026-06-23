'use client';

/**
 * ResetPasswordView — user sets a new password after clicking reset link.
 *
 * Flow:
 *  1. User clicks reset link in email → arrives at /auth/reset-password?token=...
 *  2. This component shows "set new password" form
 *  3. On submit, calls authClient.resetPassword({ newPassword, token })
 *  4. On success, redirect to /auth/login
 *
 * Wrapped in <Suspense> because it uses useSearchParams.
 */

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useToast } from '@/hooks/use-toast';
import { GoldDivider, FloatingOrb } from '@/components/SVGDecorations';
import PremiumButton from '@/components/ui/PremiumButton';
import Input from '@/components/ui/Input';

/**
 * PasswordToggle — show/hide password button (declared OUTSIDE the
 * ResetPasswordForm component to avoid re-creation on each render).
 */
function PasswordToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? 'Hide password' : 'Show password'}
      className="cursor-pointer transition-colors duration-200 hover:aura-text-gold"
    >
      {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 aura-surface-card aura-shadow-md text-center">
        <h1 className="aura-h2 mb-3">Invalid Reset Link</h1>
        <p className="text-sm aura-text-secondary mb-6">
          This password reset link is missing a token. Please request a new reset link.
        </p>
        <PremiumButton variant="primary" href="/auth/forgot-password">
          Request New Link
        </PremiumButton>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        toast({
          title: 'Reset failed',
          description: error.message ?? 'This reset link may be invalid or expired.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast({
        title: 'Password reset!',
        description: 'You can now sign in with your new password.',
      });
    } catch (err) {
      toast({
        title: 'Reset failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 aura-surface-card aura-shadow-md text-center">
        <div className="flex items-center justify-center mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center aura-bg-gold-tint">
            <CheckCircle className="w-6 h-6 aura-text-gold" />
          </div>
        </div>
        <h1 className="aura-h2 mb-3">Password Reset!</h1>
        <p className="text-sm aura-text-secondary mb-6">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <PremiumButton
          variant="primary"
          fullWidth
          onClick={() => router.push('/auth/login')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Continue to Sign In
        </PremiumButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 aura-surface-card aura-shadow-md">
      <div className="text-center mb-2">
        <div className="flex items-center justify-center mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center aura-bg-gold-tint">
            <Lock className="w-6 h-6 aura-text-gold" />
          </div>
        </div>
        <h1 className="aura-h2" data-reveal="blur">Set New Password</h1>
        <p className="text-sm mt-3 leading-relaxed max-w-xs mx-auto aura-text-secondary" data-reveal="up" data-reveal-delay="100">
          Enter your new password below. Make it strong — at least 8 characters.
        </p>
      </div>
      <div className="flex justify-center my-5"><GoldDivider /></div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftAdornment={<Lock className="w-4 h-4" />}
          rightAdornment={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((p) => !p)} />}
          autoComplete="new-password"
        />
        <Input
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftAdornment={<Lock className="w-4 h-4" />}
          rightAdornment={<PasswordToggle shown={showConfirm} onToggle={() => setShowConfirm((p) => !p)} />}
          autoComplete="new-password"
        />
        <PremiumButton
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </PremiumButton>
      </form>
      <div className="text-center mt-6 pt-5 aura-border-top-gold-soft">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordView() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)' }} />
      <FloatingOrb size={180} top="10%" left="5%" delay={0} />
      <FloatingOrb size={140} top="70%" left="80%" delay={1.5} />
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
