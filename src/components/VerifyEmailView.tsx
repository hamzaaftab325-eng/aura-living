'use client';

/**
 * VerifyEmailView — handles email verification + resend link.
 *
 * Flow:
 *  1. User signs up → redirected here with ?email=...
 *  2. Better Auth already sent a verification email (server-side in auth.ts)
 *  3. User clicks the link in email → goes to /auth/verify-email?token=...&email=...
 *  4. This component auto-detects the token and calls authClient.verifyEmail()
 *  5. On success, redirect to /auth/login with success message
 *
 * If no token present, shows "check your email" message with resend button.
 */

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useToast } from '@/hooks/use-toast';
import { GoldDivider, FloatingOrb } from '@/components/SVGDecorations';
import PremiumButton from '@/components/ui/PremiumButton';
import Input from '@/components/ui/Input';

type Status = 'idle' | 'verifying' | 'success' | 'error';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const token = searchParams.get('token');
  const emailFromUrl = searchParams.get('email') ?? '';

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState(emailFromUrl);
  const [resending, setResending] = useState(false);

  // Auto-verify when token is present in URL
  useEffect(() => {
    if (!token) return;
    const tokenValue = token; // capture non-null value for the async closure

    let cancelled = false;

    async function verify() {
      try {
        const { error } = await authClient.verifyEmail({
          query: { token: tokenValue },
        });

        if (cancelled) return;

        if (error) {
          setStatus('error');
          setErrorMessage(
            error.message ?? 'This verification link is invalid or has expired.',
          );
        } else {
          setStatus('success');
          toast({
            title: 'Email verified!',
            description: 'You can now sign in to your account.',
          });
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage('Something went wrong. Please try again.');
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [token, toast]);

  const handleResend = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    setResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: email.trim(),
      });

      if (error) {
        toast({
          title: 'Could not resend email',
          description: error.message ?? 'Please try again later.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Verification email sent',
          description: 'Please check your inbox (and spam folder).',
        });
      }
    } catch (err) {
      toast({
        title: 'Could not resend email',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 aura-surface-card aura-shadow-md">
      {status === 'verifying' && (
        <div className="text-center">
          <div className="flex items-center justify-center mb-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center aura-bg-gold-tint animate-pulse">
              <Mail className="w-6 h-6 aura-text-gold" />
            </div>
          </div>
          <h1 className="aura-h2 mb-3">Verifying your email...</h1>
          <p className="text-sm aura-text-secondary">Please wait a moment.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <div className="flex items-center justify-center mb-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center aura-bg-gold-tint">
              <CheckCircle className="w-6 h-6 aura-text-gold" />
            </div>
          </div>
          <h1 className="aura-h2 mb-3">Email Verified!</h1>
          <p className="text-sm aura-text-secondary mb-6">
            Your account is now active. You can sign in to start shopping.
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
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="flex items-center justify-center mb-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-50">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <h1 className="aura-h2 mb-3">Verification Failed</h1>
          <p className="text-sm aura-text-secondary mb-6">{errorMessage}</p>
          <div className="flex flex-col gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftAdornment={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />
            <PremiumButton
              variant="primary"
              fullWidth
              loading={resending}
              onClick={handleResend}
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </PremiumButton>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      )}

      {status === 'idle' && (
        <>
          <div className="text-center mb-2">
            <div className="flex items-center justify-center mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center aura-bg-gold-tint">
                <Mail className="w-6 h-6 aura-text-gold" />
              </div>
            </div>
            <h1 className="aura-h2" data-reveal="blur">Check Your Email</h1>
            <p className="text-sm mt-3 leading-relaxed max-w-xs mx-auto aura-text-secondary" data-reveal="up" data-reveal-delay="100">
              We&apos;ve sent a verification link to <strong className="aura-text-primary">{email || 'your email'}</strong>. Click the link to activate your account.
            </p>
          </div>
          <div className="flex justify-center my-5"><GoldDivider /></div>
          <div className="flex flex-col gap-4">
            <p className="text-xs aura-text-secondary text-center">
              Didn&apos;t receive the email? Check your spam folder, or resend it:
            </p>
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftAdornment={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />
            <PremiumButton
              variant="secondary"
              fullWidth
              loading={resending}
              onClick={handleResend}
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </PremiumButton>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailView() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)' }} />
      <FloatingOrb size={180} top="10%" left="5%" delay={0} />
      <FloatingOrb size={140} top="70%" left="80%" delay={1.5} />
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
