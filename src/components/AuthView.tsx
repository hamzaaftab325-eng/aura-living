'use client';

/**
 * AuthView — Login + Signup page (toggleable via `mode` prop).
 *
 * Uses Better Auth (NOT Zustand mock auth).
 *
 * Auth flow:
 *  - Login:  calls authClient.signIn.email() → on success, redirect to ?from= or /account
 *  - Signup: calls authClient.signUp.email() → on success, redirect to /auth/verify-email
 *
 * Better Auth manages cookies internally — no manual cookie handling needed.
 */

import React, { useState } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTextReveal } from '@/hooks/useAnimations';
import { GoldDivider, FloatingOrb } from '@/components/SVGDecorations';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PremiumButton from '@/components/ui/PremiumButton';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';

const brandStats = [
  { number: '5000+', label: 'Happy Homes' },
  { number: '200+', label: 'Artisan Partners' },
  { number: '4.8', label: 'Rating' },
];

function PasswordToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} aria-label={shown ? 'Hide password' : 'Show password'} className="cursor-pointer transition-colors duration-200 hover:aura-text-gold">
      {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

/**
 * Inner component that uses useSearchParams — must be wrapped in <Suspense>.
 */
function AuthForm({ mode: modeProp = 'login' }: { mode?: 'login' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Where to redirect after successful login (?from= param or /account)
  const fromPath = searchParams.get('from') ?? '/account';

  const [mode, setMode] = useState<'login' | 'signup'>(modeProp);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const titleRef = useTextReveal<HTMLHeadingElement>({ duration: 0.7, stagger: 0.05, start: 'top 90%' });

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) {
        // Distinguish between unverified email and invalid credentials
        if (error.code === 'EMAIL_NOT_VERIFIED' || error.message?.includes('verify')) {
          toast({
            title: 'Email not verified',
            description: 'Please check your inbox and click the verification link before signing in.',
            variant: 'destructive',
          });
          // Redirect to verify-email page so they can resend the link
          router.push(`/auth/verify-email?email=${encodeURIComponent(loginEmail.trim())}`);
        } else {
          toast({
            title: 'Sign in failed',
            description: error.message ?? 'Invalid email or password.',
            variant: 'destructive',
          });
        }
        setIsSubmitting(false);
        return;
      }

      // Success — merge guest cart + wishlist to user's DB account
      try {
        const guestWishlist = useStore.getState().wishlist;
        if (guestWishlist.length > 0) {
          // Send wishlist product IDs to merge endpoint (fire-and-forget)
          fetch('/api/wishlist/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds: guestWishlist }),
          }).catch(() => {});
        }
      } catch {
        // Non-critical — don't block login
      }

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      router.push(fromPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: 'Sign in failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    if (signupPassword.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }
    if (!agreeTerms) {
      toast({
        title: 'Please accept terms',
        description: 'You must agree to the Terms of Service and Privacy Policy.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.signUp.email({
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      });

      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message ?? 'Could not create account.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Success — account created. Email verification is disabled for now
      // (will re-enable when we have a verified email domain on Resend).
      // Users can log in immediately after signup.
      toast({
        title: 'Account created!',
        description: 'Welcome to Aura Living. You can now sign in.',
      });
      // Redirect to login page so they can sign in immediately
      router.push(`/auth/login?from=${encodeURIComponent(fromPath)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Signup error:', err);
      toast({
        title: 'Sign up failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (mode === 'login') {
      void handleLogin();
    } else {
      void handleSignup();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 lg:px-16 pt-24 sm:pt-28 pb-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: mode === 'login' ? 'Sign In' : 'Create Account' }]} />
      <div className="lg:hidden mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/default-monochrome-gold-black.svg" alt="" aria-hidden="true" className="h-[44px] w-auto object-contain" />
      </div>

      <div className="w-full max-w-md rounded-xl p-8 sm:p-10 aura-surface-card aura-shadow-md">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 aura-text-gold" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{mode === 'login' ? 'Welcome Back' : 'Join the Family'}</span>
            <Sparkles className="w-4 h-4 aura-text-gold" />
          </div>
          <h1 ref={titleRef} className="aura-h2" data-reveal="blur">{mode === 'login' ? 'Sign In to Aura' : 'Create Account'}</h1>
        </div>
        <div className="flex justify-center my-5"><GoldDivider /></div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[var(--color-gold-soft)]" />
          <span className="text-[11px] uppercase tracking-wider">Email & Password</span>
          <div className="flex-1 h-px bg-[var(--color-gold-soft)]" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (<Input label="Full Name" type="text" placeholder="Your full name" value={signupName} onChange={(e) => setSignupName(e.target.value)} leftAdornment={<User className="w-4 h-4" />} autoComplete="name" />)}
          <Input label="Email Address" type="email" placeholder="your@email.com" value={mode === 'login' ? loginEmail : signupEmail} onChange={(e) => (mode === 'login' ? setLoginEmail(e.target.value) : setSignupEmail(e.target.value))} leftAdornment={<Mail className="w-4 h-4" />} autoComplete="email" />
          <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder={mode === 'login' ? 'Your password' : 'Min. 8 characters'} value={mode === 'login' ? loginPassword : signupPassword} onChange={(e) => (mode === 'login' ? setLoginPassword(e.target.value) : setSignupPassword(e.target.value))} leftAdornment={<Lock className="w-4 h-4" />} rightAdornment={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          {mode === 'signup' && (<Input label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} leftAdornment={<Lock className="w-4 h-4" />} rightAdornment={<PasswordToggle shown={showConfirmPassword} onToggle={() => setShowConfirmPassword((prev) => !prev)} />} autoComplete="new-password" />)}
          {mode === 'login' && (<div className="flex items-center justify-between"><Checkbox label="Remember me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /><Link href="/auth/forgot-password" className="text-xs font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer">Forgot Password?</Link></div>)}
          {mode === 'signup' && (<Checkbox label={<>{'I agree to the '}<Link href="/terms" className="aura-text-gold font-medium cursor-pointer hover:underline">Terms of Service</Link>{' and '}<Link href="/privacy" className="aura-text-gold font-medium cursor-pointer hover:underline">Privacy Policy</Link></>} checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />)}
          <PremiumButton type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting} rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </PremiumButton>
        </form>

        <div className="text-center mt-6 pt-5 aura-border-top-gold-soft">
          <p className="text-sm">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Link href={mode === 'login' ? '/auth/signup' : '/auth/login'} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setShowPassword(false); setShowConfirmPassword(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-semibold transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer">
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
      <p className="text-center text-[11px] mt-6 max-w-xs leading-relaxed">By continuing, you agree to Aura Living&apos;s Terms of Service and acknowledge our Privacy Policy.</p>
    </div>
  );
}

/**
 * Default export — wraps the form in <Suspense> (required by useSearchParams).
 */
export default function AuthView({ mode = 'login' }: { mode?: 'login' | 'signup' }) {
  return (
    <div className="w-full min-h-screen flex">
      <div className="hidden lg:flex w-[45%] xl:w-[50%] relative overflow-hidden flex-col items-center justify-center aura-surface-dark">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero/hero-slide-1.webp)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(44,44,44,0.75)] via-[rgba(44,44,44,0.5)] to-[rgba(212,175,55,0.15)]" />
        <FloatingOrb size={180} top="8%" left="65%" delay={0} />
        <FloatingOrb size={120} top="78%" left="-3%" delay={1.2} />
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/default-monochrome-gold-white.svg" alt="Aura Living" className="mb-8 h-[60px] w-auto object-contain" />
          <h2 className="text-white text-3xl xl:text-4xl font-bold leading-tight mb-4" data-reveal="blur">Where Comfort<br />Meets Style</h2>
          <div className="flex items-center gap-3 mt-2" data-reveal="scale" data-reveal-delay="100">
            <div className="w-10 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 h-px bg-[var(--color-gold)]/60" />
          </div>
          <p className="text-[var(--color-gold-soft)] text-sm mt-6 max-w-sm leading-relaxed" data-reveal="up" data-reveal-delay="200">Discover handpicked home decor that turns houses into homes. Join our community of decor enthusiasts across Pakistan.</p>
          <div className="flex items-center gap-8 mt-10">
            {brandStats.map((stat) => (<div key={stat.label} className="flex flex-col items-center"><span className="aura-text-gold text-xl font-bold">{stat.number}</span><span className="text-white/60 text-[10px] uppercase tracking-wider mt-1">{stat.label}</span></div>))}
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="animate-pulse">Loading...</div></div>}>
        <AuthForm mode={mode} />
      </Suspense>
    </div>
  );
}
