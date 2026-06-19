'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Gift, Mail, ShieldCheck } from 'lucide-react';
import { useGsapFadeIn, useGsapBlurText, gsap, ScrollTrigger } from '@/hooks/useGsap';
import PremiumButton from '@/components/ui/PremiumButton';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ── GSAP blur text for main heading ──
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03 });

  // ── GSAP fade-in refs ──
  const eyebrowRef = useGsapFadeIn<HTMLDivElement>({ y: 20, duration: 0.7, delay: 0 });
  const dividerRef = useGsapFadeIn<HTMLDivElement>({ y: 0, duration: 0.6, delay: 0.5 });
  const descRef = useGsapFadeIn<HTMLParagraphElement>({ y: 25, duration: 0.7, delay: 0.6 });
  const socialProofRef = useGsapFadeIn<HTMLDivElement>({ y: 15, duration: 0.5, delay: 0.85 });
  const cardRef = useGsapFadeIn<HTMLDivElement>({ y: 40, duration: 0.5, delay: 0.2 });

  // ── Scale on scroll for section content ──
  const sectionContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sectionContentRef.current;
    if (!el) return;

    gsap.set(el, { scale: 0.95 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, { scale: 1, duration: 1, ease: 'power3.out' });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // ── Parallax on background "15% OFF" text ──
  const bgTextRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const bgText = bgTextRef.current;
    const section = sectionRef.current;
    if (!bgText || !section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(bgText, { y: (progress - 0.5) * -50 });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  // Determine if label should float
  const shouldFloatLabel = isFocused || email.length > 0;

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: '#F5EDDA' }}
    >
      {/* ── SVG Geometric Pattern Overlay ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.035 }}
        >
          <defs>
            <pattern
              id="newsletterGeoPattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0 L60 15 L60 45 L30 60 L0 45 L0 15 Z"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.6"
              />
              <circle
                cx="30"
                cy="30"
                r="3"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#newsletterGeoPattern)" />
        </svg>

        {/* Corner lines */}
        <div className="absolute top-8 left-8 w-28 h-px bg-[#D4AF37]/20" />
        <div className="absolute top-8 left-8 w-px h-28 bg-[#D4AF37]/20" />
        <div className="absolute bottom-8 right-8 w-28 h-px bg-[#D4AF37]/20" />
        <div className="absolute bottom-8 right-8 w-px h-28 bg-[#D4AF37]/20" />
      </div>

      {/* ── Large Decorative "15% OFF" Background Text — with parallax ── */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="text-[8rem] sm:text-[16rem] md:text-[20rem] lg:text-[24rem] font-black leading-none tracking-tighter whitespace-nowrap"
          style={{ color: 'rgba(212, 175, 55, 0.06)',
            transform: 'rotate(-8deg) translateX(5%)',
          }}
        >
          15% OFF
        </span>
      </div>

      {/* ── Main Content — single centered column for cleaner look ── */}
      <div ref={sectionContentRef} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — centered */}
        <div className="text-center mb-10">
          {/* Eyebrow badge */}
          <div ref={eyebrowRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <Gift className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#D4AF37' }}
            >
              Your Invitation Awaits
            </span>
          </div>

          {/* Main heading */}
          <h2
            ref={headingRef}
            className="text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-[1.1] tracking-tight"
            style={{ color: '#2C2C2C' }}
          >
            Become Part of the Aura Family
          </h2>

          {/* Decorative divider */}
          <div ref={dividerRef} className="flex items-center justify-center gap-2 mt-6 mb-5">
            <div className="w-12 h-px bg-[#D4AF37]/50" />
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <div className="w-20 h-px bg-[#D4AF37]/30" />
          </div>

          {/* Description */}
          <p
            ref={descRef}
            className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            style={{ color: '#5A5A5A' }}
          >
            Unlock <span style={{ color: '#D4AF37', fontWeight: 600 }}>15% off</span> your first order, plus first access to new arrivals, members-only sales, and styling notes from our curators.
          </p>

          {/* Social proof */}
          <div ref={socialProofRef} className="mt-6 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {['#D4AF37', '#A8B5A0', '#E8CEC1', '#B8A99A'].map((bg, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#F5EDDA] flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: bg }}
                >
                  {['AK', 'OF', 'SM', 'FN'][i]}
                </div>
              ))}
            </div>
            <span
              className="text-xs sm:text-sm"
              style={{ color: '#8A8A8A' }}
            >
              Loved by 2,400+ Pakistani homes
            </span>
          </div>
        </div>

        {/* ── Email Form Card ── */}
        <div
          ref={cardRef}
          className="relative rounded-2xl p-6 sm:p-8 md:p-10"
          style={{ backgroundColor: 'rgba(255, 253, 247, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            boxShadow: '0 12px 40px rgba(212, 175, 55, 0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}
        >
          {/* Card shimmer overlay — CSS animation */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
            style={{ background:
                'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.07) 45%, rgba(212,175,55,0.12) 50%, rgba(212,175,55,0.07) 55%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'newsletterShimmer 4s ease-in-out infinite',
            }}
          />

          {/* Card header */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: '#D4AF37' }}
              >
                15% Welcome Gift
              </span>
            </div>
            <h3
              className="text-xl sm:text-2xl font-bold"
              style={{ color: '#2C2C2C' }}
            >
              Claim Your Discount
            </h3>
          </div>

          {/* Email Form with floating label */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label
                htmlFor="newsletter-email"
                className="absolute left-5 pointer-events-none transition-all duration-300 ease-out z-10"
                style={{ top: shouldFloatLabel ? '6px' : '50%',
                  transform: shouldFloatLabel ? 'translateY(0)' : 'translateY(-50%)',
                  fontSize: shouldFloatLabel ? '10px' : '14px',
                  color: shouldFloatLabel ? '#D4AF37' : '#B8A99A',
                  fontWeight: shouldFloatLabel ? 600 : 400,
                  letterSpacing: shouldFloatLabel ? '0.05em' : '0',
                }}
              >
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={shouldFloatLabel ? '' : 'Enter your email address'}
                required
                className="w-full px-5 py-4 rounded-lg text-sm placeholder:text-[#B8A99A] outline-none"
                style={{ color: '#2C2C2C',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: isFocused
                    ? '2px solid #D4AF37'
                    : '1.5px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: isFocused
                    ? '0 0 20px rgba(212,175,55,0.3), 0 0 40px rgba(212,175,55,0.1)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  transition: 'border 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
                  paddingTop: shouldFloatLabel ? '26px' : '16px',
                  paddingBottom: shouldFloatLabel ? '10px' : '16px',
                }}
              />
            </div>

            {/* Subscribe Button */}
            <div className="relative overflow-hidden rounded-sm">
              <PremiumButton
                variant="gold"
                fullWidth
                type="submit"
              >
                <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                Claim My 15% Off
              </PremiumButton>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background:
                    'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 55%, transparent 70%)',
                  backgroundSize: '250% 100%',
                  animation: 'btnShimmerSlide 2.5s ease-in-out infinite',
                }}
              />
            </div>
          </form>

          {/* Success message */}
          {submitted && (
            <div
              className="mt-4 p-3 rounded-lg text-center"
              style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: '#D4AF37' }}
              >
                Welcome to the family! Your 15% welcome code is on its way.
              </p>
            </div>
          )}

          {/* Trust signals */}
          <div className="mt-5 pt-5 flex items-center justify-center gap-4 flex-wrap" style={{ borderTop: '1px solid rgba(232, 213, 163, 0.4)' }}>
            <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: '#8A8A8A' }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              No spam, unsubscribe anytime
            </span>
            <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: '#8A8A8A' }}>
              <Mail className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              We respect your privacy
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom decorative accent ── */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-6 pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <div className="w-16 h-px bg-[#D4AF37]/20" />
          <div className="w-2 h-2 rotate-45 border border-[#D4AF37]/20" />
          <div className="w-16 h-px bg-[#D4AF37]/20" />
        </div>
      </div>

      {/* ── CSS keyframes for shimmer effects ── */}
      <style>{`
        @keyframes newsletterShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes btnShimmerSlide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
