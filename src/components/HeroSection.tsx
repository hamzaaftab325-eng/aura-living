'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { gsap, ScrollTrigger } from '@/hooks/useGsap';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    tag: 'New Collection 2026',
    heading: 'Elevate Your Space',
    subtitle: 'Handcrafted home decor that turns houses into homes',
    image: '/images/hero/hero-slide-1.webp',
    cta: { label: 'Shop Collection', page: 'shop' as const },
  },
  {
    tag: 'Lighting Collection',
    heading: 'Light Up Your Life',
    subtitle: 'Brass table lamps, pendant lights & crystal fixtures',
    image: '/images/hero/hero-slide-2.webp',
    cta: { label: 'Shop Lighting', page: 'shop' as const },
  },
  {
    tag: 'Plants & Planters',
    heading: 'Bring Nature Home',
    subtitle: 'Golden cage planters, terrariums & lush greenery',
    image: '/images/hero/hero-slide-3.webp',
    cta: { label: 'Shop Plants', page: 'shop' as const },
  },
  {
    tag: 'Vases & Decor',
    heading: 'Artisan Vessels',
    subtitle: 'Hand-blown amber glass, crystal sculptures & brass bowls',
    image: '/images/hero/hero-slide-4.webp',
    cta: { label: 'Shop Vases', page: 'shop' as const },
  },
  {
    tag: 'Candles & Fragrance',
    heading: 'Set The Mood',
    subtitle: 'Marble candle holders, reed diffusers & scented wax',
    image: '/images/hero/hero-slide-5.webp',
    cta: { label: 'Shop Candles', page: 'shop' as const },
  },
];

const SLIDE_DURATION = 6000;
const TOTAL_SLIDES = slides.length;

export default function HeroSection() {
  const setPage = useStore((state) => state.setPage);
  const sectionRef = useRef<HTMLElement>(null);

  // Background layers for crossfade
  const bgARef = useRef<HTMLDivElement>(null);
  const bgBRef = useRef<HTMLDivElement>(null);
  const activeBg = useRef<'A' | 'B'>('A');

  // Content refs for GSAP animation
  const contentRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  // Navigation refs
  const dotsRef = useRef<HTMLDivElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);
  const isAnimating = useRef(false);
  const autoPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const slideTimeline = useRef<gsap.core.Timeline | null>(null);

  // ─── Crossfade background ─────────────────────────────────
  const crossfadeBg = useCallback((index: number) => {
    const img = slides[index].image;
    const nextLayer = activeBg.current === 'A' ? bgBRef.current : bgARef.current;
    const prevLayer = activeBg.current === 'A' ? bgARef.current : bgBRef.current;

    if (nextLayer && prevLayer) {
      const nextImg = nextLayer.querySelector('img');
      if (nextImg) nextImg.src = img;

      gsap.set(nextLayer, { opacity: 0, zIndex: 2 });
      gsap.to(nextLayer, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
      gsap.to(prevLayer, { opacity: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.1 });
      activeBg.current = activeBg.current === 'A' ? 'B' : 'A';
    }
  }, []);

  // ─── Animate content in ────────────────────────────────────
  const animateContentIn = useCallback(() => {
    if (slideTimeline.current) slideTimeline.current.kill();

    const tl = gsap.timeline({ delay: 0.3 });
    slideTimeline.current = tl;

    const els = [tagRef.current, headingRef.current, subtitleRef.current, ctaRef.current];
    const validEls = els.filter(Boolean) as HTMLElement[];

    // Set initial state
    gsap.set(validEls, { opacity: 0, y: 40, force3D: true });

    // Stagger reveal
    tl.to(tagRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    tl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.35');
    tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3');

    // Safety: force visible
    tl.call(() => {
      validEls.forEach(el => gsap.set(el, { opacity: 1, y: 0 }));
    });

    return tl;
  }, []);

  // ─── Animate content out ───────────────────────────────────
  const animateContentOut = useCallback(() => {
    const els = [tagRef.current, headingRef.current, subtitleRef.current, ctaRef.current];
    const validEls = els.filter(Boolean) as HTMLElement[];
    return gsap.to(validEls, {
      opacity: 0,
      y: -30,
      duration: 0.35,
      ease: 'power2.in',
      stagger: 0.04,
    });
  }, []);

  // ─── Go to slide ───────────────────────────────────────────
  const goToSlide = useCallback((index: number) => {
    if (isAnimating.current || index === current) return;
    isAnimating.current = true;

    // Stop autoplay
    if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    if (progressTween.current) progressTween.current.kill();

    // Crossfade background
    crossfadeBg(index);

    // Animate content out then in
    animateContentOut().then(() => {
      setCurrent(index);
      setTimeout(() => {
        animateContentIn();
        setTimeout(() => { isAnimating.current = false; }, 1200);
      }, 600);
    });

    // Update dots
    if (dotsRef.current) {
      Array.from(dotsRef.current.children).forEach((dot, i) => {
        gsap.to(dot, {
          width: i === index ? '28px' : '6px',
          backgroundColor: i === index ? '#D4AF37' : 'rgba(255,255,255,0.4)',
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    }
  }, [current, crossfadeBg, animateContentIn, animateContentOut]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % TOTAL_SLIDES);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
  }, [current, goToSlide]);

  // ─── Auto-play ─────────────────────────────────────────────
  const startAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);

    // Animate progress bar
    if (progressFillRef.current) {
      gsap.set(progressFillRef.current, { width: '0%' });
      progressTween.current = gsap.to(progressFillRef.current, {
        width: '100%',
        duration: SLIDE_DURATION / 1000,
        ease: 'none',
      });
    }

    autoPlayTimer.current = setTimeout(() => {
      nextSlide();
    }, SLIDE_DURATION);
  }, [nextSlide]);

  // ─── Initial setup ─────────────────────────────────────────
  useEffect(() => {
    // Set first background
    if (bgARef.current) {
      gsap.set(bgARef.current, { opacity: 1, zIndex: 1 });
    }
    if (bgBRef.current) {
      gsap.set(bgBRef.current, { opacity: 0, zIndex: 2 });
    }

    // Animate content in on first load
    animateContentIn();

    // Animate trust pill + stats + arrows in
    const decorEls = [trustRef.current, statsRef.current, arrowsRef.current].filter(Boolean) as HTMLElement[];
    gsap.set(decorEls, { opacity: 0, y: 20, force3D: true });
    gsap.to(decorEls, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 1.2,
    });

    // Set first dot active
    if (dotsRef.current) {
      const firstDot = dotsRef.current.children[0] as HTMLElement;
      if (firstDot) {
        gsap.set(firstDot, { width: '28px', backgroundColor: '#D4AF37' });
      }
    }

    // Start autoplay
    startAutoPlay();

    return () => {
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
      if (progressTween.current) progressTween.current.kill();
      if (slideTimeline.current) slideTimeline.current.kill();
    };
  }, []);

  // ─── Restart autoplay when slide changes ───────────────────
  useEffect(() => {
    if (current === 0) return; // Skip on initial mount
    startAutoPlay();
  }, [current, startAutoPlay]);

  // ─── Parallax on scroll (desktop only) ─────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Background parallax
      const bgContainer = sectionRef.current?.querySelector('.hero-bg-container');
      if (bgContainer) {
        gsap.to(bgContainer, {
          y: 150,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Content fade on scroll
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -60,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '50% top',
            scrub: 1.5,
          },
        });
      }

      // Stats fade on scroll
      if (statsRef.current) {
        gsap.to(statsRef.current, {
          opacity: 0,
          y: 30,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '40% top',
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Touch swipe ───────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { if (dx > 0) prevSlide(); else nextSlide(); }
    touchStartX.current = null;
  };

  const slide = slides[current];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#2C2C2C]"
      style={{ height: '100vh', height: '100dvh' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ═══ Background layers for GSAP crossfade ═══ */}
      <div className="hero-bg-container absolute inset-0">
        {/* Layer A */}
        <div ref={bgARef} className="absolute inset-0" style={{ opacity: 1, zIndex: 1 }}>
          <img src={slides[0].image} alt="" className="w-full h-full object-cover" loading="eager" fetchPriority="high" />
        </div>
        {/* Layer B */}
        <div ref={bgBRef} className="absolute inset-0" style={{ opacity: 0, zIndex: 2 }}>
          <img src={slides[0].image} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>

      {/* ═══ Overlay ═══ */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: 'linear-gradient(180deg, rgba(44,44,44,0.5) 0%, rgba(44,44,44,0.15) 30%, rgba(44,44,44,0.15) 60%, rgba(44,44,44,0.75) 100%)',
        }}
      />

      {/* ═══ Trust pill ═══ */}
      <div
        ref={trustRef}
        className="absolute top-24 sm:top-28 lg:top-32 left-1/2 -translate-x-1/2 z-[4]"
        style={{ opacity: 0 }}
      >
        <div
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full backdrop-blur-md"
          style={{ backgroundColor: 'rgba(255,253,247,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <div className="flex -space-x-2">
            {['https://i.pravatar.cc/40?img=1', 'https://i.pravatar.cc/40?img=5', 'https://i.pravatar.cc/40?img=8'].map((s, i) => (
              <img key={i} src={s} alt="" className="w-5 h-5 rounded-full border-2 object-cover" style={{ borderColor: 'rgba(255,253,247,0.3)' }} />
            ))}
          </div>
          <span className="text-white/90 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Loved by 5,000+ homes
          </span>
        </div>
      </div>

      {/* ═══ Center content ═══ */}
      <div ref={contentRef} className="absolute inset-0 z-[4] flex flex-col items-center justify-center px-4 sm:px-6">

        {/* Tag */}
        <div ref={tagRef} className="flex items-center gap-3 mb-5" style={{ opacity: 0 }}>
          <div className="w-8 h-px bg-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[4px] uppercase font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {slide.tag}
          </span>
          <div className="w-8 h-px bg-[#D4AF37]" />
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-white font-bold text-center leading-[1.1] mb-3 select-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 8vw, 80px)',
            textShadow: '0 2px 30px rgba(0,0,0,0.4)',
            opacity: 0,
          }}
        >
          {slide.heading}
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-white/80 text-center text-sm sm:text-lg mb-8 max-w-xl"
          style={{ fontFamily: "'Poppins', sans-serif", opacity: 0 }}
        >
          {slide.subtitle}
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          onClick={() => setPage(slide.cta.page)}
          className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer hover:gap-3 hover:shadow-[0_8px_40px_rgba(212,175,55,0.5)]"
          style={{
            backgroundColor: '#D4AF37',
            color: '#FFFFFF',
            fontFamily: "'Poppins', sans-serif",
            borderRadius: '50px',
            opacity: 0,
          }}
        >
          {slide.cta.label}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* ═══ Frosted stats bar ═══ */}
      <div
        ref={statsRef}
        className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-[4] w-[90%] max-w-2xl"
        style={{ opacity: 0 }}
      >
        <div
          className="flex items-center justify-around rounded-2xl backdrop-blur-md px-4 sm:px-8 py-3 sm:py-4"
          style={{ backgroundColor: 'rgba(255,253,247,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {[
            { n: '5,000+', l: 'Happy Homes' },
            { n: '200+', l: 'Artisans' },
            { n: '50+', l: 'Cities' },
            { n: '4.8★', l: 'Rating' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-white font-bold text-base sm:text-xl mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>{s.n}</span>
              <span className="text-white/60 text-[8px] sm:text-[10px] uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Arrows ═══ */}
      <div ref={arrowsRef} className="absolute inset-0 z-[5] pointer-events-none" style={{ opacity: 0 }}>
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-white/20 pointer-events-auto"
          style={{ backgroundColor: 'rgba(255,253,247,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-white/20 pointer-events-auto"
          style={{ backgroundColor: 'rgba(255,253,247,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* ═══ Dots ═══ */}
      <div ref={dotsRef} className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="h-1.5 rounded-full cursor-pointer transition-all duration-300"
            style={{
              width: '6px',
              backgroundColor: 'rgba(255,255,255,0.4)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ═══ Progress bar ═══ */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] z-[6] bg-white/10">
        <div ref={progressFillRef} className="h-full bg-[#D4AF37]" style={{ width: '0%' }} />
      </div>
    </section>
  );
}
