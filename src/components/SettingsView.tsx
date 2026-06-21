'use client';

import { useState } from 'react';
import { useScrollReveal, useStaggerReveal, useTextReveal } from '@/hooks/useAnimations';;
import { GoldDivider } from '@/components/SVGDecorations';
import {
  Settings,
  Bell,
  Shield,
  Moon,
  Globe,
  CreditCard,
  User as UserIcon,
  Mail,
  Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PremiumButton from '@/components/ui/PremiumButton';
import { useToast } from '@/hooks/use-toast';
import Breadcrumb from '@/components/ui/Breadcrumb';

/* ═══════════════════════════════════════════════════════════
   AnimatedSection — staggered children reveal
   ═══════════════════════════════════════════════════════════ */
function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useStaggerReveal<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.15,
    ease: 'power3.out',
    start: 'top 80%' });
  return <div ref={ref} className={className}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════
   Toggle Switch — accessible on/off control
   ═══════════════════════════════════════════════════════════ */
function Toggle({
  checked,
  onChange,
  label }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 cursor-pointer"
      style={{ backgroundColor: checked ? 'var(--color-gold)' : 'var(--color-gold-soft)' }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300"
        style={{ transform: checked ? 'translateX(24px)' : 'translateX(4px)' }}
      />
    </button>
  );
}

export default function SettingsView() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const { toast } = useToast();

  // Hydration guard
  const [hydrated, setHydrated] = useState(false);
  useState(() => { Promise.resolve().then(() => setHydrated(true)); });
  const safeUser = hydrated ? user : null;

  // Notification preferences
  const [emailOrders, setEmailOrders] = useState(true);
  const [emailPromos, setEmailPromos] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);

  // Privacy
  const [showProfile, setShowProfile] = useState(false);
  const [personalizedAds, setPersonalizedAds] = useState(true);

  // Appearance
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');

  // Profile edit form
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(safeUser?.name ?? '');
  const [profileEmail, setProfileEmail] = useState(safeUser?.email ?? '');

  // GSAP refs
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });
  const heroTitleRef = useTextReveal<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03, start: 'top 90%' });
  const sectionsRef = useStaggerReveal<HTMLDivElement>({
    selector: ':scope > div',
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    start: 'top 85%' });

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.' });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      toast({ title: 'Missing fields', description: 'Name and email are required.', variant: 'destructive' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileEmail)) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }
    // Note: full profile update requires backend. We acknowledge and close form.
    toast({
      title: 'Profile updated (demo)',
      description: 'In production this would update your account on the server.' });
    setEditingProfile(false);
  };

  const handleDeleteAccount = () => {
    toast({
      title: 'Account deletion requested',
      description: 'Our support team will contact you within 24 hours to confirm.',
      variant: 'destructive' });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.' });
    router.push('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Not-signed-in gate
  if (hydrated && !safeUser) {
    return (
      <div className="w-full page-transition" >
        <section className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden flex items-center justify-center">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'url(/images/pages/account-hero.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)' }}
          />
          <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center px-4">
            <h1
              ref={heroTitleRef}
              className="aura-hero-title text-white"
              
            >
              Account Settings
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
              <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            </div>
          </div>
        </section>
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center rounded-xl p-8 sm:p-10" >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ border: '1px dashed rgba(212,175,55,0.4)' }}>
              <Settings className="w-8 h-8"  />
            </div>
            <h2 className="aura-text-primary aura-h2 mb-3" >
              Sign in to manage settings
            </h2>
            <p className="aura-text-secondary text-sm sm:text-base mb-6" >
              Customise notifications, privacy, appearance, and more.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PremiumButton variant="primary" size="sm" href="/auth/login">Sign In</PremiumButton>
              <Link
                href="/auth/signup"
                className="text-xs sm:text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
              >
                Create a free account
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const settingSections = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Choose how and when we reach out to you.',
      items: [
        { key: 'emailOrders', label: 'Order updates by email', sub: 'Shipping confirmations, delivery alerts', value: emailOrders, setter: setEmailOrders },
        { key: 'emailPromos', label: 'Promotions & offers', sub: 'Sales, new arrivals, members-only deals', value: emailPromos, setter: setEmailPromos },
        { key: 'smsUpdates', label: 'SMS updates', sub: 'Critical order updates by text message', value: smsUpdates, setter: setSmsUpdates },
        { key: 'pushNotifs', label: 'Push notifications', sub: 'Real-time alerts on your device', value: pushNotifs, setter: setPushNotifs },
      ] },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Control how your data is used.',
      items: [
        { key: 'showProfile', label: 'Public profile', sub: 'Allow other members to see your activity', value: showProfile, setter: setShowProfile },
        { key: 'personalizedAds', label: 'Personalised recommendations', sub: 'Tailor product suggestions based on browsing', value: personalizedAds, setter: setPersonalizedAds },
      ] },
    {
      icon: Moon,
      title: 'Appearance',
      description: 'Adjust how Aura looks on your device.',
      items: [
        { key: 'darkMode', label: 'Dark mode', sub: 'Switch to a darker, evening-friendly palette', value: darkMode, setter: setDarkMode },
      ] },
  ];

  return (
    <div className="w-full page-transition" >
      {/* Hero */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/account-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)' }}
        />

        <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          <h2
            ref={heroTitleRef}
            className="aura-hero-title text-white"
            
          >
            Account Settings
          </h2>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>

          <p
            className="text-white/80 text-base sm:text-lg max-w-md mx-auto mt-4 leading-relaxed"
            
          >
            Fine-tune notifications, privacy, and appearance.
          </p>
        </div>
      </section>

      {/* Breadcrumb strip (below hero) */}
      <Breadcrumb
        items={[
          { label: 'My Account', href: '/account' },
          { label: 'Settings' },
        ]}
      />

      {/* Settings sections */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile card with inline edit */}
          <AnimatedSection>
            <div className="rounded-xl p-5 sm:p-6 mb-8 sm:mb-10" >
              {editingProfile ? (
                <form onSubmit={handleSaveProfile}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" >
                      <UserIcon className="w-5 h-5"  />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold" >
                      Edit Profile
                    </h3>
                  </div>
                  <div className="my-4"><GoldDivider /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium tracking-wide uppercase block mb-2" >
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-sm text-sm outline-none"
                        
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wide uppercase block mb-2" >
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-sm text-sm outline-none"
                        
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PremiumButton variant="primary" size="sm" type="submit">
                      Save Changes
                    </PremiumButton>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 animate-avatar-shimmer"
                    style={{ boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)', border: '2px solid rgba(255,255,255,0.4)' }}
                  >
                    <span className="text-lg font-bold text-white" >
                      {safeUser?.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold truncate" >
                      {safeUser?.name}
                    </p>
                    <p className="text-xs sm:text-sm truncate" >
                      {safeUser?.email}
                    </p>
                  </div>
                  <PremiumButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setProfileName(safeUser?.name ?? '');
                      setProfileEmail(safeUser?.email ?? '');
                      setEditingProfile(true);
                    }}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Edit Profile
                  </PremiumButton>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Setting sections */}
          <div ref={sectionsRef} className="flex flex-col gap-6 sm:gap-8">
            {settingSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <div key={section.title} className="rounded-xl p-5 sm:p-7" >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" >
                      <SectionIcon className="w-5 h-5"  />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold" >
                        {section.title}
                      </h3>
                      <p className="text-xs sm:text-sm" >
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="my-4">
                    <GoldDivider />
                  </div>
                  <div className="flex flex-col gap-1">
                    {section.items.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-4 py-3"
                        
                      >
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-medium" >
                            {item.label}
                          </p>
                          <p className="text-xs sm:text-sm mt-0.5" >
                            {item.sub}
                          </p>
                        </div>
                        <Toggle checked={item.value} onChange={item.setter} label={item.label} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Currency selector */}
            <div className="rounded-xl p-5 sm:p-7" >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" >
                  <Globe className="w-5 h-5"  />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold" >
                    Currency
                  </h3>
                  <p className="text-xs sm:text-sm" >
                    Display prices in your preferred currency.
                  </p>
                </div>
              </div>
              <div className="my-4"><GoldDivider /></div>
              <div className="flex items-center gap-3">
                {(['PKR', 'USD'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className="flex-1 py-3 rounded-sm text-sm font-medium transition-all duration-300 cursor-pointer"
                    style={{ border: currency === c ? '1.5px solid var(--color-gold)' : '1px solid var(--color-gold-soft)',
                      backgroundColor: currency === c ? 'rgba(212,175,55,0.08)' : 'transparent',
                      color: currency === c ? 'var(--color-gold)' : 'var(--color-warm-gray)' }}
                  >
                    {currency === c && <Check className="w-3.5 h-3.5 inline mr-1" />}
                    {c === 'PKR' ? 'PKR — Pakistani Rupee' : 'USD — US Dollar'}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div className="rounded-xl p-5 sm:p-7" >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" >
                  <CreditCard className="w-5 h-5"  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-semibold" >
                    Payment Methods
                  </h3>
                  <p className="text-xs sm:text-sm" >
                    Manage saved cards and digital wallets.
                  </p>
                </div>
              </div>
              <div className="my-4"><GoldDivider /></div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 rounded-sm" style={{ backgroundColor: 'rgba(212,175,55,0.05)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md flex items-center justify-center" >
                      <CreditCard className="w-4 h-4"  />
                    </div>
                    <div>
                      <p className="text-sm font-medium" >
                        JazzCash •••• 4242
                      </p>
                      <p className="text-xs" >
                        Default payment method
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm"
                    
                  >
                    Default
                  </span>
                </div>
                <PremiumButton variant="secondary" size="sm" onClick={() => toast({ title: 'Coming soon', description: 'Adding new payment methods will be available soon.' })}>
                  Add Payment Method
                </PremiumButton>
              </div>
            </div>

            {/* Danger zone */}
            <div
              className="rounded-sm p-5 sm:p-7"
              style={{ backgroundColor: 'rgba(220, 38, 38, 0.03)', border: '1px solid rgba(220, 38, 38, 0.2)' }}
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-2" >
                Danger Zone
              </h3>
              <p className="text-xs sm:text-sm mb-5" >
                Sign out of your account or request permanent deletion. Deletion is irreversible.
              </p>
              <div className="flex flex-wrap gap-3">
                <PremiumButton variant="secondary" size="sm" onClick={handleLogout}>
                  Sign Out
                </PremiumButton>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                >
                  Request Account Deletion
                </button>
              </div>
            </div>
          </div>

          {/* Save bar */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl p-5" >
            <p className="text-xs sm:text-sm text-center sm:text-left" >
              <Mail className="w-3.5 h-3.5 inline mr-1"  />
              Changes are saved instantly to your device.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-xs sm:text-sm font-medium transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
              >
                Back to Account
              </Link>
              <PremiumButton variant="primary" size="sm" onClick={handleSave}>
                Save Changes
              </PremiumButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
