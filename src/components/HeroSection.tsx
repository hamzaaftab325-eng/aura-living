'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';

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

const stats = [
  { number: '5,000+', label: 'Happy Homes' },
  { number: '200+', label: 'Artisans' },
  { number: '50+', label: 'Cities' },
  { number: '4.8★', label: 'Rating' },
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

  // Touch swipe
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
      className="relative w-full overflow-hidden bg-[#2C2C2C]"
      style={{ height: '100vh', height: '100dvh' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background images — all pre-loaded, crossfade via opacity */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
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

      {/* Overlay — single elegant gradient for text readability */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: 'linear-gradient(180deg, rgba(44,44,44,0.55) 0%, rgba(44,44,44,0.15) 35%, rgba(44,44,44,0.15) 60%, rgba(44,44,44,0.75) 100%)',
        }}
      />

      {/* Content — centered */}
      <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center px-4 sm:px-6">

        {/* Tag */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[#D4AF37]" />
          <span
            className="text-[#D4AF37] text-xs sm:text-sm tracking-[4px] uppercase font-medium"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {slide.tag}
          </span>
          <div className="w-8 h-px bg-[#D4AF37]" />
        </div>

        {/* Heading */}
        <h1
          className="text-white font-bold text-center leading-[1.1] mb-3 select-none"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 8vw, 80px)',
            textShadow: '0 2px 30px rgba(0,0,0,0.4)',
          }}
        >
          {slide.heading}
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/80 text-center text-sm sm:text-lg mb-8 max-w-xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {slide.subtitle}
        </p>

        {/* CTA */}
        <button
          onClick={() => setPage(slide.cta.page)}
          className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer hover:gap-3 hover:shadow-[0_8px_40px_rgba(212,175,55,0.5)]"
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

      {/* Trust pill — glassmorphism */}
      <div className="absolute top-24 sm:top-28 lg:top-32 left-1/2 -translate-x-1/2 z-[4] hidden sm:block">
        <div
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(255,253,247,0.12)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div className="flex -space-x-2">
            {['https://i.pravatar.cc/40?img=1', 'https://i.pravatar.cc/40?img=5', 'https://i.pravatar.cc/40?img=8'].map((src, i) => (
              <img key={i} src={src} alt="" className="w-5 h-5 rounded-full border-2 object-cover" style={{ borderColor: 'rgba(255,253,247,0.3)' }} />
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
            ))}
          </div>
          <span className="text-white/90 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Loved by 5,000+ homes
          </span>
        </div>
      </div>

      {/* Frosted stats bar — bottom */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-[4] w-[90%] max-w-2xl">
        <div
          className="flex items-center justify-around rounded-2xl backdrop-blur-md px-4 sm:px-8 py-3 sm:py-4"
          style={{
            backgroundColor: 'rgba(255,253,247,0.1)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-white font-bold text-base sm:text-xl mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                {stat.number}
              </span>
              <span className="text-white/60 text-[8px] sm:text-[10px] uppercase tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-white/20"
        style={{ backgroundColor: 'rgba(255,253,247,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-white/20"
        style={{ backgroundColor: 'rgba(255,253,247,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-[5] flex items-center gap-2">
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

      {/* Progress bar */}
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
