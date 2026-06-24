'use client';

/**
 * ForgotPasswordView — user requests a password reset link.
 *
 * Uses Better Auth: authClient.forgetPassword({ email })
 * Better Auth sends a reset link via email (server-side).
 *
 * For security, we show the same "check your email" message regardless of
 * whether the email exists in our database. This prevents email enumeration.
 */

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useAnimations';
import { GoldDivider, FloatingOrb } from '@/components/SVGDecorations';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useToast } from '@/hooks/use-toast';
import PremiumButton from '@/components/ui/PremiumButton';
import Input from '@/components/ui/Input';

function ForgotPasswordForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const cardRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });

  const validateEmail = (value: string) => {
    if (!value.trim()) { setEmailError('Email is required'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setEmailError('Please enter a valid email address'); return false; }
    setEmailError(''); return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: email.trim(),
        // Where to redirect after the user clicks the reset link
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      // For security, ALWAYS show the "check your email" message — even if
      // the email doesn't exist in our DB. This prevents email enumeration.
      if (error) {
        console.warn('forgetPassword returned error (still showing success for security):', error.message);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('forgetPassword error:', err);
      // Still show success message — don't reveal if email exists
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={cardRef} className="relative z-10 w-full max-w-md">
      <div className="w-full rounded-xl p-8 sm:p-10 aura-surface-card aura-shadow-md">
        {!submitted ? (
          <>
            <div className="text-center mb-2">
              <div className="flex items-center justify-center mb-5"><div className="w-14 h-14 rounded-full flex items-center justify-center aura-bg-gold-tint"><Lock className="w-6 h-6 aura-text-gold" /></div></div>
              <h1 className="aura-h2" data-reveal="blur">Reset Your Password</h1>
              <p className="text-sm mt-3 leading-relaxed max-w-xs mx-auto aura-text-secondary" data-reveal="up" data-reveal-delay="100">Enter your email and we&apos;ll send you a link to reset your password</p>
            </div>
            <div className="flex justify-center my-5"><GoldDivider /></div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input label="Email Address" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} leftAdornment={<Mail className="w-4 h-4" />} autoComplete="email" />
              <PremiumButton type="submit" variant="primary" fullWidth loading={loading} rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}>{loading ? 'Sending...' : 'Send Reset Link'}</PremiumButton>
            </form>
            <div className="text-center mt-6 pt-5 aura-border-top-gold-soft"><Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In</Link></div>
          </>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center mb-5"><div className="w-14 h-14 rounded-full flex items-center justify-center aura-bg-gold-tint"><Mail className="w-6 h-6 aura-text-gold" /></div></div>
            <h1 className="aura-h2 mb-3">Check Your Email</h1>
            <p className="text-sm leading-relaxed max-w-xs mx-auto aura-text-secondary mb-6">If an account exists for <strong className="aura-text-primary">{email}</strong>, you will receive a password reset link shortly. The link expires in 1 hour.</p>
            <PremiumButton variant="secondary" href="/auth/login" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Sign In</PremiumButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordView() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)' }} />
      <FloatingOrb size={180} top="10%" left="5%" delay={0} />
      <FloatingOrb size={140} top="70%" left="80%" delay={1.5} />
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
