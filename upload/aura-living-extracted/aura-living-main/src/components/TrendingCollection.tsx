'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { GoldDivider } from '@/components/SVGDecorations';
import { useGsapFadeIn, useGsapBlurText } from '@/hooks/useGsap';
import PremiumButton from '@/components/ui/PremiumButton';

gsap.registerPlugin(ScrollTrigger);

export default function TrendingCollection() {
  const setPage = useStore((state) => state.setPage);
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP blur text for section heading
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.8, stagger: 0.06 });

  // GSAP fade-in for each content element
  const tagRef = useGsapFadeIn<HTMLSpanElement>({ y: 40, duration: 0.7, delay: 0 });
  const dividerWrapperRef = useGsapFadeIn<HTMLDivElement>({ y: 0, duration: 0.6, delay: 0.25 });
  const descRef = useGsapFadeIn<HTMLParagraphElement>({ y: 40, duration: 0.7, delay: 0.3 });
  const btnWrapperRef = useGsapFadeIn<HTMLDivElement>({ y: 40, duration: 0.7, delay: 0.45 });

  // Simple scale-in for content area + subtle background number parallax
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Background number — very subtle parallax with scrub
      if (numberRef.current) {
        gsap.to(numberRef.current, {
          y: 50,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'start end',
            end: 'end start',
            scrub: 1,
          },
        });
      }

      // Scale on scroll for content area
      if (contentRef.current) {
        gsap.set(contentRef.current, { scale: 0.95 });
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(contentRef.current, { scale: 1, duration: 1, ease: 'power3.out' });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 lg:py-28 overflow-hidden"
      style={{ backgroundColor: '#FAF8F5' }}
    >
      {/* ── Background "01" Number — subtle parallax ── */}
      <div
        ref={numberRef}
        className="absolute pointer-events-none select-none"
        style={{ top: '5%', left: '-2%' }}
      >
        <span
          className="text-[180px] sm:text-[240px] md:text-[300px] lg:text-[360px] font-bold leading-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'rgba(212, 175, 55, 0.06)',
          }}
        >
          01
        </span>
      </div>

      {/* ── Main Content ── */}
      <div ref={contentRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 items-stretch">
          {/* ═══ Left 60% — Image with Gold Frame ═══ */}
          <div className="w-full lg:w-[60%] relative">
            <div className="relative overflow-hidden rounded-lg lg:rounded-r-none">
              <div className="w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-auto lg:h-[580px]">
                <img
                  src="/images/categories/lighting-category.webp"
                  alt="The Artisan Collection — handcrafted lighting"
                  className="w-full h-full object-cover rounded-lg lg:rounded-r-none"
                />
              </div>

              {/* Gold Frame Accent — top-left + bottom-right (CSS borders) */}
              <div className="absolute top-5 left-5 w-20 h-20 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-sm pointer-events-none" />
              <div className="absolute bottom-5 right-5 w-20 h-20 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-sm pointer-events-none" />

              {/* Glassmorphism overlay strip at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 px-6 py-4"
                style={{
                  background: 'rgba(255, 253, 247, 0.55)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                }}
              >
                <span
                  className="text-[#D4AF37] text-sm sm:text-base tracking-[3px] uppercase font-semibold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  TRENDING NOW
                </span>
              </div>
            </div>
          </div>

          {/* ── Vertical CSS divider line ── */}
          <div className="hidden lg:flex items-center px-0">
            <div
              className="flex-shrink-0"
              style={{
                width: '1px',
                height: '580px',
                backgroundColor: 'rgba(212,175,55,0.25)',
                marginLeft: '-1px',
                marginRight: '-1px',
              }}
            />
          </div>

          {/* ═══ Right 40% — Content area ═══ */}
          <div className="w-full lg:w-[40%] flex flex-col justify-center lg:pl-8 xl:pl-12 py-6 lg:py-0">
            <span
              ref={tagRef}
              className="inline-block text-[#D4AF37] text-xs sm:text-sm tracking-[3px] uppercase font-semibold mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              TRENDING NOW
            </span>

            <h2
              ref={headingRef}
              className="text-[#2C2C2C] text-[32px] sm:text-[36px] md:text-[40px] font-bold leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The Artisan Collection
            </h2>

            <div ref={dividerWrapperRef} className="mb-5">
              <GoldDivider />
            </div>

            <p
              ref={descRef}
              className="text-[#5A5A5A] text-base sm:text-lg leading-relaxed mb-8"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Discover our curated collection of handcrafted lighting, where each piece is shaped
              by skilled artisans using time-honoured techniques. From sculptural brass pendants
              to hand-blown glass table lamps, every fixture tells a story of craftsmanship and
              elegance — designed to illuminate your home with warmth and character.
            </p>

            <div ref={btnWrapperRef}>
              <PremiumButton variant="gold" onClick={() => setPage('shop')}>
                Shop This Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Horizontal CSS divider ── */}
      <div className="lg:hidden flex justify-center mt-8 px-8">
        <div className="w-4/5 h-px bg-[#D4AF37]/25" />
      </div>
    </section>
  );
}
