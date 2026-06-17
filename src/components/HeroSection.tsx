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
    overlay: 'linear-gradient(to right, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.5) 50%, rgba(44,44,44,0.2) 100%)',
    primaryBtn: { label: 'Shop Now', page: 'shop' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'Explore Collections', page: 'shop' as const, variant: 'outline' as const },
  },
  {
    tag: 'ARTISAN CRAFTSMANSHIP',
    heading: 'Handcrafted with Love',
    subtitle: 'Every piece tells a story of dedication, skill, and cultural heritage',
    image: '/images/hero/hero-slide-2.webp',
    overlay: 'linear-gradient(to right, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.5) 50%, rgba(44,44,44,0.2) 100%)',
    primaryBtn: { label: 'Meet Our Artisans', page: 'about' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'Shop Handcrafted', page: 'shop' as const, variant: 'outline' as const },
  },
  {
    tag: 'DINING COLLECTION',
    heading: 'Set the Perfect Table',
    subtitle: 'Gold-rimmed glassware and handcrafted ceramics for memorable gatherings',
    image: '/images/hero/hero-slide-3.webp',
    overlay: 'linear-gradient(to right, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.5) 50%, rgba(44,44,44,0.2) 100%)',
    primaryBtn: { label: 'Shop Dining', page: 'shop' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'View Lookbook', page: 'lookbook' as const, variant: 'outline' as const },
  },
  {
    tag: 'SERENE SPACES',
    heading: 'Find Your Sanctuary',
    subtitle: 'Soft candlelight, delicate vases, and warm textiles for peaceful retreats',
    image: '/images/hero/hero-slide-4.webp',
    overlay: 'linear-gradient(to right, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.5) 50%, rgba(44,44,44,0.2) 100%)',
    primaryBtn: { label: 'Shop Bedroom', page: 'shop' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'New Arrivals', page: 'new-arrivals' as const, variant: 'outline' as const },
  },
  {
    tag: 'BRING NATURE HOME',
    heading: 'The Botanical Corner',
    subtitle: 'Lush greenery in gold-rimmed planters brings life to any space',
    image: '/images/hero/hero-slide-5.webp',
    overlay: 'linear-gradient(to right, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.5) 50%, rgba(44,44,44,0.2) 100%)',
    primaryBtn: { label: 'Shop Plants', page: 'shop' as const, variant: 'gold' as const },
    secondaryBtn: { label: 'Care Guide', page: 'care-guide' as const, variant: 'outline' as const },
  },
];

const SLIDE_DURATION = 6000;
const TOTAL_SLIDES = slides.length;

/* ═══════════════════════════════════════════════════════════
   HERO SECTION — Modern Editorial Slider with GSAP Crossfade
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
  const animateSlideIn = useCallback(() => {
    if (slideTlRef.current) {
      slideTlRef.current.kill();
    }

    const tl = gsap.timeline({ delay: 0.12 });
    slideTlRef.current = tl;

    if (tagRef.current) {
      gsap.set(tagRef.current, { opacity: 0, y: -20, force3D: true });
      tl.to(tagRef.current, {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'power3.out',
      });
    }

    if (headingRef.current) {
      gsap.set(headingRef.current, { opacity: 0, y: 35, force3D: true });
      tl.to(headingRef.current, {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power3.out',
      }, '-=0.3');
    }

    if (dividerRef.current) {
      gsap.set(dividerRef.current, { opacity: 0, scaleX: 0, force3D: true });
      tl.to(dividerRef.current, {
        opacity: 1, scaleX: 1,
        duration: 0.45, ease: 'power3.out',
      }, '-=0.2');
    }

    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0, y: 25, force3D: true });
      tl.to(subtitleRef.current, {
        opacity: 1, y: 0,
        duration: 0.55, ease: 'power3.out',
      }, '-=0.2');
    }

    if (buttonsRef.current) {
      gsap.set(buttonsRef.current, { opacity: 1, y: 0 });
      const btns = buttonsRef.current.children;
      gsap.set(btns, { opacity: 0, y: 20, force3D: true });
      tl.to(btns, {
        opacity: 1, y: 0,
        duration: 0.45, stagger: 0.1, ease: 'power3.out',
      }, '-=0.2');
    }

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
  const BG_CROSSFADE_DURATION = 1.2;
  const TEXT_DELAY_AFTER_BG_START = 0.9;

  useEffect(() => {
    if (isTransitioningRef.current && currentSlide !== 0) return;

    const isFirstMount = currentSlide === 0 && !isTransitioningRef.current && !autoPlayTimerRef.current;

    if (!isFirstMount) {
      isTransitioningRef.current = true;
    }

    crossfadeBackground(currentSlide);

    const contentElements = contentRef.current?.querySelectorAll('.slide-content-el');
    if (contentElements && contentElements.length > 0 && !isFirstMount) {
      gsap.to(contentElements, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        stagger: 0.04,
        onComplete: () => {
          const remainingWait = Math.max(0, (TEXT_DELAY_AFTER_BG_START - 0.3) * 1000);
          setTimeout(() => {
            animateSlideIn();
            setTimeout(() => { isTransitioningRef.current = false; }, 1500);
          }, remainingWait);
        },
      });
    } else {
      animateSlideIn();
      if (!isFirstMount) {
        setTimeout(() => { isTransitioningRef.current = false; }, 1500);
      }
    }

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

    animateSlideIn();

    if (scrollIndicatorRef.current) {
      gsap.set(scrollIndicatorRef.current, { opacity: 0, y: -10 });
      gsap.to(scrollIndicatorRef.current, {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power2.out',
        delay: 2,
      });
    }

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

  // ─── Parallax: GSAP ScrollTrigger (DESKTOP ONLY) ─────
  useEffect(() => {
    if (!sectionRef.current) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
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

  // ─── Touch swipe handlers ─────────────────────────────────
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) prevSlide();
      else nextSlide();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [prevSlide, nextSlide]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden flex items-center group h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-7rem)]"
      style={{ minHeight: '500px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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

      {/* ═══ Main Content — Left-aligned, editorial style ═══ */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-center items-start text-left px-6 sm:px-10 lg:px-16 xl:px-20 max-w-2xl ml-0 lg:ml-8 w-full"
      >
        <div className="flex flex-col items-start gap-4 sm:gap-6">
          {/* Tag */}
          <span
            ref={tagRef}
            className="slide-content-el inline-flex items-center gap-2 text-[#D4AF37] text-xs sm:text-sm tracking-[3px] uppercase font-medium"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span className="w-8 h-px bg-[#D4AF37]" />
            {slide.tag}
          </span>

          {/* Main Heading */}
          <h1
            ref={headingRef}
            className="slide-content-el text-white font-bold leading-[1.1] cursor-default select-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(32px, 5vw, 64px)',
            }}
          >
            {slide.heading}
          </h1>

          {/* Gold accent line */}
          <div ref={dividerRef} className="slide-content-el h-[2px] bg-[#D4AF37]" style={{ width: '60px', transformOrigin: 'left center' }} />

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="slide-content-el text-white/80 text-sm sm:text-base md:text-lg max-w-md leading-relaxed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {slide.subtitle}
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className="slide-content-el flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mt-2">
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

      {/* ═══ Arrow Navigation ═══ */}
      <button
        onClick={prevSlide}
        className="touch-visible absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer hover:bg-white/10 hover:border-white/40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="touch-visible absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer hover:bg-white/10 hover:border-white/40"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* ═══ Navigation Dots ═══ */}
      <div ref={dotsRef} className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="w-2 h-2 rounded-full cursor-pointer transition-all duration-300"
            style={{
              backgroundColor: i === currentSlide ? '#D4AF37' : 'rgba(255,255,255,0.4)',
              transform: i === currentSlide ? 'scale(1.4)' : 'scale(1)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ═══ Scroll Indicator ═══ */}
      <div ref={scrollIndicatorRef} className="absolute bottom-8 right-6 sm:right-10 z-20 hidden sm:flex flex-col items-center gap-1">
        <span className="text-white/40 text-[9px] tracking-[3px] uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-white/60 animate-bounce" />
      </div>

      {/* ═══ Progress Bar ═══ */}
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 w-full z-30 h-[2px] bg-white/10"
      >
        <div
          ref={progressFillRef}
          className="h-full bg-[#D4AF37]"
          style={{ width: '0%' }}
        />
      </div>
    </section>
  );
}
