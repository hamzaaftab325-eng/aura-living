'use client';

import { useRef, useEffect } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  useGsapBlurText,
  useGsapFadeIn,
  useGsapScaleIn,
  gsap,
  ScrollTrigger,
} from '@/hooks/useGsap';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const setPage = useStore((state) => state.setPage);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Text animation — same hooks used in AboutView, ShopView, etc.
  const tagRef = useGsapBlurText<HTMLSpanElement>({
    duration: 0.7,
    stagger: 0.04,
    delay: 0.3,
    start: 'top 90%',
    splitBy: 'words',
  });

  const headingRef = useGsapBlurText<HTMLHeadingElement>({
    duration: 0.9,
    stagger: 0.06,
    delay: 0.5,
    start: 'top 90%',
    splitBy: 'words',
  });

  const subtitleRef = useGsapBlurText<HTMLParagraphElement>({
    duration: 0.7,
    stagger: 0.03,
    delay: 0.9,
    start: 'top 90%',
    splitBy: 'words',
  });

  // CTA + scroll indicator — fade in
  const ctaRef = useGsapFadeIn<HTMLButtonElement>({ y: 30, duration: 0.7, delay: 0.2 });
  const scrollRef = useGsapFadeIn<HTMLDivElement>({ y: 20, duration: 0.6, delay: 0.5 });
  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.7 });

  // Parallax on scroll — background moves slower
  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        y: 120,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#2C2C2C] flex items-center justify-center"
      style={{ height: '100vh', height: '100dvh' }}
    >
      {/* ═══ Single background image ═══ */}
      <div ref={bgRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <img
          src="/images/hero/hero-slide-1.webp"
          alt="Aura Living — Premium Home Decor"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* ═══ Overlay — multi-layer for depth ═══ */}
      {/* Layer 1: Vertical gradient for text readability */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: 'linear-gradient(180deg, rgba(44,44,44,0.6) 0%, rgba(44,44,44,0.2) 35%, rgba(44,44,44,0.15) 55%, rgba(44,44,44,0.7) 100%)',
        }}
      />
      {/* Layer 2: Warm gold tint */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Layer 3: Vignette */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(44,44,44,0.4) 100%)',
        }}
      />

      {/* ═══ Center content ═══ */}
      <div className="relative z-[4] flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto">

        {/* Tag */}
        <span
          ref={tagRef}
          className="text-[#D4AF37] text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-5 block"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Premium Home Decor Pakistan
        </span>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-white font-bold leading-[1.1] mb-4 select-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(38px, 8vw, 84px)',
            textShadow: '0 2px 30px rgba(0,0,0,0.4)',
          }}
        >
          Where Comfort Meets Style
        </h1>

        {/* Gold divider */}
        <div ref={dividerRef} className="flex items-center gap-3 mb-5" style={{ transformOrigin: 'center' }}>
          <div className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
          <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <div className="w-10 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-white/80 text-sm sm:text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Discover handcrafted home decor, elegant lamps, indoor plants, ceramic vases & more. Premium quality delivered across Pakistan.
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          onClick={() => setPage('shop')}
          className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer hover:gap-3 hover:shadow-[0_8px_40px_rgba(212,175,55,0.5)]"
          style={{
            backgroundColor: '#D4AF37',
            color: '#FFFFFF',
            fontFamily: "'Poppins', sans-serif",
            borderRadius: '50px',
          }}
        >
          Shop Collection
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* ═══ Scroll indicator ═══ */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-2"
      >
        <span
          className="text-white/40 text-[10px] tracking-[3px] uppercase"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Scroll
        </span>
        <ChevronDown className="w-5 h-5 text-white/60 animate-bounce" />
      </div>
    </section>
  );
}
