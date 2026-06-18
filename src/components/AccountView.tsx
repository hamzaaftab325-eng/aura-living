'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useGsapFadeIn,
  useGsapStagger,
  useGsapBlurText,
  useGsapScaleIn,
  useGsapCountUp,
  gsap,
  
} from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  Package,
  Heart,
  MapPin,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Award,
  Truck,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import PremiumButton from '@/components/ui/PremiumButton';
import { useToast } from '@/hooks/use-toast';


/* ═══════════════════════════════════════════════════════════
   AnimatedSection — uses useGsapStagger for children reveal
   ═══════════════════════════════════════════════════════════ */
function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.15,
    ease: 'power3.out',
    start: 'top 80%',
  });

  return <div ref={ref} className={className}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════
   Mock Data
   ═══════════════════════════════════════════════════════════ */
const mockOrders = [
  {
    id: 'AL-2026-001',
    date: 'Jan 15, 2026',
    status: 'Delivered',
    total: 'PKR 12,498',
    statusColor: '#22C55E',
    statusBg: 'rgba(34, 197, 94, 0.1)',
    statusIcon: CheckCircle,
  },
  {
    id: 'AL-2026-002',
    date: 'Feb 28, 2026',
    status: 'Shipped',
    total: 'PKR 8,999',
    statusColor: '#3B82F6',
    statusBg: 'rgba(59, 130, 246, 0.1)',
    statusIcon: Truck,
  },
  {
    id: 'AL-2026-003',
    date: 'Mar 10, 2026',
    status: 'Processing',
    total: 'PKR 5,499',
    statusColor: '#D4AF37',
    statusBg: 'rgba(212, 175, 55, 0.1)',
    statusIcon: Clock,
  },
];

export default function AccountView() {
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const user = useStore((state) => state.user);
  const setPage = useStore((state) => state.setPage);
  const logout = useStore((state) => state.logout);
  const { toast } = useToast();

  // Avoid hydration mismatch: persisted cart/wishlist/user read from localStorage on client only.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  const safeCart = hydrated ? cart : [];
  const safeWishlist = hydrated ? wishlist : [];
  const safeUser = hydrated ? user : null;

  const cartCount = safeCart.reduce((count, item) => count + item.quantity, 0);

  const headerSectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  // GSAP fade-in for header
  const headerRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });
  // Hero heading blur text
  const heroTitleRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03, start: 'top 90%' });
  // GoldDivider scale-in
  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

  // Stats stagger
  const statsRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 25,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    start: 'top 85%',
  });

  // Count-up refs for each stat
  const orderCountRef = useGsapCountUp<HTMLSpanElement>({ endValue: 3, duration: 0.8, start: 'top 85%' });
  const wishlistCountRef = useGsapCountUp<HTMLSpanElement>({ endValue: safeWishlist.length, duration: 0.8, delay: 0.1, start: 'top 85%' });
  const cartCountRef = useGsapCountUp<HTMLSpanElement>({ endValue: cartCount, duration: 0.8, delay: 0.2, start: 'top 85%' });
  const rewardsCountRef = useGsapCountUp<HTMLSpanElement>({ endValue: user?.rewardsPoints ?? 0, duration: 1.0, delay: 0.2, start: 'top 85%' });

  // Orders stagger
  const ordersRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 20,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
    start: 'top 85%',
  });

  // Menu grid stagger
  const menuRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 25,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%',
  });

  // Enhanced parallax for hero section — 0.5x speed + zoom 1→1.1
  useEffect(() => {
    if (!heroBgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(heroBgRef.current, {
        backgroundPositionY: '50%',
        ease: 'none',
        scrollTrigger: {
          trigger: headerSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
      gsap.fromTo(heroBgRef.current,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: headerSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, headerSectionRef);
    return () => ctx.revert();
  }, []);

  const accountMenuItems = [
    {
      icon: Package,
      label: 'Track My Orders',
      description: 'Live status, ETAs & timeline',
      onClick: () => { setPage('track-orders'); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    },
    {
      icon: Heart,
      label: 'My Wishlist',
      description: `${safeWishlist.length} saved item${safeWishlist.length !== 1 ? 's' : ''}`,
      onClick: () => setPage('wishlist'),
    },
    {
      icon: MapPin,
      label: 'Saved Addresses',
      description: 'Manage delivery addresses',
      onClick: () => { setPage('addresses'); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    },
    {
      icon: Settings,
      label: 'Account Settings',
      description: 'Notifications, privacy & more',
      onClick: () => { setPage('settings'); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get assistance',
      onClick: () => setPage('contact'),
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      description: 'Sign out of account',
      onClick: () => {
        logout();
        toast({
          title: 'Signed out',
          description: 'You have been successfully signed out.',
        });
        setPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
  ];

  const quickStats = [
    {
      icon: Package,
      value: '3',
      label: 'Orders',
      color: '#D4AF37',
      bg: 'rgba(212, 175, 55, 0.1)',
    },
    {
      icon: Heart,
      value: String(safeWishlist.length),
      label: 'Wishlist',
      color: '#DC2626',
      bg: 'rgba(220, 38, 38, 0.08)',
    },
    {
      icon: ShoppingBag,
      value: String(cartCount),
      label: 'Cart Items',
      color: '#2C2C2C',
      bg: 'rgba(44, 44, 44, 0.08)',
    },
    {
      icon: Award,
      value: String(user?.rewardsPoints ?? 0),
      label: 'Rewards Points',
      color: '#D4AF37',
      bg: 'rgba(212, 175, 55, 0.1)',
    },
  ];

  return (
    <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero Banner */}
      <section
        ref={headerSectionRef}
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
      >
        {/* Background image */}
        <div
          ref={heroBgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/pages/account-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)',
          }}
        />

        {/* Decorative floating orbs */}
        <div
          className="absolute top-10 right-20 w-36 h-36 rounded-full"
          style={{
            filter: 'blur(60px)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-10 left-10 w-40 h-40 rounded-full"
          style={{
            filter: 'blur(70px)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
          }}
        />

        <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">

          <h1
            ref={heroTitleRef}
            className="text-white text-[36px] sm:text-[44px] md:text-[52px] font-bold leading-[1.15] pt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            My Account
          </h1>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
          </div>

          <p
            className="text-white/70 text-base sm:text-lg max-w-md mx-auto mt-4 leading-relaxed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Manage your profile, orders, and preferences
          </p>
        </div>
      </section>
      {/* Breadcrumb strip (below hero) */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate" style={{ backgroundColor: '#F5EDDA', borderBottom: '1px solid #E8D5A3' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-sm transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A', background: 'none', border: 'none' }}
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#B8A99A' }} />
          <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>
            My Account
          </span>
        </div>
      </div>

      {/* Account Content */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Card */}
          <AnimatedSection>
            <div
              className="rounded-sm p-6 sm:p-8 mb-8 sm:mb-10"
              style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
            >
              {user ? (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
                  {/* Avatar */}
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0 animate-avatar-shimmer"
                    style={{
                      boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    <span
                      className="text-2xl sm:text-3xl font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {safeUser?.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1">
                    <h2
                      className="text-[#2C2C2C] text-xl sm:text-2xl font-bold mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {safeUser?.name}
                    </h2>
                    <p
                      className="text-[#5A5A5A] text-sm sm:text-base mb-1"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {safeUser?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: '#22C55E' }}
                      />
                      <span
                        className="text-xs tracking-wide"
                        style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                      >
                        Member Since {safeUser?.memberSince}
                      </span>
                    </div>
                  </div>

                  {/* Edit Profile Button */}
                  <PremiumButton
                    variant="outline"
                    size="sm"
                    onClick={() => { setPage('settings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    Edit Profile
                  </PremiumButton>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                  >
                    <LogOut className="w-8 h-8" style={{ color: '#D4AF37' }} />
                  </div>
                  <div className="flex-1">
                    <h2
                      className="text-[#2C2C2C] text-xl sm:text-2xl font-bold mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      You are not signed in
                    </h2>
                    <p
                      className="text-[#5A5A5A] text-sm sm:text-base mb-4"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Sign in to view your orders, wishlist, and rewards.
                    </p>
                    <PremiumButton variant="gold" size="sm" onClick={() => setPage('login')}>
                      Sign In
                    </PremiumButton>
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Quick Stats — only when signed in */}
          {safeUser && (
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-14">
            {quickStats.map((stat, idx) => {
              const countRef = idx === 0 ? orderCountRef : idx === 1 ? wishlistCountRef : idx === 2 ? cartCountRef : rewardsCountRef;
              return (
              <div
                key={stat.label}
                className="rounded-sm p-5 sm:p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]"
                style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: stat.bg }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span
                  ref={countRef}
                  className="text-2xl sm:text-3xl font-bold block mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
                >
                  0
                </span>
                <span
                  className="text-xs sm:text-sm tracking-wide"
                  style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                >
                  {stat.label}
                </span>
              </div>
              );
            })}
          </div>
          )}

          {/* Recent Orders — only when signed in */}
          {safeUser && (
          <AnimatedSection>
            <div
              className="rounded-sm p-6 sm:p-8 mb-10 sm:mb-14"
              style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3
                  className="text-[#2C2C2C] text-xl sm:text-2xl font-semibold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Recent Orders
                </h3>
                <button
                  onClick={() => { setPage('track-orders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-xs sm:text-sm font-medium transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
                  style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
                >
                  View All
                </button>
              </div>
              <div className="mb-6">
                <GoldDivider />
              </div>

              {/* Orders Table - Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E8D5A3' }}>
                      <th
                        className="text-left py-3 px-4 text-xs tracking-wider uppercase font-semibold"
                        style={{ color: '#8A8A8A' }}
                      >
                        Order
                      </th>
                      <th
                        className="text-left py-3 px-4 text-xs tracking-wider uppercase font-semibold"
                        style={{ color: '#8A8A8A' }}
                      >
                        Date
                      </th>
                      <th
                        className="text-left py-3 px-4 text-xs tracking-wider uppercase font-semibold"
                        style={{ color: '#8A8A8A' }}
                      >
                        Status
                      </th>
                      <th
                        className="text-right py-3 px-4 text-xs tracking-wider uppercase font-semibold"
                        style={{ color: '#8A8A8A' }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition-colors duration-200 hover:bg-[#FAF8F5] cursor-pointer"
                        style={{ borderBottom: '1px solid #E8D5A3' }}
                        onClick={() => { setPage('track-orders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      >
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium" style={{ color: '#2C2C2C' }}>
                            #{order.id}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm" style={{ color: '#5A5A5A' }}>
                            {order.date}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold"
                            style={{ backgroundColor: order.statusBg, color: order.statusColor }}
                          >
                            <order.statusIcon className="w-3 h-3" />
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>
                            {order.total}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Orders Cards - Mobile */}
              <div ref={ordersRef} className="md:hidden flex flex-col gap-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-sm p-4 transition-colors duration-200 cursor-pointer"
                    style={{ backgroundColor: '#FAF8F5', border: '1px solid #E8D5A3' }}
                    onClick={() => { setPage('track-orders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>
                        #{order.id}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-semibold"
                        style={{ backgroundColor: order.statusBg, color: order.statusColor, fontFamily: "'Poppins', sans-serif" }}
                      >
                        <order.statusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}>
                        {order.date}
                      </span>
                      <span className="text-sm font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>
                        {order.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          )}

          {/* Account Menu Grid — only when signed in */}
          {safeUser && (
          <>
          <AnimatedSection>
            <div className="text-center mb-8 sm:mb-10">
              <h3
                className="text-[#2C2C2C] text-xl sm:text-2xl font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Account Menu
              </h3>
              <div className="flex justify-center">
                <GoldDivider />
              </div>
            </div>
          </AnimatedSection>

          <div
            ref={menuRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {accountMenuItems.map((item) => (
              <div
                key={item.label}
                onClick={item.onClick}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.onClick(); } }}
                role="button"
                tabIndex={0}
                className="group rounded-sm p-5 sm:p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:border-[#D4AF37] cursor-pointer animate-menu-ripple focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                  >
                    <item.icon
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: item.label === 'Sign Out' ? '#DC2626' : '#D4AF37' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-[#2C2C2C] text-sm sm:text-base font-semibold mb-0.5"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {item.label}
                    </h4>
                    <p
                      className="text-xs sm:text-sm truncate"
                      style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                    >
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: '#8A8A8A' }}
                  />
                </div>
              </div>
            ))}
          </div>
          </>
          )}

          {/* Rewards Section — only when signed in */}
          {safeUser && (
          <AnimatedSection>
            <div
              className="mt-10 sm:mt-14 rounded-sm p-6 sm:p-8 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #2C2C2C 0%, #3A3A3A 50%, #2C2C2C 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              {/* Decorative corner accents */}
              <div
                className="absolute top-0 left-0 w-16 h-16"
                style={{ borderTop: '2px solid rgba(212,175,55,0.4)', borderLeft: '2px solid rgba(212,175,55,0.4)' }}
              />
              <div
                className="absolute bottom-0 right-0 w-16 h-16"
                style={{ borderBottom: '2px solid rgba(212,175,55,0.4)', borderRight: '2px solid rgba(212,175,55,0.4)' }}
              />

              <Award className="w-10 h-10 mx-auto mb-4" style={{ color: '#D4AF37' }} />
              <h3
                className="text-white text-xl sm:text-2xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Aura Rewards
              </h3>
              <p
                className="text-white/60 text-sm sm:text-base mb-5 max-w-md mx-auto leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                You have <span style={{ color: '#D4AF37', fontWeight: 600 }}>{user?.rewardsPoints ?? 0} points</span> — that is PKR {user?.rewardsPoints ?? 0} off your next order!
              </p>
              <PremiumButton
                variant="gold"
                size="sm"
                onClick={() => setPage('shop')}
              >
                <ShoppingBag className="w-4 h-4" />
                Redeem on Next Order
              </PremiumButton>
            </div>
          </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
}
