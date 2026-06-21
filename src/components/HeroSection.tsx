'use client';

/**
 * HeroSection — Premium hero with video background, text reveal animations,
 * and parallax effect. Uses the official @gsap/react useGSAP hook.
 *
 * Animations:
 * - Eyebrow tag: word-by-word blur reveal
 * - Main heading: word-by-word blur reveal
 * - Subtitle: word-by-word blur reveal
 * - CTA button + scroll indicator: fade + slide up
 * - Gold divider: scale-in
 * - Background: parallax on scroll (desktop only)
 *
 * All animations respect prefers-reduced-motion.
 */
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTextReveal, useScrollReveal, useScaleIn } from '@/hooks/useAnimations';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Text animations — word-by-word blur reveal (new useAnimations hooks)
  const tagRef = useTextReveal<HTMLSpanElement>({
    duration: 0.5,
    stagger: 0.03,
    delay: 0.15,
    start: 'top 90%',
    splitBy: 'words',
  });

  const headingRef = useTextReveal<HTMLHeadingElement>({
    duration: 0.6,
    stagger: 0.04,
    delay: 0.25,
    start: 'top 90%',
    splitBy: 'words',
  });

  const subtitleRef = useTextReveal<HTMLParagraphElement>({
    duration: 0.5,
    stagger: 0.02,
    delay: 0.45,
    start: 'top 90%',
    splitBy: 'words',
  });

  // CTA + scroll indicator — fade + slide up
  const ctaRef = useScrollReveal<HTMLAnchorElement>({ y: 20, duration: 0.4, delay: 0.1 });
  const scrollRef = useScrollReveal<HTMLDivElement>({ y: 14, duration: 0.4, delay: 0.3 });
  const dividerRef = useScaleIn<HTMLDivElement>({ duration: 0.4, delay: 0.4 });

  // Parallax on scroll — background moves slower (desktop only)
  // Uses official useGSAP hook with automatic cleanup
  useGSAP(
    () => {
      if (!sectionRef.current || !bgRef.current) return;
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[100dvh] overflow-hidden bg-charcoal flex items-center justify-center"
    >
      {/* ═══ Background video with image fallback ═══ */}
      <div ref={bgRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        {/* Fallback background image — shows immediately while video loads */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero/hero-slide-1.webp)' }}
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero/hero-slide-1.webp"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/diometfe9/video/upload/v1781723540/Working_on_ecommerce_store_backg__202606180012_pm2rtf.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* ═══ Black overlay for text readability ═══ */}
      <div className="absolute inset-0 z-[3] aura-gradient-overlay-dark" />

      {/* ═══ Center content ═══ */}
      <div className="relative z-[4] flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl">

        {/* Eyebrow tag */}
        <span
          ref={tagRef}
          className="aura-eyebrow text-gold mb-4 sm:mb-5 block"
        >
          Premium Home Decor Pakistan
        </span>

        {/* Hero H1 — uses .aura-hero-title for clamp(36px, 6vw, 72px) + text-shadow */}
        <h1
          ref={headingRef}
          className="aura-hero-title text-white mb-4 select-none"
        >
          Where Comfort Meets Style
        </h1>

        {/* Gold divider */}
        <div ref={dividerRef} className="flex items-center gap-3 mb-5" style={{ transformOrigin: 'center' }}>
          <div className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent to-gold/60" />
          <div className="w-2 h-2 rounded-full bg-gold" />
          <div className="w-10 sm:w-16 h-px bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="aura-body-large text-white/80 max-w-xs sm:max-w-xl mb-6 sm:mb-8"
        >
          Discover handcrafted home decor, elegant lamps, indoor plants, ceramic vases & more. Premium quality delivered across Pakistan.
        </p>

        {/* CTA */}
        <Link
          ref={ctaRef}
          href="/shop"
          className="premium-btn btn-primary group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm rounded-full hover:gap-3"
        >
          Shop Collection
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ═══ Scroll indicator ═══ */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-2"
      >
        <span className="aura-body-small text-white/40 tracking-[0.2em] uppercase">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 animate-bounce" />
      </div>
    </section>
  );
}
