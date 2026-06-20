'use client';

import { useState } from 'react';
import { useGsapFadeIn } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import { Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PremiumButton from '@/components/ui/PremiumButton';

export default function ForgotPasswordView() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const cardRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      setEmailError('Email address is required');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 pb-12 relative overflow-hidden" style={{ backgroundColor: 'var(--surface-page)' }}>
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)',
        }}
      />

      <div ref={cardRef} className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div
          className="w-full rounded-2xl p-8 sm:p-10"
          style={{ backgroundColor: 'rgba(255,253,247,0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(232,213,163,0.3)',
            boxShadow: '0 8px 40px rgba(212,175,55,0.06), 0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-2">
                <div className="flex items-center justify-center mb-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}
                  >
                    <Lock className="w-6 h-6" style={{ color: 'var(--color-gold)' }} />
                  </div>
                </div>
                <h1
                  className="text-[28px] sm:text-[32px] lg:text-[40px] font-bold"
                  style={{ color: 'var(--surface-dark)' }}
                >
                  Reset Your Password
                </h1>
                <p
                  className="text-sm mt-3 leading-relaxed max-w-xs mx-auto"
                  style={{ color: 'var(--color-warm-gray)' }}
                >
                  Enter your email and we&apos;ll send you a link to reset your password
                </p>
              </div>

              <div className="flex justify-center my-5">
                <GoldDivider />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="forgot-email"
                    className="text-xs font-medium tracking-wide uppercase"
                    style={{ color: 'var(--color-muted-gray)' }}
                  >
                    Email Address
                  </label>
                  <div
                    className="relative flex items-center rounded-lg transition-all duration-300"
                    style={{ border: emailError ? '2px solid #C44' : '1.5px solid var(--color-gold-soft)',
                      backgroundColor: emailError ? 'rgba(204,68,68,0.03)' : 'rgba(255,255,255,0.7)',
                      boxShadow: emailError
                        ? '0 0 12px rgba(204,68,68,0.1)'
                        : '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div
                      className="flex items-center justify-center pl-4"
                      style={{ color: emailError ? '#C44' : 'var(--color-taupe)' }}
                    >
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) validateEmail(e.target.value);
                      }}
                      onBlur={() => { if (email) validateEmail(email); }}
                      className="w-full px-2 py-4 text-sm bg-transparent outline-none"
                      style={{ color: 'var(--surface-dark)',
                      }}
                      autoComplete="email"
                    />
                  </div>
                  {emailError && (
                    <span
                      className="text-xs pl-1"
                      style={{ color: '#C44' }}
                    >
                      {emailError}
                    </span>
                  )}
                </div>

                <PremiumButton
                  variant="gold"
                  fullWidth
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </PremiumButton>
              </form>

              {/* Back to Sign In */}
              <div className="text-center mt-6 pt-5" style={{ borderTop: '1px solid rgba(232,213,163,0.3)' }}>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                  style={{ color: 'var(--color-gold)', background: 'none' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}
                  >
                    <Mail className="w-7 h-7" style={{ color: 'var(--color-gold)' }} />
                  </div>
                </div>
                <h2
                  className="text-[28px] sm:text-[32px] lg:text-[40px] font-bold"
                  style={{ color: 'var(--surface-dark)' }}
                >
                  Check Your Email
                </h2>
                <p
                  className="text-sm mt-3 leading-relaxed max-w-xs mx-auto"
                  style={{ color: 'var(--color-warm-gray)' }}
                >
                  We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions.
                </p>

                <div className="flex justify-center my-5">
                  <GoldDivider />
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                    setEmailError('');
                  }}
                  className="text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                  style={{ color: 'var(--color-gold)', background: 'none' }}
                >
                  Didn&apos;t receive the email? Resend
                </button>

                <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(232,213,163,0.3)' }}>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                    style={{ color: 'var(--color-gold)', background: 'none' }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom info */}
        <p
          className="text-center text-[11px] mt-6 max-w-xs mx-auto leading-relaxed"
          style={{ color: 'var(--color-taupe)' }}
        >
          Remember your password?{' '}
          <Link
            href="/auth/login"
            className="font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
            style={{ color: 'var(--color-gold)', background: 'none' }}
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
