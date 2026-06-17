'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';

const slides = [
  {
    tag: 'New Collection 2026',
    heading: 'Elevate. Your. Space.',
    subtitle: 'Handcrafted home decor for the modern Pakistani home',
    image: '/images/hero/hero-slide-1.webp',
    cta: { label: 'Shop Collection', page: 'shop' as const },
  },
  {
    tag: 'Artisan Craftsmanship',
    heading: 'Crafted. With. Love.',
    subtitle: 'Every piece tells a story of skill and cultural heritage',
    image: '/images/hero/hero-slide-2.webp',
    cta: { label: 'Meet Our Artisans', page: 'about' as const },
  },
  {
    tag: 'Dining Collection',
    heading: 'Set. The. Table.',
    subtitle: 'Gold-rimmed glassware and handcrafted ceramics',
    image: '/images/hero/hero-slide-3.webp',
    cta: { label: 'Shop Dining', page: 'shop' as const },
  },
  {
    tag: 'Serene Spaces',
    heading: 'Find. Your. Calm.',
    subtitle: 'Soft candlelight and warm textiles for peaceful retreats',
    image: '/images/hero/hero-slide-4.webp',
    cta: { label: 'Shop Bedroom', page: 'shop' as const },
  },
  {
    tag: 'Bring Nature Home',
    heading: 'Grow. Your. Sanctuary.',
    subtitle: 'Lush greenery in gold-rimmed planters',
    image: '/images/hero/hero-slide-5.webp',
    cta: { label: 'Shop Plants', page: 'shop' as const },
  },
];

const SLIDE_DURATION = 6000;

const stats = [
  { number: '5,000+', label: 'Happy Homes' },
  { number: '200+', label: 'Artisan Partners' },
  { number: '50+', label: 'Cities Delivered' },
  { number: '4.8★', label: 'Average Rating' },
];

export default function HeroSection() {
  const setPage = useStore((state) => state.setPage);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);
  const goTo = useCallback((i: number) => setCurrent(i), []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, SLIDE_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, next]);

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { if (dx > 0) prev(); else next(); }
    touchStartX.current = null;
  };

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#2C2C2C] h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-7rem)]"
      style={{ minHeight: '480px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ═══ Full-bleed background images ═══ */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 2 : 1 }}
        >
          <img
            src={s.image}
            alt={s.heading}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />
        </div>
      ))}

      {/* ═══ Beautiful multi-layer overlay ═══ */}
      {/* Layer 1: Bottom-to-top gradient for text readability */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: 'linear-gradient(to top, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.3) 35%, rgba(44,44,44,0.05) 55%, rgba(44,44,44,0.2) 100%)',
        }}
      />
      {/* Layer 2: Warm gold tint from top-left */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, transparent 40%)',
        }}
      />
      {/* Layer 3: Vignette for cinematic depth */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 45%, transparent 35%, rgba(44,44,44,0.45) 100%)',
        }}
      />

      {/* ═══ Center-stacked content ═══ */}
      <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center px-4 sm:px-6">

        {/* Trust pill — glassmorphism with avatar circles */}
        <div
          className="inline-flex items-center gap-3 px-4 py-2 mb-6 rounded-full backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(255,253,247,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {/* Avatar circles */}
          <div className="flex -space-x-2">
            {[
              'https://i.pravatar.cc/40?img=1',
              'https://i.pravatar.cc/40?img=5',
              'https://i.pravatar.cc/40?img=8',
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-6 h-6 rounded-full border-2 object-cover"
                style={{ borderColor: 'rgba(255,253,247,0.3)' }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
            ))}
          </div>
          <span
            className="text-white/90 text-xs sm:text-sm font-medium"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Loved by 5,000+ homes
          </span>
        </div>

        {/* Headline — large bold, period-separated words */}
        <h1
          className="text-white font-bold text-center leading-[1.05] mb-4 select-none"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(32px, 7vw, 72px)',
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em',
          }}
        >
          {slide.heading}
        </h1>

        {/* Subheadline */}
        <p
          className="text-white/70 text-center text-sm sm:text-base mb-8 max-w-md"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {slide.subtitle}
        </p>

        {/* CTA button — solid gold pill */}
        <button
          onClick={() => setPage(slide.cta.page)}
          className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer hover:gap-3 hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)]"
          style={{
            backgroundColor: '#D4AF37',
            color: '#FFFFFF',
            fontFamily: "'Poppins', sans-serif",
            borderRadius: '50px',
          }}
        >
          {slide.cta.label}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* ═══ Frosted stats capsule — pinned near bottom ═══ */}
      <div className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 z-[4] w-[92%] max-w-3xl">
        <div
          className="flex items-center justify-around rounded-2xl backdrop-blur-md px-4 sm:px-8 py-4 sm:py-5"
          style={{
            backgroundColor: 'rgba(255,253,247,0.12)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span
                className="text-white font-bold text-lg sm:text-2xl mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.number}
              </span>
              <span
                className="text-white/60 text-[9px] sm:text-xs uppercase tracking-wider"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Arrow Navigation ═══ */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors duration-300"
        style={{ backgroundColor: 'rgba(255,253,247,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors duration-300"
        style={{ backgroundColor: 'rgba(255,253,247,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* ═══ Dots ═══ */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full cursor-pointer transition-all duration-300"
            style={{
              width: i === current ? '24px' : '6px',
              height: '6px',
              backgroundColor: i === current ? '#D4AF37' : 'rgba(255,255,255,0.4)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ═══ Progress Bar ═══ */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] z-[6] bg-white/10">
        <div
          key={current}
          className="h-full bg-[#D4AF37]"
          style={{ animation: `heroProgress ${SLIDE_DURATION}ms linear forwards` }}
        />
      </div>
    </section>
  );
}
