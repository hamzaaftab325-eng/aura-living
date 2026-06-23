'use client';

/**
 * AuthView — Login + Signup page (toggleable via `mode` prop).
 * Uses Zustand mock auth.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTextReveal } from '@/hooks/useAnimations';
import { GoldDivider, FloatingOrb } from '@/components/SVGDecorations';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
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

export default function AuthView({ mode: modeProp = 'login' }: { mode?: 'login' | 'signup' }) {
  const { login, signup } = useStore();
  const router = useRouter();
  const { toast } = useToast();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (mode === 'login') {
      if (!loginEmail.trim() || !loginPassword.trim()) { toast({ title: 'Missing information', description: 'Please enter both email and password.', variant: 'destructive' }); return; }
    } else {
      if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) { toast({ title: 'Missing information', description: 'Please fill in all fields.', variant: 'destructive' }); return; }
      if (signupPassword.length < 6) { toast({ title: 'Password too short', description: 'Password must be at least 6 characters.', variant: 'destructive' }); return; }
      if (signupPassword !== signupConfirmPassword) { toast({ title: 'Passwords do not match', description: 'Please make sure both passwords are identical.', variant: 'destructive' }); return; }
      if (!agreeTerms) { toast({ title: 'Please accept terms', description: 'You must agree to the Terms of Service and Privacy Policy.', variant: 'destructive' }); return; }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (mode === 'login') { login(loginEmail.trim()); toast({ title: 'Welcome back!', description: 'You have successfully signed in.' }); }
      else { signup(signupName.trim(), signupEmail.trim()); toast({ title: 'Account created!', description: 'Welcome to Aura Living.' }); }
      setIsSubmitting(false);
      router.push('/account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  const handleSocialLogin = (provider: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      login(`guest@${provider.toLowerCase()}.com`);
      toast({ title: `Signed in with ${provider}`, description: 'You have successfully authenticated.' });
      setIsSubmitting(false);
      router.push('/account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  return (
    <div className="w-full min-h-screen flex">
      <div className="hidden lg:flex w-[45%] xl:w-[50%] relative overflow-hidden flex-col items-center justify-center aura-surface-dark">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero/hero-slide-1.webp)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(44,44,44,0.8)] via-[rgba(44,44,44,0.5)] to-[rgba(212,175,55,0.2)]" />
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 lg:px-16 pt-24 sm:pt-28 pb-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: mode === 'login' ? 'Sign In' : 'Create Account' }]} />
        <div className="lg:hidden mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/default-monochrome-gold-black.svg" alt="" aria-hidden="true" className="h-[44px] w-auto object-contain" />
        </div>

        <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 aura-surface-card aura-shadow-md">
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 aura-text-gold" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{mode === 'login' ? 'Welcome Back' : 'Join the Family'}</span>
              <Sparkles className="w-4 h-4 aura-text-gold" />
            </div>
            <h1 ref={titleRef} className="aura-h2" data-reveal="blur">{mode === 'login' ? 'Sign In to Aura' : 'Create Account'}</h1>
          </div>
          <div className="flex justify-center my-5"><GoldDivider /></div>

          <div className="flex flex-col gap-3 mb-6">
            <PremiumButton variant="secondary" fullWidth onClick={() => handleSocialLogin('Google')}
              leftIcon={<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>}>
              Continue with Google
            </PremiumButton>
            <PremiumButton variant="secondary" fullWidth onClick={() => handleSocialLogin('Facebook')}
              leftIcon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}>
              Continue with Facebook
            </PremiumButton>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--color-gold-soft)]" />
            <span className="text-[11px] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[var(--color-gold-soft)]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (<Input label="Full Name" type="text" placeholder="Your full name" value={signupName} onChange={(e) => setSignupName(e.target.value)} leftAdornment={<User className="w-4 h-4" />} autoComplete="name" />)}
            <Input label="Email Address" type="email" placeholder="your@email.com" value={mode === 'login' ? loginEmail : signupEmail} onChange={(e) => (mode === 'login' ? setLoginEmail(e.target.value) : setSignupEmail(e.target.value))} leftAdornment={<Mail className="w-4 h-4" />} autoComplete="email" />
            <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Your password" value={mode === 'login' ? loginPassword : signupPassword} onChange={(e) => (mode === 'login' ? setLoginPassword(e.target.value) : setSignupPassword(e.target.value))} leftAdornment={<Lock className="w-4 h-4" />} rightAdornment={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
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
    </div>
  );
}
