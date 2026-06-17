'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Facebook, Twitter, Send, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { GoldDivider } from '@/components/SVGDecorations';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   PinterestIcon — custom SVG
   ═══════════════════════════════════════════════════════════ */
const PinterestIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   FooterLink — CSS hover with gold glow + translateX + underline
   ═══════════════════════════════════════════════════════════ */
function FooterLink({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const Component = onClick ? 'button' : 'a';
  const props = onClick
    ? {
        onClick,
        style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' as const },
      }
    : { href: href || '#', onClick: href ? undefined : (e: React.MouseEvent) => e.preventDefault() };

  return (
    <Component
      {...props}
      className="group relative inline-block text-sm transition-all duration-500 hover:text-[#D4AF37] hover:translate-x-1.5 hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.3)]"
      style={{ color: '#FAF8F5' }}
    >
      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full" />
      <span className="relative">{children}</span>
    </Component>
  );
}

/* ═══════════════════════════════════════════════════════════
   SocialIcon — gold on brand charcoal
   ═══════════════════════════════════════════════════════════ */
function SocialIcon({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/25 transition-all duration-500 hover:border-[#D4AF37]/70 hover:scale-110 hover:rotate-6 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
      style={{ color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.06)' }}
    >
      <Icon size={18} className="transition-all duration-500 group-hover:scale-110" />
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Footer Component
   ═══════════════════════════════════════════════════════════ */

export default function Footer() {
  const { setPage } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const quickLinks = [
    { label: 'Home', page: 'home' as const },
    { label: 'Shop', page: 'shop' as const },
    { label: 'New Arrivals', page: 'new-arrivals' as const },
    { label: 'Sale', page: 'sale' as const },
    { label: 'Lookbook', page: 'lookbook' as const },
  ];

  const customerLinks = [
    { label: 'Shipping Info', page: 'shipping' as const },
    { label: 'Returns & Exchange', page: 'returns' as const },
    { label: 'FAQ', page: 'faq' as const },
    { label: 'Contact Us', page: 'contact' as const },
    { label: 'Care Guide', page: 'care-guide' as const },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: PinterestIcon, href: '#', label: 'Pinterest' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const paymentMethods = ['COD', 'JazzCash', 'EasyPaisa', 'Bank Transfer'];

  // Hydration-safe mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Footer entrance animation — safe with fallback
  useEffect(() => {
    if (!mounted || !footerRef.current || !gridRef.current) return;

    const columns = gridRef.current.querySelectorAll(':scope > div');
    if (!columns.length) return;

    // Set initial state
    gsap.set(columns, { opacity: 0, y: 30 });

    // Animate in when scrolled into view
    const trigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(columns, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        });
      },
    });

    // Safety fallback: if columns are still hidden after 3s, show them
    const fallback = setTimeout(() => {
      columns.forEach((col) => {
        const el = col as HTMLElement;
        if (gsap.getProperty(el, 'opacity') as number === 0) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.3 });
        }
      });
    }, 3000);

    return () => {
      trigger.kill();
      clearTimeout(fallback);
    };
  }, [mounted]);

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#2C2C2C' }}
    >
      {/* Gold accent line top edge */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] z-10"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
        }}
      />

      {/* Subtle gradient transition from page cream to footer charcoal */}
      <div
        className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(250,248,245,0.15) 0%, rgba(44,44,44,0) 100%)',
        }}
      />

      {/* Subtle brand pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Footer Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-5 pt-14 pb-8 sm:px-6 sm:pt-20 sm:pb-10 lg:px-8">
        <div ref={gridRef} className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col items-start gap-5 sm:gap-6">
            <div className="relative group">
              <img
                src="/logo/default-monochrome-gold-white.svg"
                alt="Aura Living"
                className="h-16 sm:h-20 lg:h-24 w-auto transition-all duration-700 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              />
            </div>
            <p
              className="text-lg italic leading-relaxed"
              style={{ color: '#E8D5A3', fontFamily: "'Dancing Script', cursive" }}
            >
              Where Comfort Meets Style
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map(({ icon, href, label }) => (
                <SocialIcon key={label} icon={icon} href={href} label={label} />
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-5">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] relative inline-block"
              style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}
            >
              Quick Links
              <span className="absolute -bottom-1.5 left-0 w-8 h-[1.5px] bg-[#D4AF37]/50" />
            </h3>
            <ul className="flex flex-col gap-3.5">
              {quickLinks.map(({ label, page }) => (
                <li key={label}>
                  <FooterLink onClick={() => setPage(page)}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="flex flex-col gap-5">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] relative inline-block"
              style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}
            >
              Customer Service
              <span className="absolute -bottom-1.5 left-0 w-8 h-[1.5px] bg-[#D4AF37]/50" />
            </h3>
            <ul className="flex flex-col gap-3.5">
              {customerLinks.map(({ label, page }) => (
                <li key={label}>
                  <FooterLink onClick={() => setPage(page)}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-5">
            <h3
              className="text-sm font-semibold uppercase tracking-[0.2em] relative inline-block"
              style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}
            >
              Newsletter
              <span className="absolute -bottom-1.5 left-0 w-8 h-[1.5px] bg-[#D4AF37]/50" />
            </h3>
            <div
              className="rounded-xl p-5 transition-all duration-700"
              style={{
                background: 'rgba(212,175,55,0.06)',
                border: focused
                  ? '1px solid rgba(212,175,55,0.5)'
                  : '1px solid rgba(212,175,55,0.15)',
                boxShadow: focused
                  ? '0 0 30px rgba(212,175,55,0.1), inset 0 0 30px rgba(212,175,55,0.03)'
                  : '0 0 0 rgba(212,175,55,0)',
              }}
            >
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#FAF8F5', opacity: 0.9 }}>
                Get <span style={{ color: '#D4AF37', fontWeight: 600 }}>15% off</span> your first order
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="h-11 w-full rounded-lg px-4 text-sm outline-none transition-all duration-500 placeholder:text-[#8A8A8A]"
                    style={{
                      backgroundColor: 'rgba(250,248,245,0.08)',
                      border: focused ? '1px solid rgba(212,175,55,0.6)' : '1px solid rgba(212,175,55,0.18)',
                      color: '#FAF8F5',
                      boxShadow: focused
                        ? '0 0 20px rgba(212,175,55,0.15), 0 0 40px rgba(212,175,55,0.05)'
                        : 'none',
                    }}
                  />
                  {/* Gold glow pulse on focus */}
                  {focused && (
                    <span
                      className="absolute inset-0 rounded-lg pointer-events-none animate-[goldPulse_2s_ease-in-out_infinite]"
                      style={{
                        boxShadow: '0 0 15px rgba(212,175,55,0.2)',
                      }}
                    />
                  )}
                </div>
                <button
                  type="submit"
                  className="group flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-all duration-500 hover:brightness-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-[0.98]"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#2C2C2C',
                    border: 'none',
                  }}
                >
                  <Send size={14} />
                  <span>Subscribe</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </form>
              {subscribed && (
                <p
                  className="text-xs mt-3 transition-opacity duration-500"
                  style={{ color: '#D4AF37' }}
                >
                  Thank you for subscribing!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gold Divider */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        <GoldDivider />
      </div>

      {/* Bottom Bar */}
      <div className="relative z-20 mx-auto max-w-7xl px-5 pb-6 sm:px-6 sm:pb-8 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs" style={{ color: '#E8D5A3', opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} Aura Living. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => setPage('terms')} className="text-xs transition-colors duration-300 hover:text-[#D4AF37] cursor-pointer" style={{ color: '#E8D5A3', opacity: 0.7, background: 'none', border: 'none' }}>Terms of Service</button>
            <button onClick={() => setPage('privacy')} className="text-xs transition-colors duration-300 hover:text-[#D4AF37] cursor-pointer" style={{ color: '#E8D5A3', opacity: 0.7, background: 'none', border: 'none' }}>Privacy Policy</button>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs" style={{ color: '#E8D5A3', opacity: 0.5 }}>We accept:</span>
            {paymentMethods.map((method, i) => (
              <span key={method} className="flex items-center gap-2">
                <span
                  className="text-xs font-medium transition-colors duration-300 hover:text-[#D4AF37]"
                  style={{ color: '#FAF8F5', opacity: 0.8 }}
                >
                  {method}
                </span>
                {i < paymentMethods.length - 1 && (
                  <span className="text-[#D4AF37]/40 text-[8px]">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gold gradient accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.4) 30%, #D4AF37 50%, rgba(212,175,55,0.4) 70%, transparent 100%)',
        }}
      />
    </footer>
  );
}
