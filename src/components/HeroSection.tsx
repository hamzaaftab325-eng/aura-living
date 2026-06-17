'use client';

/**
 * Aura Living — Hero Section
 * ───────────────────────────────────────────────────────────────────────────
 * A modern, editorial, full-viewport hero slider for a premium Pakistani
 * home-decor brand. Asymmetric left-aligned layout with a vertical gold
 * accent bar, frosted-glass trust + stats capsules, glassmorphism arrows,
 * pill-shaped dot navigation, and a GSAP-driven crossfade engine.
 *
 * Animation stack (all GPU-accelerated via force3D):
 *  • Background — two-layer A/B crossfade (power2.inOut, 1.2s)
 *  • Content  — timeline stagger: tag slides down, heading slides up,
 *                subtitle fades, CTA bounces in (back.out)
 *  • Content exit — quick fade + lift before the new slide's text appears
 *  • Scroll  — background parallax (slower) + content/stats fade (scrub 1.5,
 *              desktop only)
 *  • Progress bar — GSAP width tween 0 → 100% per slide
 *  • Dots — GSAP animates width + color on slide change
 *  • Decor (trust pill, stats, arrows) — staggered fade-in after content
 *
 * Fonts:  Playfair Display (headings) · Poppins (body) — loaded in layout.tsx
 * Images: /images/hero/hero-slide-1..5.webp (1920×1080 WebP, pre-existing)
 */

import { useEffect, useRef, useCallback, useState, Fragment } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { gsap, ScrollTrigger } from '@/hooks/useGsap';

// ScrollTrigger is registered in @/hooks/useGsap, but registering again is
// cheap and guards against any future tree-shaking surprises.
gsap.registerPlugin(ScrollTrigger);

// ─── Slide data ────────────────────────────────────────────────────────────
type SlidePage = 'shop' | 'lookbook' | 'new-arrivals' | 'sale';

interface Slide {
  tag: string;
  heading: string;
  subtitle: string;
  image: string;
  cta: { label: string; page: SlidePage };
}

const slides: Slide[] = [
  {
    tag: 'New Collection 2026',
    heading: 'Elevate Your Space',
    subtitle: 'Handcrafted home decor that turns houses into homes',
    image: '/images/hero/hero-slide-1.webp',
    cta: { label: 'Shop Collection', page: 'shop' },
  },
  {
    tag: 'Lighting Collection',
    heading: 'Light Up Your Life',
    subtitle: 'Brass table lamps, pendant lights & crystal fixtures',
    image: '/images/hero/hero-slide-2.webp',
    cta: { label: 'Shop Lighting', page: 'shop' },
  },
  {
    tag: 'Plants & Planters',
    heading: 'Bring Nature Home',
    subtitle: 'Golden cage planters, terrariums & lush greenery',
    image: '/images/hero/hero-slide-3.webp',
    cta: { label: 'Shop Plants', page: 'shop' },
  },
  {
    tag: 'Vases & Decor',
    heading: 'Artisan Vessels',
    subtitle: 'Hand-blown amber glass, crystal sculptures & brass bowls',
    image: '/images/hero/hero-slide-4.webp',
    cta: { label: 'Shop Vases', page: 'shop' },
  },
  {
    tag: 'Candles & Fragrance',
    heading: 'Set The Mood',
    subtitle: 'Marble candle holders, reed diffusers & scented wax',
    image: '/images/hero/hero-slide-5.webp',
    cta: { label: 'Shop Candles', page: 'shop' },
  },
];

// ─── Static config ─────────────────────────────────────────────────────────
const SLIDE_DURATION = 6000; // ms per slide (autoplay)
const TOTAL_SLIDES = slides.length;
const CROSSFADE_S = 1.2; // background crossfade duration

// Trust-pill avatars as on-brand gradient circles (no external image deps).
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
  'linear-gradient(135deg, #A8B5A0 0%, #7A8A70 100%)',
  'linear-gradient(135deg, #B8A99A 0%, #8A7A6A 100%)',
];

const STATS = [
  { n: '5,000+', l: 'Happy Homes' },
  { n: '200+', l: 'Artisans' },
  { n: '50+', l: 'Cities' },
  { n: '4.8★', l: 'Rating' },
] as const;

// ─── Component ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const setPage = useStore((state) => state.setPage);

  // Root + layer refs
  const sectionRef = useRef<HTMLElement>(null);
  const bgARef = useRef<HTMLDivElement>(null);
  const bgBRef = useRef<HTMLDivElement>(null);
  const activeBg = useRef<'A' | 'B'>('A');

  // Content refs (animated by the entrance/exit timeline)
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  // Decor refs
  const trustRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);

  // State + animation guards
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0); // always-latest index (avoids stale closures)
  const isAnimating = useRef(false);
  const slideTimeline = useRef<gsap.core.Timeline | null>(null);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const autoPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pause-on-hover bookkeeping
  const isPaused = useRef(false);
  const remainingMs = useRef(SLIDE_DURATION);
  const pauseStartedAt = useRef(0);

  // Touch-swipe tracking
  const touchStartX = useRef<number | null>(null);

  // ── Refs that break the circular goToSlide ↔ startAutoPlay dependency.
  //    Each callback reads the latest version via these refs, so we never
  //    need to list the other in a dependency array (and never need an
  //    eslint-disable for react-hooks/exhaustive-deps).
  const goToSlideRef = useRef<(index: number) => void>(() => {});
  const startAutoPlayRef = useRef<() => void>(() => {});

  // ─── Background crossfade (two-layer A/B) ────────────────────────────────
  const crossfadeBg = useCallback((index: number) => {
    const img = slides[index].image;
    const nextLayer = activeBg.current === 'A' ? bgBRef.current : bgARef.current;
    const prevLayer = activeBg.current === 'A' ? bgARef.current : bgBRef.current;
    if (!nextLayer || !prevLayer) return;

    const nextImg = nextLayer.querySelector('img');
    if (nextImg) nextImg.src = img;

    // Bring the incoming layer above, fade it in; fade the outgoing layer out.
    gsap.set(nextLayer, { opacity: 0, zIndex: 2 });
    gsap.to(nextLayer, {
      opacity: 1,
      duration: CROSSFADE_S,
      ease: 'power2.inOut',
      force3D: true,
    });
    gsap.to(prevLayer, {
      opacity: 0,
      duration: CROSSFADE_S,
      ease: 'power2.inOut',
      delay: 0.1,
      force3D: true,
    });
    activeBg.current = activeBg.current === 'A' ? 'B' : 'A';
  }, []);

  // ─── Content entrance (staggered timeline) ───────────────────────────────
  const animateContentIn = useCallback((delay = 0.15) => {
    if (slideTimeline.current) slideTimeline.current.kill();

    // Pull refs into locals so TypeScript narrows them to HTMLElement (and we
    // never hand a null target to GSAP, which would log a console warning).
    const tag = tagRef.current;
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    if (!tag || !heading || !subtitle || !cta) return;

    const tl = gsap.timeline({ delay });
    slideTimeline.current = tl;

    // Initial hidden states — each element enters from a different direction
    // for an editorial feel: tag from above, heading/sub/cta from below.
    gsap.set(tag, { opacity: 0, y: -26, force3D: true });
    gsap.set(heading, { opacity: 0, y: 52, force3D: true });
    gsap.set(subtitle, { opacity: 0, y: 26, force3D: true });
    gsap.set(cta, { opacity: 0, y: 26, scale: 0.92, force3D: true });

    // Tag slides DOWN into place
    tl.to(tag, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      force3D: true,
    })
      // Heading slides UP with fade — the hero moment
      .to(
        heading,
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', force3D: true },
        '-=0.32'
      )
      // Subtitle fades + lifts gently
      .to(
        subtitle,
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', force3D: true },
        '-=0.5'
      )
      // CTA bounces in with back.out
      .to(
        cta,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'back.out(1.7)',
          force3D: true,
        },
        '-=0.35'
      )
      // Safety net — guarantee visible state even if a tween is interrupted
      .call(() => {
        [tag, heading, subtitle, cta].forEach((el) =>
          gsap.set(el, { opacity: 1, y: 0, scale: 1 })
        );
      });

    return tl;
  }, []);

  // ─── Content exit (quick fade + lift) ────────────────────────────────────
  // Returns a Promise that resolves when the exit completes (or immediately
  // if there's nothing to animate), so the caller can chain the swap + enter.
  const animateContentOut = useCallback((): Promise<void> => {
    if (slideTimeline.current) slideTimeline.current.kill();
    const els = [tagRef.current, headingRef.current, subtitleRef.current, ctaRef.current].filter(
      Boolean
    ) as HTMLElement[];
    if (!els.length) return Promise.resolve();
    return new Promise((resolve) => {
      gsap.to(els, {
        opacity: 0,
        y: -34,
        duration: 0.32,
        ease: 'power2.in',
        stagger: 0.04,
        force3D: true,
        onComplete: resolve,
      });
    });
  }, []);

  // ─── Update dots (width + color via GSAP) ────────────────────────────────
  const updateDots = useCallback((index: number) => {
    if (!dotsRef.current) return;
    Array.from(dotsRef.current.children).forEach((dot, i) => {
      gsap.to(dot, {
        width: i === index ? '34px' : '7px',
        backgroundColor: i === index ? '#D4AF37' : 'rgba(255,255,255,0.38)',
        duration: 0.45,
        ease: 'power2.out',
      });
    });
  }, []);

  // ─── Progress bar tween (GSAP width 0 → 100%) ────────────────────────────
  const runProgress = useCallback((durationMs: number) => {
    if (!progressFillRef.current) return;
    if (progressTween.current) progressTween.current.kill();
    gsap.set(progressFillRef.current, { width: '0%' });
    progressTween.current = gsap.to(progressFillRef.current, {
      width: '100%',
      duration: durationMs / 1000,
      ease: 'none',
    });
  }, []);

  // ─── Autoplay (with pause-on-hover support) ──────────────────────────────
  const startAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    remainingMs.current = SLIDE_DURATION;
    runProgress(SLIDE_DURATION);
    autoPlayTimer.current = setTimeout(() => {
      goToSlideRef.current(currentRef.current + 1);
    }, SLIDE_DURATION);
  }, [runProgress]);

  const pauseAutoPlay = useCallback(() => {
    if (isPaused.current) return;
    isPaused.current = true;
    pauseStartedAt.current = Date.now();
    if (progressTween.current) progressTween.current.pause();
    if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
  }, []);

  const resumeAutoPlay = useCallback(() => {
    if (!isPaused.current) return;
    const elapsed = Date.now() - pauseStartedAt.current;
    remainingMs.current = Math.max(0, remainingMs.current - elapsed);
    isPaused.current = false;
    if (progressTween.current) progressTween.current.resume();
    if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    autoPlayTimer.current = setTimeout(() => {
      goToSlideRef.current(currentRef.current + 1);
    }, remainingMs.current);
  }, []);

  // ─── Go to slide ─────────────────────────────────────────────────────────
  const goToSlide = useCallback(
    (index: number) => {
      const idx = ((index % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES;
      if (isAnimating.current || idx === currentRef.current) return;
      isAnimating.current = true;

      // Halt autoplay + progress while transitioning
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
      if (progressTween.current) progressTween.current.kill();

      // 1) Crossfade the background image
      crossfadeBg(idx);

      // 2) Animate current content out, then swap text + animate new content in
      animateContentOut().then(() => {
        currentRef.current = idx;
        setCurrent(idx);
        updateDots(idx);

        // Wait two frames so React commits the new slide's text before we
        // animate the (same) DOM nodes back in.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            animateContentIn(0.05);
            // Release the lock once the entrance has visually committed
            setTimeout(() => {
              isAnimating.current = false;
            }, 1100);
            // Restart the autoplay cycle for the new slide
            startAutoPlayRef.current();
          });
        });
      });
    },
    [crossfadeBg, animateContentOut, animateContentIn, updateDots]
  );

  const nextSlide = useCallback(() => goToSlideRef.current(currentRef.current + 1), []);
  const prevSlide = useCallback(() => goToSlideRef.current(currentRef.current - 1), []);

  // Keep the circular-dep-breaking refs in sync every render
  useEffect(() => {
    goToSlideRef.current = goToSlide;
    startAutoPlayRef.current = startAutoPlay;
  });

  // ─── Mount: initial reveal + autoplay + parallax ─────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initial background state
    if (bgARef.current) gsap.set(bgARef.current, { opacity: 1, zIndex: 1 });
    if (bgBRef.current) gsap.set(bgBRef.current, { opacity: 0, zIndex: 2 });

    // First content entrance
    animateContentIn(0.25);

    // Decor staggered fade-in (trust → stats → arrows).
    // Guarded so we never pass an empty target array to GSAP (which would
    // log a console warning during HMR edge cases).
    const decor = [trustRef.current, statsRef.current, arrowsRef.current].filter(
      Boolean
    ) as HTMLElement[];
    if (decor.length) {
      gsap.set(decor, { opacity: 0, y: 22, force3D: true });
      gsap.to(decor, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 1.1,
        force3D: true,
      });
    }

    // Activate first dot
    if (dotsRef.current) {
      const first = dotsRef.current.children[0] as HTMLElement | undefined;
      if (first) gsap.set(first, { width: '34px', backgroundColor: '#D4AF37' });
    }

    // Autoplay (skipped for reduced-motion users)
    if (!prefersReduced) startAutoPlay();

    // Scroll parallax — desktop only, scrubbed for a buttery feel.
    // The bg container is oversized (top:-30% / height:165%) so the
    // downward parallax translate never reveals an uncovered edge.
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    let ctx: gsap.Context | undefined;
    if (!isMobile && !prefersReduced && sectionRef.current) {
      ctx = gsap.context(() => {
        const bgContainer = sectionRef.current?.querySelector('.hero-bg-container');
        if (bgContainer) {
          gsap.to(bgContainer, {
            y: 100,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top top',
              end: '60% top',
              scrub: 1.5,
            },
          });
        }
        if (contentWrapRef.current) {
          gsap.to(contentWrapRef.current, {
            opacity: 0,
            y: -70,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top top',
              end: '55% top',
              scrub: 1.5,
            },
          });
        }
        if (statsRef.current) {
          gsap.to(statsRef.current, {
            opacity: 0,
            y: 36,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top top',
              end: '45% top',
              scrub: 1.5,
            },
          });
        }
      }, sectionRef);
    }

    return () => {
      ctx?.revert();
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
      if (progressTween.current) progressTween.current.kill();
      if (slideTimeline.current) slideTimeline.current.kill();
    };
    // Mount-only: runs once. Callbacks referenced here are stable
    // useCallbacks (or read via refs), so an empty dep array is intentional.
  }, []);

  // ─── Touch swipe ─────────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prevSlide();
      else nextSlide();
    }
    touchStartX.current = null;
  };

  const slide = slides[current];

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      // dvh-fallback (from globals.css) sets height:100vh then 100dvh so the
      // hero is exactly the viewport height on both legacy + mobile browsers.
      className="dvh-fallback relative w-full overflow-hidden bg-[#2C2C2C] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {/* ════════════ Background layers (A/B crossfade) ════════════ */}
      {/* Oversized vertically so the scroll-parallax translate never reveals
          an uncovered edge. The section's overflow-hidden clips the excess. */}
      <div
        className="hero-bg-container absolute left-0 right-0 overflow-hidden"
        style={{ top: '-30%', height: '165%' }}
      >
        {/* Layer A — first image is eager + high-priority for fast LCP */}
        <div ref={bgARef} className="absolute inset-0" style={{ opacity: 1, zIndex: 1 }}>
          <img
            src={slides[0].image}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        {/* Layer B — hidden initially, swapped in on first crossfade */}
        <div ref={bgBRef} className="absolute inset-0" style={{ opacity: 0, zIndex: 2 }}>
          <img
            src={slides[0].image}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* ════════════ Overlay (3 cinematic layers) ════════════ */}
      {/* Layer 1 — legibility: dark top (navbar) + dark bottom (text), soft
          middle, plus a left-side darken to anchor the left-aligned content. */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,18,15,0.55) 0%, rgba(20,18,15,0.05) 30%, rgba(20,18,15,0.12) 58%, rgba(20,18,15,0.78) 100%), linear-gradient(90deg, rgba(20,18,15,0.55) 0%, rgba(20,18,15,0.12) 48%, transparent 78%)',
        }}
      />
      {/* Layer 2 — warm gold tint for brand warmth (~6% opacity) */}
      <div
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 28% 42%, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 45%, transparent 70%)',
        }}
      />
      {/* Layer 3 — vignette to deepen the corners */}
      <div
        className="absolute inset-0 z-[7] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 42%, rgba(0,0,0,0.38) 100%)',
        }}
      />

      {/* ════════════ Trust pill (top) ════════════ */}
      <div
        ref={trustRef}
        className="absolute top-24 sm:top-28 lg:top-32 left-1/2 sm:left-20 lg:left-24 -translate-x-1/2 sm:translate-x-0 z-[12]"
        style={{ opacity: 0 }}
      >
        <div
          className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
          style={{
            backgroundColor: 'rgba(255,253,247,0.1)',
            border: '1px solid rgba(255,255,255,0.16)',
          }}
        >
          {/* Stacked avatar circles (on-brand gradients — no external deps) */}
          <div className="flex -space-x-2">
            {AVATAR_GRADIENTS.map((bg, i) => (
              <span
                key={i}
                className="w-6 h-6 rounded-full block ring-2 ring-white/25"
                style={{ background: bg }}
                aria-hidden
              />
            ))}
          </div>
          <span
            className="text-white/90 text-[11px] sm:text-xs tracking-wide"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Loved by 5,000+ homes
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 pl-3 ml-1 border-l border-white/15">
            <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
            <span
              className="text-[#D4AF37] text-[11px] font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              4.8
            </span>
          </span>
        </div>
      </div>

      {/* ════════════ Main content (left-aligned, asymmetric) ════════════ */}
      <div
        ref={contentWrapRef}
        className="absolute inset-0 z-[10] flex items-center px-6 sm:px-12 lg:px-24"
      >
        <div className="w-full flex items-stretch justify-center sm:justify-start gap-5 sm:gap-7">
          {/* Vertical gold accent bar — the editorial signature on desktop */}
          <div
            className="hidden sm:block w-[3px] rounded-full self-stretch"
            style={{
              background:
                'linear-gradient(to bottom, #D4AF37 0%, rgba(212,175,55,0.55) 45%, rgba(212,175,55,0) 100%)',
              minHeight: '180px',
            }}
            aria-hidden
          />

          <div className="max-w-[640px] text-center sm:text-left">
            {/* Tag */}
            <div ref={tagRef} className="mb-4 sm:mb-6" style={{ opacity: 0 }}>
              <span
                className="text-[#D4AF37] text-[11px] sm:text-xs tracking-[0.34em] uppercase font-medium"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {slide.tag}
              </span>
            </div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="text-white font-bold leading-[1.05] mb-4 sm:mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(38px, 7.5vw, 88px)',
                textShadow: '0 2px 40px rgba(0,0,0,0.45)',
                opacity: 0,
              }}
            >
              {slide.heading}
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-white/85 text-sm sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto sm:mx-0"
              style={{ fontFamily: "'Poppins', sans-serif", opacity: 0 }}
            >
              {slide.subtitle}
            </p>

            {/* CTA — gold pill */}
            <button
              ref={ctaRef}
              onClick={() => setPage(slide.cta.page)}
              className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] cursor-pointer transition-all duration-300 hover:gap-4 hover:shadow-[0_14px_44px_rgba(212,175,55,0.45)] hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background:
                  'linear-gradient(135deg, #D4AF37 0%, #C9A22E 55%, #B8941F 100%)',
                color: '#FFFFFF',
                fontFamily: "'Poppins', sans-serif",
                borderRadius: '999px',
                boxShadow: '0 6px 22px rgba(212,175,55,0.28)',
                opacity: 0,
              }}
              aria-label={`${slide.cta.label} — ${slide.heading}`}
            >
              {slide.cta.label}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* ════════════ Frosted stats capsule (bottom) ════════════ */}
      <div
        ref={statsRef}
        className="absolute bottom-20 sm:bottom-24 left-1/2 sm:left-20 lg:left-24 -translate-x-1/2 sm:translate-x-0 z-[12] w-[92%] max-w-md sm:max-w-xl"
        style={{ opacity: 0 }}
      >
        <div
          className="flex items-center justify-around rounded-2xl backdrop-blur-xl px-4 sm:px-8 py-3 sm:py-4 shadow-[0_10px_40px_rgba(0,0,0,0.22)]"
          style={{
            backgroundColor: 'rgba(255,253,247,0.09)',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          {STATS.map((s, i) => (
            <Fragment key={i}>
              <div className="flex flex-col items-center text-center">
                <span
                  className="text-white font-semibold text-base sm:text-xl lg:text-2xl leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.n}
                </span>
                <span
                  className="text-white/65 text-[8px] sm:text-[10px] uppercase tracking-[0.14em] mt-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {s.l}
                </span>
              </div>
              {i < STATS.length - 1 && (
                <div className="w-px h-7 sm:h-9 bg-white/15" aria-hidden />
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* ════════════ Glass arrows (desktop / tablet) ════════════ */}
      <div
        ref={arrowsRef}
        className="hidden sm:block absolute inset-0 z-[14] pointer-events-none"
        style={{ opacity: 0 }}
      >
        <button
          onClick={prevSlide}
          className="absolute left-5 lg:left-8 top-1/2 -translate-y-1/2 w-11 h-11 lg:w-12 lg:h-12 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-300 hover:bg-white/25 hover:scale-105"
          style={{
            backgroundColor: 'rgba(255,253,247,0.1)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 w-11 h-11 lg:w-12 lg:h-12 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer pointer-events-auto transition-all duration-300 hover:bg-white/25 hover:scale-105"
          style={{
            backgroundColor: 'rgba(255,253,247,0.1)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* ════════════ Dot navigation (pill-shaped active) ════════════ */}
      <div
        ref={dotsRef}
        className="absolute bottom-8 left-1/2 sm:left-auto sm:right-20 lg:right-24 -translate-x-1/2 sm:translate-x-0 z-[15] flex items-center gap-2"
      >
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="h-[7px] rounded-full cursor-pointer"
            style={{
              width: '7px',
              backgroundColor: 'rgba(255,255,255,0.38)',
            }}
            aria-label={`Go to slide ${i + 1}: ${s.heading}`}
            aria-current={i === current ? 'true' : undefined}
          />
        ))}
      </div>

      {/* ════════════ Progress bar (GSAP width tween) ════════════ */}
      <div
        className="absolute bottom-0 left-0 w-full h-[3px] z-[20] bg-white/10"
        aria-hidden
      >
        <div
          ref={progressFillRef}
          className="h-full"
          style={{
            width: '0%',
            background: 'linear-gradient(90deg, #D4AF37 0%, #E8D5A3 100%)',
          }}
        />
      </div>
    </section>
  );
}
