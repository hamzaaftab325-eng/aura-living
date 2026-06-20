'use client';

import React, { useState } from 'react';
import { useGsapBlurText } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';

/* ═══════════════════════════════════════════════════════════
   SocialButton — Google / Facebook / Apple login button
   ═══════════════════════════════════════════════════════════ */
function SocialButton({
  icon,
  label,
  onClick }: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="premium-btn btn-secondary w-full"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   InputField — reusable form input with icon + show/hide
   ═══════════════════════════════════════════════════════════ */
function InputField({
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  showToggle = false,
  onToggle,
  isVisible,
  ariaLabel,
  error,
  required }: {
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  showToggle?: boolean;
  onToggle?: () => void;
  isVisible?: boolean;
  ariaLabel: string;
  error?: string;
  required?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = React.useId();
  const errorId = `${inputId}-error`;

  return (
    <div>
      <div
        className="relative flex items-center rounded-lg transition-all duration-300"
        style={{ border: error
          ? '2px solid var(--color-danger)'
          : isFocused ? '2px solid var(--color-gold)' : '1.5px solid var(--color-gold-soft)',
          backgroundColor: isFocused ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)',
          boxShadow: isFocused
            ? '0 0 20px rgba(212,175,55,0.2), 0 0 40px rgba(212,175,55,0.08)'
            : '0 2px 8px rgba(0,0,0,0.03)' }}
      >
        <label htmlFor={inputId} className="sr-only">{ariaLabel}</label>
        <div
          className="flex items-center justify-center pl-4"
          style={{ color: isFocused ? 'var(--color-gold)' : 'var(--color-taupe)' }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <input
          id={inputId}
          type={showToggle ? (isVisible ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-2 py-4 text-sm bg-transparent outline-none"
          
          aria-label={ariaLabel}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          aria-required={required || undefined}
          required={required}
        />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="pr-4 cursor-pointer transition-colors duration-200 hover:aura-text-gold"
          style={{ color: 'var(--color-taupe)', background: 'none' }}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 ml-1 text-xs font-medium"
          
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main AuthView — Login / Signup with blur animation
   ═══════════════════════════════════════════════════════════ */
export default function AuthView({ mode: modeProp = 'login' }: { mode?: 'login' | 'signup' }) {
  const { login, signup } = useStore();
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>(modeProp);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Blur text animation for the title
  const titleRef = useGsapBlurText<HTMLHeadingElement>({
    duration: 0.7,
    stagger: 0.05,
    blur: 10,
    start: 'top 90%' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Basic validation
    if (mode === 'login') {
      if (!loginEmail.trim() || !loginPassword.trim()) {
        toast({
          title: 'Missing information',
          description: 'Please enter both email and password.',
          variant: 'destructive' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
        toast({
          title: 'Invalid email',
          description: 'Please enter a valid email address.',
          variant: 'destructive' });
        return;
      }
    } else {
      // Signup validation
      if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all fields.',
          variant: 'destructive' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
        toast({
          title: 'Invalid email',
          description: 'Please enter a valid email address.',
          variant: 'destructive' });
        return;
      }
      if (signupPassword.length < 6) {
        toast({
          title: 'Password too short',
          description: 'Password must be at least 6 characters.',
          variant: 'destructive' });
        return;
      }
      if (signupPassword !== signupConfirmPassword) {
        toast({
          title: 'Passwords do not match',
          description: 'Please make sure both passwords are identical.',
          variant: 'destructive' });
        return;
      }
      if (!agreeTerms) {
        toast({
          title: 'Please accept terms',
          description: 'You must agree to the Terms of Service and Privacy Policy.',
          variant: 'destructive' });
        return;
      }
    }

    setIsSubmitting(true);
    // Simulate async auth (frontend-only preview)
    setTimeout(() => {
      if (mode === 'login') {
        login(loginEmail.trim());
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.' });
      } else {
        signup(signupName.trim(), signupEmail.trim());
        toast({
          title: 'Account created!',
          description: 'Welcome to Aura Living. A 100-point welcome bonus has been added to your account.' });
      }
      setIsSubmitting(false);
      router.push('/account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  const handleSocialLogin = (provider: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      login(`guest@${provider.toLowerCase()}.com`);
      toast({
        title: `Signed in with ${provider}`,
        description: 'You have successfully authenticated.' });
      setIsSubmitting(false);
      router.push('/account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  return (
    <div className="w-full min-h-screen flex" >
      {/* ═══ Left Panel — Decorative Image + Branding ═══ */}
      <div
        className="hidden lg:flex w-[45%] xl:w-[50%] relative overflow-hidden flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.85), rgba(212,175,55,0.25))' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/hero/hero-slide-1.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center' }}
        />
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.2) 100%)' }} />

        {/* Decorative corner borders */}
        <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-[var(--color-gold)]/40 pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-[var(--color-gold)]/40 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <img
            src="/logo/default-monochrome-gold-white.svg"
            alt="Aura Living"
            className="mb-8"
            style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
          />
          <h2
            className="text-white text-3xl xl:text-4xl font-bold leading-tight mb-4"
            
          >
            Where Comfort<br />Meets Style
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-10 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 h-px bg-[var(--color-gold)]/60" />
          </div>
          <p
            className="text-[var(--color-gold-soft)] text-sm mt-6 max-w-sm leading-relaxed"
            
          >
            Discover handpicked home decor that turns houses into homes. Join our community of decor enthusiasts across Pakistan.
          </p>
          {/* Floating stats */}
          <div className="flex items-center gap-8 mt-10">
            {[
              { number: '5000+', label: 'Happy Homes' },
              { number: '200+', label: 'Artisan Partners' },
              { number: '4.8', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="aura-text-gold text-xl font-bold" >{stat.number}</span>
                <span className="text-white/60 text-[10px] uppercase tracking-wider mt-1" >{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gold orb decorations */}
        <div
          className="absolute pointer-events-none"
          style={{ width: 180,
            height: 180,
            top: '8%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
            borderRadius: '50%' }}
        />
        <div
          className="absolute pointer-events-none"
          style={{ width: 120,
            height: 120,
            bottom: '12%',
            left: '-3%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
            borderRadius: '50%' }}
        />
      </div>

      {/* ═══ Right Panel — Form ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 lg:px-16 pt-24 sm:pt-28 pb-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: mode === 'login' ? 'Sign In' : 'Create Account' },
          ]}
        />

        {/* Logo (mobile) */}
        <div className="lg:hidden mb-6">
          <img
            src="/logo/default-monochrome-gold-black.svg"
            alt=""
            aria-hidden="true"
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Form Card */}
        <div
          className="w-full max-w-md rounded-2xl p-8 sm:p-10"
          style={{ backgroundColor: 'rgba(255,253,247,0.8)',
            boxShadow: '0 8px 40px rgba(212,175,55,0.06), 0 2px 12px rgba(0,0,0,0.04)' }}
        >
          {/* Title with blur animation */}
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 aura-text-gold" />
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                
              >
                {mode === 'login' ? 'Welcome Back' : 'Join the Family'}
              </span>
              <Sparkles className="w-4 h-4 aura-text-gold" />
            </div>
            <h1
              ref={titleRef}
              className="aura-h2"
              
            >
              {mode === 'login' ? 'Sign In to Aura' : 'Create Account'}
            </h1>
          </div>

          <div className="flex justify-center my-5">
            <GoldDivider />
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3 mb-6">
            <SocialButton
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              }
              label="Continue with Google"
              onClick={() => handleSocialLogin('Google')}
            />
            <SocialButton
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              }
              label="Continue with Facebook"
              onClick={() => handleSocialLogin('Facebook')}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--color-gold-soft)]" />
            <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--color-taupe)' }}>
              or
            </span>
            <div className="flex-1 h-px bg-[var(--color-gold-soft)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <InputField
                icon={<User className="w-4 h-4" />}
                placeholder="Full Name"
                value={signupName}
                onChange={setSignupName}
                ariaLabel="Full name"
              />
            )}

            <InputField
              icon={<Mail className="w-4 h-4" />}
              type="email"
              placeholder="Email Address"
              value={mode === 'login' ? loginEmail : signupEmail}
              onChange={mode === 'login' ? setLoginEmail : setSignupEmail}
              ariaLabel="Email address"
            />

            <InputField
              icon={<Lock className="w-4 h-4" />}
              placeholder="Password"
              value={mode === 'login' ? loginPassword : signupPassword}
              onChange={mode === 'login' ? setLoginPassword : setSignupPassword}
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
              isVisible={showPassword}
              ariaLabel="Password"
            />

            {mode === 'signup' && (
              <InputField
                icon={<Lock className="w-4 h-4" />}
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={setSignupConfirmPassword}
                showToggle
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                isVisible={showConfirmPassword}
                ariaLabel="Confirm password"
              />
            )}

            {/* Remember me / Forgot password */}
            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={rememberMe}
                    aria-label="Remember me on this device"
                    className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                    style={{ border: rememberMe ? '2px solid var(--color-gold)' : '1.5px solid var(--color-gold-soft)',
                      backgroundColor: rememberMe ? 'var(--color-gold)' : 'transparent',
                      padding: 0 }}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <span className="text-xs" >
                    Remember me
                  </span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-xs font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                  style={{ background: 'none' }}
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* Terms (signup) */}
            {mode === 'signup' && (
              <label className="flex items-start gap-2 cursor-pointer">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreeTerms}
                  aria-label="I agree to the Terms of Service and Privacy Policy"
                  className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200"
                  style={{ border: agreeTerms ? '2px solid var(--color-gold)' : '1.5px solid var(--color-gold-soft)',
                    backgroundColor: agreeTerms ? 'var(--color-gold)' : 'transparent',
                    padding: 0 }}
                  onClick={() => setAgreeTerms(!agreeTerms)}
                >
                  {agreeTerms && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="text-xs leading-relaxed" >
                  I agree to the{' '}
                  <Link href="/terms" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="aura-text-gold font-medium cursor-pointer hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="aura-text-gold font-medium cursor-pointer hover:underline">Privacy Policy</Link>
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="premium-btn btn-primary btn-lg w-full mt-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Please wait...
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="text-center mt-6 pt-5" style={{ borderTop: '1px solid rgba(232,213,163,0.3)' }}>
            <p className="text-sm" >
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Link
                href={mode === 'login' ? '/auth/signup' : '/auth/login'}
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-semibold transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                style={{ background: 'none' }}
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom info */}
        <p
          className="text-center text-[11px] mt-6 max-w-xs leading-relaxed"
          style={{ color: 'var(--color-taupe)' }}
        >
          By continuing, you agree to Aura Living&apos;s Terms of Service and acknowledge our Privacy Policy.
        </p>
      </div>
    </div>
  );
}
