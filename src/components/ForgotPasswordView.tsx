'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useAnimations';
import { GoldDivider, FloatingOrb } from '@/components/SVGDecorations';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import PremiumButton from '@/components/ui/PremiumButton';
import Input from '@/components/ui/Input';
import { resetPassword as resetPasswordAction } from '@/lib/auth/actions';

export default function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const cardRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) { setEmailError('Email is required'); return false; }
    if (!emailRegex.test(value)) { setEmailError('Please enter a valid email address'); return false; }
    setEmailError(''); return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    const result = await resetPasswordAction(formData);

    setLoading(false);
    if (result.success) { setSubmitted(true); }
    else { setEmailError(result.error || 'Failed to send reset email.'); }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)' }} />
      <FloatingOrb size={180} top="10%" left="5%" delay={0} />
      <FloatingOrb size={140} top="70%" left="80%" delay={1.5} />

      <div ref={cardRef} className="relative z-10 w-full max-w-md">
        <div className="w-full rounded-2xl p-8 sm:p-10 aura-surface-card aura-shadow-md">
          {!submitted ? (
            <>
              <div className="text-center mb-2">
                <div className="flex items-center justify-center mb-5">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center aura-bg-gold-tint">
                    <Lock className="w-6 h-6 aura-text-gold" />
                  </div>
                </div>
                <h1 className="aura-h2" data-reveal="blur">Reset Your Password</h1>
                <p className="text-sm mt-3 leading-relaxed max-w-xs mx-auto aura-text-secondary" data-reveal="up" data-reveal-delay="100">Enter your email and we&apos;ll send you a link to reset your password</p>
              </div>
              <div className="flex justify-center my-5"><GoldDivider /></div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input label="Email Address" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} leftAdornment={<Mail className="w-4 h-4" />} autoComplete="email" />
                <PremiumButton type="submit" variant="primary" fullWidth loading={loading} rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </PremiumButton>
              </form>
              <div className="text-center mt-6 pt-5 aura-border-top-gold-soft">
                <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center mb-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center aura-bg-gold-tint">
                  <Mail className="w-6 h-6 aura-text-gold" />
                </div>
              </div>
              <h1 className="aura-h2 mb-3">Check Your Email</h1>
              <p className="text-sm leading-relaxed max-w-xs mx-auto aura-text-secondary mb-6">If an account exists for <strong className="aura-text-primary">{email}</strong>, you will receive a password reset link shortly.</p>
              <PremiumButton variant="secondary" href="/auth/login" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back to Sign In</PremiumButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
