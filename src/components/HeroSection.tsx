'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { gsap, ScrollTrigger } from '@/hooks/useGsap';
import PremiumButton from '@/components/ui/PremiumButton';

/* ═══════════════════════════════════════════════════════════
   SLIDE DATA — 5 Premium Slides
   ═══════════════════════════════════════════════════════════ */
const slides = [
  {
    tag: 'NEW COLLECTION 2026',
    heading: 'Elevate Your Living Space',
    subtitle: 'Discover handpicked home decor that turns houses into homes',
    image: '/images/hero/hero-slide-1.webp',
    overlay: 'linear-gradient(135deg, rgba(44,44,44,0.75), rgba(212,175,55,0.15))',
    primaryBtn: { label: 'Shop Now', page: 'shop' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'Explore Collections', page: 'shop' as const, variant: 'outline' as const },
  },
  {
    tag: 'ARTISAN CRAFTSMANSHIP',
    heading: 'Handcrafted with Love',
    subtitle: 'Every piece tells a story of dedication, skill, and cultural heritage',
    image: '/images/hero/hero-slide-2.webp',
    overlay: 'linear-gradient(135deg, rgba(44,44,44,0.8), rgba(168,181,160,0.2))',
    primaryBtn: { label: 'Meet Our Artisans', page: 'about' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'Shop Handcrafted', page: 'shop' as const, variant: 'outline' as const },
  },
  {
    tag: 'DINING COLLECTION',
    heading: 'Set the Perfect Table',
    subtitle: 'Gold-rimmed glassware and handcrafted ceramics for memorable gatherings',
    image: '/images/hero/hero-slide-3.webp',
    overlay: 'linear-gradient(135deg, rgba(44,44,44,0.7), rgba(232,206,193,0.2))',
    primaryBtn: { label: 'Shop Dining', page: 'shop' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'View Lookbook', page: 'lookbook' as const, variant: 'outline' as const },
  },
  {
    tag: 'SERENE SPACES',
    heading: 'Find Your Sanctuary',
    subtitle: 'Soft candlelight, delicate vases, and warm textiles for peaceful retreats',
    image: '/images/hero/hero-slide-4.webp',
    overlay: 'linear-gradient(135deg, rgba(44,44,44,0.75), rgba(212,175,55,0.18))',
    primaryBtn: { label: 'Shop Bedroom', page: 'shop' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'New Arrivals', page: 'new-arrivals' as const, variant: 'outline' as const },
  },
  {
    tag: 'BRING NATURE HOME',
    heading: 'The Botanical Corner',
    subtitle: 'Lush greenery in gold-rimmed planters brings life to any space',
    image: '/images/hero/hero-slide-5.webp',
    overlay: 'linear-gradient(135deg, rgba(44,44,44,0.7), rgba(168,181,160,0.25))',
    primaryBtn: { label: 'Shop Plants', page: 'shop' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'Care Guide', page: 'care-guide' as const, variant: 'outline' as const },
  },
];

const SLIDE_DURATION = 6000; // 6 seconds per slide
const TOTAL_SLIDES = slides.length;

/* ═══════════════════════════════════════════════════════════
   GOLD ORB — CSS-only floating divs with GSAP-enhanced motion
   ═══════════════════════════════════════════════════════════ */

function GoldOrb({ size, top, left, opacity = 0.15 }: {
  size: number; top: string; left: string; opacity?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none hidden md:block"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle, rgba(212, 175, 55, ${opacity}) 0%, rgba(212, 175, 55, ${opacity * 0.3}) 40%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(30px)',
        // willChange removed — GPU-layer promotion handled by GSAP force3D
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   MARQUEE STRIP — CSS-only marquee
   ═══════════════════════════════════════════════════════════ */

function MarqueeStrip() {
  const text = 'AURA LIVING \u2022 HOME DECOR \u2022 PAKISTAN \u2022 HANDCRAFTED \u2022 LUXURY \u2022 ';
  const repeated = text.repeat(6);
  return (
    <div className="absolute bottom-0 left-0 w-full z-20 overflow-hidden bg-[#2C2C2C]/70 backdrop-blur-sm border-t border-[#D4AF37]/20">
      <div className="animate-marquee whitespace-nowrap py-2.5">
        <span className="text-[#D4AF37]/80 text-xs tracking-[4px] uppercase" style={{ fontFamily: "'Archivo Narrow', sans-serif" }}>
          {repeated}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION — 5-Slide Slider with GSAP Crossfade & Ken Burns
   ═══════════════════════════════════════════════════════════ */

export default function HeroSection() {
  const setPage = useStore((state) => state.setPage);
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgALayerRef = useRef<HTMLDivElement>(null);
  const bgBLayerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const isTransitioningRef = useRef(false);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressAnimRef = useRef<gsap.core.Tween | null>(null);
  const activeBgRef = useRef<'A' | 'B'>('A');
  const slideTlRef = useRef<gsap.core.Timeline | null>(null);

  // Slide content refs for animation
  const tagRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // ─── Progress bar animation ───────────────────────────────
  const animateProgress = useCallback(() => {
    if (progressAnimRef.current) {
      progressAnimRef.current.kill();
    }
    if (progressFillRef.current) {
      gsap.set(progressFillRef.current, { width: '0%' });
      progressAnimRef.current = gsap.to(progressFillRef.current, {
        width: '100%',
        duration: SLIDE_DURATION / 1000,
        ease: 'none',
      });
    }
  }, []);

  // ─── Auto-play logic ──────────────────────────────────────
  const startAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    animateProgress();
    autoPlayTimerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
    }, SLIDE_DURATION);
  }, [animateProgress]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    if (progressAnimRef.current) {
      progressAnimRef.current.kill();
    }
  }, []);

  // ─── Animate slide content entrance ───────────────────────
  // All animations use ONLY opacity + transform (GPU-composited).
  // No filter:blur(), no clipPath — those cause repaints and jank.
  const animateSlideIn = useCallback(() => {
    if (slideTlRef.current) {
      slideTlRef.current.kill();
    }

    const tl = gsap.timeline({ delay: 0.12 });
    slideTlRef.current = tl;

    // Tag: slide down + scale (no blur — GPU only)
    if (tagRef.current) {
      gsap.set(tagRef.current, { opacity: 0, y: -20, scale: 0.9, force3D: true });
      tl.to(tagRef.current, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6, ease: 'power3.out',
      });
    }

    // Heading: slide up + fade (no clipPath — causes layout thrash)
    if (headingRef.current) {
      gsap.set(headingRef.current, { opacity: 0, y: 35, force3D: true });
      tl.to(headingRef.current, {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out',
      }, '-=0.3');
    }

    // Divider: scale + fade
    if (dividerRef.current) {
      gsap.set(dividerRef.current, { opacity: 0, scaleX: 0, force3D: true });
      tl.to(dividerRef.current, {
        opacity: 1, scaleX: 1,
        duration: 0.45, ease: 'power3.out',
      }, '-=0.2');
    }

    // Subtitle: slide up + fade (no blur — GPU only)
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0, y: 25, force3D: true });
      tl.to(subtitleRef.current, {
        opacity: 1, y: 0,
        duration: 0.55, ease: 'power3.out',
      }, '-=0.2');
    }

    // Buttons: stagger reveal — parent must be set visible first
    if (buttonsRef.current) {
      gsap.set(buttonsRef.current, { opacity: 1, y: 0 });
      const btns = buttonsRef.current.children;
      gsap.set(btns, { opacity: 0, y: 20, force3D: true });
      tl.to(btns, {
        opacity: 1, y: 0,
        duration: 0.45, stagger: 0.1, ease: 'power3.out',
      }, '-=0.2');
    }

    // Safety: force all slide-content-el visible at timeline end
    tl.call(() => {
      if (contentRef.current) {
        const allEls = contentRef.current.querySelectorAll('.slide-content-el');
        allEls.forEach((el) => {
          const htmlEl = el as HTMLElement;
          gsap.set(htmlEl, { opacity: 1, y: 0 });
          if (htmlEl === buttonsRef.current) {
            Array.from(htmlEl.children).forEach((child) => {
              gsap.set(child as HTMLElement, { opacity: 1, y: 0 });
            });
          }
        });
      }
    });

    return tl;
  }, []);

  // ─── Crossfade background transition ──────────────────────
  const crossfadeBackground = useCallback((slideIndex: number) => {
    const nextImage = slides[slideIndex].image;
    const nextOverlay = slides[slideIndex].overlay;

    if (activeBgRef.current === 'A') {
      // Fade out A, fade in B
      if (bgBLayerRef.current) {
        const img = bgBLayerRef.current.querySelector('.hero-bg-img') as HTMLElement;
        const overlayEl = bgBLayerRef.current.querySelector('.bg-overlay') as HTMLElement;
        if (img) img.style.backgroundImage = `url(${nextImage})`;
        if (overlayEl) overlayEl.style.background = nextOverlay;
        gsap.set(bgBLayerRef.current, { opacity: 0, zIndex: 2 });
        gsap.to(bgBLayerRef.current, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
      }
      if (bgALayerRef.current) {
        gsap.to(bgALayerRef.current, { opacity: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.1 });
      }
      activeBgRef.current = 'B';
    } else {
      // Fade out B, fade in A
      if (bgALayerRef.current) {
        const img = bgALayerRef.current.querySelector('.hero-bg-img') as HTMLElement;
        const overlayEl = bgALayerRef.current.querySelector('.bg-overlay') as HTMLElement;
        if (img) img.style.backgroundImage = `url(${nextImage})`;
        if (overlayEl) overlayEl.style.background = nextOverlay;
        gsap.set(bgALayerRef.current, { opacity: 0, zIndex: 2 });
        gsap.to(bgALayerRef.current, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
      }
      if (bgBLayerRef.current) {
        gsap.to(bgBLayerRef.current, { opacity: 0, duration: 1.2, ease: 'power2.inOut', delay: 0.1 });
      }
      activeBgRef.current = 'A';
    }
  }, []);

  // ─── Handle slide transitions ─────────────────────────────
  // Background crossfade takes 1.2s. We want the new slide image to be
  // visible BEFORE the new text appears, so we delay text animation by ~0.9s
  // after the background starts transitioning.
  const BG_CROSSFADE_DURATION = 1.2; // seconds — matches crossfadeBackground()
  const TEXT_DELAY_AFTER_BG_START = 0.9; // seconds — wait for bg to mostly finish

  useEffect(() => {
    if (isTransitioningRef.current && currentSlide !== 0) return;

    // Skip transition guard on first mount
    const isFirstMount = currentSlide === 0 && !isTransitioningRef.current && !autoPlayTimerRef.current;

    if (!isFirstMount) {
      isTransitioningRef.current = true;
    }

    // Start crossfade background immediately
    crossfadeBackground(currentSlide);

    // Animate out current content FIRST (quick fade-out)
    const contentElements = contentRef.current?.querySelectorAll('.slide-content-el');
    if (contentElements && contentElements.length > 0 && !isFirstMount) {
      gsap.to(contentElements, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        stagger: 0.04,
        onComplete: () => {
          // Now WAIT for the background crossfade to be mostly done
          // before bringing in the new text
          const remainingWait = Math.max(0, (TEXT_DELAY_AFTER_BG_START - 0.3) * 1000);
          setTimeout(() => {
            animateSlideIn();
            setTimeout(() => { isTransitioningRef.current = false; }, 1500);
          }, remainingWait);
        },
      });
    } else {
      // First load — animate in immediately (no bg crossfade on first load)
      animateSlideIn();
      if (!isFirstMount) {
        setTimeout(() => { isTransitioningRef.current = false; }, 1500);
      }
    }

    // Update active dot
    if (dotsRef.current) {
      const dots = dotsRef.current.children;
      Array.from(dots).forEach((dot, i) => {
        if (i === currentSlide) {
          gsap.to(dot, { scale: 1.4, backgroundColor: '#D4AF37', duration: 0.4, ease: 'power2.out' });
        } else {
          gsap.to(dot, { scale: 1, backgroundColor: 'rgba(255,255,255,0.4)', duration: 0.4, ease: 'power2.out' });
        }
      });
    }
  }, [currentSlide]);

  // ─── Initial setup ────────────────────────────────────────
  useEffect(() => {
    // Set initial background on layer A
    if (bgALayerRef.current) {
      const img = bgALayerRef.current.querySelector('.hero-bg-img') as HTMLElement;
      const overlayEl = bgALayerRef.current.querySelector('.bg-overlay') as HTMLElement;
      if (img) img.style.backgroundImage = `url(${slides[0].image})`;
      if (overlayEl) overlayEl.style.background = slides[0].overlay;
      gsap.set(bgALayerRef.current, { opacity: 1 });
    }
    if (bgBLayerRef.current) {
      gsap.set(bgBLayerRef.current, { opacity: 0 });
    }

    // Initial content animation
    animateSlideIn();

    // Scroll indicator: fade in
    if (scrollIndicatorRef.current) {
      gsap.set(scrollIndicatorRef.current, { opacity: 0, y: -10 });
      gsap.to(scrollIndicatorRef.current, {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power2.out',
        delay: 2,
      });
    }

    // Animate dots
    if (dotsRef.current) {
      const dots = dotsRef.current.children;
      Array.from(dots).forEach((dot, i) => {
        if (i === 0) {
          gsap.set(dot, { scale: 1.4, backgroundColor: '#D4AF37' });
        } else {
          gsap.set(dot, { scale: 1, backgroundColor: 'rgba(255,255,255,0.4)' });
        }
      });
    }

    startAutoPlay();

    return () => {
      stopAutoPlay();
      if (slideTlRef.current) slideTlRef.current.kill();
      if (progressAnimRef.current) progressAnimRef.current.kill();
    };
  }, []);

  // ─── Parallax: GSAP ScrollTrigger (DESKTOP ONLY — no scroll animations on mobile) ─────
  useEffect(() => {
    if (!sectionRef.current) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Skip ALL scroll-triggered animations on mobile for buttery performance
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Desktop: smooth parallax + content fade
      // scrub: 2 = 2-second smoothing buffer for buttery feel
      const bgContainer = sectionRef.current?.querySelector('.bg-parallax-container') as HTMLElement;
      if (bgContainer) {
        gsap.to(bgContainer, {
          y: 100,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        });
      }

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -40,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '60% top',
            scrub: 2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Navigation helpers ───────────────────────────────────
  const goToSlide = useCallback((index: number) => {
    if (isTransitioningRef.current || index === currentSlide) return;
    stopAutoPlay();
    setCurrentSlide(index);
    // Restart autoplay after transition
    setTimeout(() => { startAutoPlay(); }, 1600);
  }, [currentSlide, startAutoPlay, stopAutoPlay]);

  const prevSlide = useCallback(() => {
    const newIndex = (currentSlide - 1 + TOTAL_SLIDES) % TOTAL_SLIDES;
    goToSlide(newIndex);
  }, [currentSlide, goToSlide]);

  const nextSlide = useCallback(() => {
    const newIndex = (currentSlide + 1) % TOTAL_SLIDES;
    goToSlide(newIndex);
  }, [currentSlide, goToSlide]);

  const slide = slides[currentSlide];

  // ─── Format slide number ──────────────────────────────────
  const formatSlideNum = (n: number) => String(n + 1).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden flex items-center justify-center group"
      style={{ height: '100vh', minHeight: '600px' }}
      onMouseEnter={() => {
        // Show arrows on hover via CSS group
      }}
    >
      {/* ═══ Parallax Background Container ═══ */}
      <div className="bg-parallax-container absolute inset-0 w-full md:h-[130%] md:-top-[15%]">
        {/* Background Layer A */}
        <div
          ref={bgALayerRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 1, zIndex: 1 }}
        >
          <div
            className="hero-bg-img absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${slides[0].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="bg-overlay absolute inset-0"
            style={{ background: slides[0].overlay }}
          />
        </div>

        {/* Background Layer B */}
        <div
          ref={bgBLayerRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0, zIndex: 2 }}
        >
          <div
            className="hero-bg-img absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${slides[0].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="bg-overlay absolute inset-0"
            style={{ background: slides[0].overlay }}
          />
        </div>
      </div>

      {/* ═══ Animated grain texture overlay ═══ */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ═══ Vignette ═══ */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(44,44,44,0.4) 100%)',
        }}
      />

      {/* ═══ Corner ornaments ═══ */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-12 h-12 sm:w-[100px] sm:h-[100px] border-t border-l border-[#D4AF37]/50 pointer-events-none z-20" />
      <div className="absolute bottom-16 right-4 sm:bottom-24 sm:right-6 w-12 h-12 sm:w-[100px] sm:h-[100px] border-b border-r border-[#D4AF37]/50 pointer-events-none z-20" />

      {/* ═══ Floating Gold Orbs — GSAP-enhanced ═══ */}
      <GoldOrb size={200} top="8%" left="5%" opacity={0.12} />
      <GoldOrb size={140} top="50%" left="85%" opacity={0.08} />
      <GoldOrb size={170} top="65%" left="12%" opacity={0.10} />

      {/* ═══ Main Content ═══ */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      >
        <div className="flex flex-col items-center gap-5 sm:gap-7">
          {/* Tag */}
          <span
            ref={tagRef}
            className="slide-content-el inline-block text-[#D4AF37] text-[10px] sm:text-xs tracking-[4px] uppercase font-medium"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {slide.tag}
          </span>

          {/* Main Heading */}
          <h1
            ref={headingRef}
            className="slide-content-el text-white font-bold leading-[1.1] cursor-default select-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(38px, 6vw, 72px)',
            }}
          >
            {slide.heading}
          </h1>

          {/* Divider */}
          <div ref={dividerRef} className="slide-content-el flex items-center gap-3" style={{ transformOrigin: 'center' }}>
            <div className="w-8 sm:w-14 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <div className="w-8 sm:w-14 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="slide-content-el text-[#E8D5A3] text-sm sm:text-base md:text-lg max-w-lg leading-relaxed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {slide.subtitle}
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className="slide-content-el flex flex-col sm:flex-row items-center gap-4 mt-2 sm:mt-4">
            <PremiumButton variant={slide.primaryBtn.variant} onClick={() => setPage(slide.primaryBtn.page)}>
              {slide.primaryBtn.label}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </PremiumButton>
            <PremiumButton variant={slide.secondaryBtn.variant} onClick={() => setPage(slide.secondaryBtn.page)}>
              {slide.secondaryBtn.label}
            </PremiumButton>
          </div>
        </div>
      </div>

      {/* ═══ Slide Number Indicator ═══ */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 flex items-center gap-2">
        <span
          className="text-[#D4AF37] text-sm sm:text-base font-light tracking-widest"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {formatSlideNum(currentSlide)}
        </span>
        <span className="text-white/30 text-sm sm:text-base">/</span>
        <span
          className="text-white/40 text-sm sm:text-base font-light tracking-widest"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {formatSlideNum(TOTAL_SLIDES - 1)}
        </span>
      </div>

      {/* ═══ Arrow Navigation ═══ */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#D4AF37]/30 bg-[#2C2C2C]/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/60"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#D4AF37]/30 bg-[#2C2C2C]/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/60"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
      </button>

      {/* ═══ Navigation Dots ═══ */}
      <div ref={dotsRef} className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300"
            style={{
              backgroundColor: i === currentSlide ? '#D4AF37' : 'rgba(255,255,255,0.4)',
              transform: i === currentSlide ? 'scale(1.4)' : 'scale(1)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ═══ Scroll Indicator ═══ */}
      <div ref={scrollIndicatorRef} className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 sm:gap-2">
        <span className="text-white/40 text-[9px] sm:text-[10px] tracking-[4px] uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Scroll
        </span>
        <ChevronDown className="w-5 h-5 text-white/60 animate-bounce" />
      </div>

      {/* ═══ Progress Bar ═══ */}
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 w-full z-30 h-[2px] bg-transparent"
      >
        <div
          ref={progressFillRef}
          className="h-full bg-[#D4AF37]"
          style={{ width: '0%' }}
        />
      </div>

      {/* ═══ Marquee ═══ */}
      <MarqueeStrip />
    </section>
  );
}
