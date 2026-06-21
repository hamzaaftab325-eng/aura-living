'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Gift, Mail, ShieldCheck } from 'lucide-react';
import { useGsapFadeIn, useGsapBlurText, gsap, ScrollTrigger } from '@/hooks/useGsap';
import PremiumButton from '@/components/ui/PremiumButton';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // GSAP animations
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03 });
  const eyebrowRef = useGsapFadeIn<HTMLDivElement>({ y: 20, duration: 0.5, delay: 0 });
  const descRef = useGsapFadeIn<HTMLParagraphElement>({ y: 20, duration: 0.5, delay: 0.3 });
  const socialProofRef = useGsapFadeIn<HTMLDivElement>({ y: 15, duration: 0.4, delay: 0.5 });
  const cardRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.5, delay: 0.2 });

  // Scale-in on scroll
  const sectionContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sectionContentRef.current) return;

    gsap.set(sectionContentRef.current, { scale: 0.97 });
    const trigger = ScrollTrigger.create({
      trigger: sectionContentRef.current,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(sectionContentRef.current, { scale: 1, duration: 0.8, ease: 'power3.out' });
      } });

    return () => trigger.kill();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  const shouldFloatLabel = isFocused || email.length > 0;

  return (
    <section className="relative w-full aura-section overflow-hidden">
      {/* Subtle gold radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        
      />

      {/* Decorative corner lines */}
      <div className="absolute top-8 left-8 w-20 h-px bg-gold/15 pointer-events-none" />
      <div className="absolute top-8 left-8 w-px h-20 bg-gold/15 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-20 h-px bg-gold/15 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-px h-20 bg-gold/15 pointer-events-none" />

      {/* ═══ Main Content ═══ */}
      <div ref={sectionContentRef} className="aura-container-narrow relative z-10 px-4 sm:px-6 lg:px-8">
        {/* ═══ Dark premium card ═══ */}
        <div
          ref={cardRef}
          className="relative rounded-xl overflow-hidden"
          style={{ boxShadow: '0 16px 50px rgba(0, 0, 0, 0.15)' }}
        >
          {/* Gold top accent line */}
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-16">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Eyebrow badge */}
              <div
                ref={eyebrowRef}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                style={{
                  
                  border: '1px solid rgba(212, 175, 55, 0.25)' }}
              >
                <Gift className="w-3.5 h-3.5 text-gold" />
                <span className="aura-eyebrow">
                  Your Invitation Awaits
                </span>
              </div>

              {/* Main heading */}
              <h2
                ref={headingRef}
                className="aura-h2 text-white mb-4"
              >
                Become Part of the Aura Family
              </h2>

              {/* Gold divider */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="w-10 h-px bg-gold/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <div className="w-10 h-px bg-gold/40" />
              </div>

              {/* Description */}
              <p
                ref={descRef}
                className="aura-body-large text-white/70 max-w-lg mx-auto"
              >
                Unlock <span className="text-gold font-semibold">15% off</span> your first order,
                plus first access to new arrivals, members-only sales, and styling notes from our curators.
              </p>

              {/* Social proof */}
              <div ref={socialProofRef} className="mt-5 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  {['var(--color-gold)', 'var(--color-sage)', 'var(--color-blush)', 'var(--color-taupe)'].map((bg, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-charcoal flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: bg }}
                    >
                      {['AK', 'OF', 'SM', 'FN'][i]}
                    </div>
                  ))}
                </div>
                <span className="aura-body-small text-white/50">
                  Loved by 2,400+ Pakistani homes
                </span>
              </div>
            </div>

            {/* ═══ Email Form ═══ */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <label
                  htmlFor="newsletter-email"
                  className="absolute left-4 pointer-events-none transition-all duration-300 ease-out z-10"
                  style={{
                    top: shouldFloatLabel ? '6px' : '50%',
                    transform: shouldFloatLabel ? 'translateY(0)' : 'translateY(-50%)',
                    fontSize: shouldFloatLabel ? '10px' : '14px',
                    color: shouldFloatLabel ? 'var(--color-gold)' : 'rgba(255,255,255,0.4)',
                    fontWeight: shouldFloatLabel ? 600 : 400,
                    letterSpacing: shouldFloatLabel ? '0.05em' : '0' }}
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
                  placeholder=""
                  required
                  aria-required="true"
                  aria-invalid={submitted ? 'false' : 'false'}
                  aria-label="Email address for newsletter signup"
                  className="w-full px-4 py-3.5 rounded-lg text-sm outline-none transition-all duration-300"
                  style={{ border: isFocused
                      ? '2px solid var(--color-gold)'
                      : '1.5px solid rgba(212, 175, 55, 0.2)',
                    boxShadow: isFocused
                      ? '0 0 20px rgba(212,175,55,0.2)'
                      : 'none',
                    paddingTop: shouldFloatLabel ? '24px' : '14px',
                    paddingBottom: shouldFloatLabel ? '8px' : '14px' }}
                />
              </div>

              <PremiumButton variant="newsletter" fullWidth type="submit">
                <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                Claim My 15% Off
              </PremiumButton>
            </form>

            {/* Success message — announced to screen readers via role=status */}
            {submitted && (
              <div
                role="status"
                aria-live="polite"
                className="mt-4 max-w-md mx-auto p-3 rounded-lg text-center"
                style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }}
              >
                <p className="text-sm font-medium text-gold" >
                  Welcome to the family! Your 15% welcome code is on its way.
                </p>
              </div>
            )}

            {/* Trust signals */}
            <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-white/50" >
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                No spam, unsubscribe anytime
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-white/50" >
                <Mail className="w-3.5 h-3.5 text-gold" />
                We respect your privacy
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
