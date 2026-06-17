'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

const slides = [
  {
    tag: 'New Collection 2026',
    heading: 'Elevate Your Living Space',
    subtitle: 'Discover handpicked home decor that turns houses into homes',
    image: '/images/hero/hero-slide-1.webp',
    cta: { label: 'Shop Now', page: 'shop' as const },
  },
  {
    tag: 'Artisan Craftsmanship',
    heading: 'Handcrafted with Love',
    subtitle: 'Every piece tells a story of dedication, skill, and cultural heritage',
    image: '/images/hero/hero-slide-2.webp',
    cta: { label: 'Meet Our Artisans', page: 'about' as const },
  },
  {
    tag: 'Dining Collection',
    heading: 'Set the Perfect Table',
    subtitle: 'Gold-rimmed glassware and handcrafted ceramics for memorable gatherings',
    image: '/images/hero/hero-slide-3.webp',
    cta: { label: 'Shop Dining', page: 'shop' as const },
  },
  {
    tag: 'Serene Spaces',
    heading: 'Find Your Sanctuary',
    subtitle: 'Soft candlelight, delicate vases, and warm textiles for peaceful retreats',
    image: '/images/hero/hero-slide-4.webp',
    cta: { label: 'Shop Bedroom', page: 'shop' as const },
  },
  {
    tag: 'Bring Nature Home',
    heading: 'The Botanical Corner',
    subtitle: 'Lush greenery in gold-rimmed planters brings life to any space',
    image: '/images/hero/hero-slide-5.webp',
    cta: { label: 'Shop Plants', page: 'shop' as const },
  },
];

const SLIDE_DURATION = 6000;

export default function HeroSection() {
  const setPage = useStore((state) => state.setPage);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
  }, []);

  // Auto-play
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, SLIDE_DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, next]);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev();
      else next();
    }
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
      {/* ═══ Full-bleed background images (all pre-loaded, crossfade via opacity) ═══ */}
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

      {/* ═══ Gradient overlay — fades from transparent (left) to cream (right) ═══ */}
      {/* Desktop: image visible on left, cream panel on right for text */}
      <div
        className="absolute inset-0 z-[3] hidden lg:block"
        style={{
          background: 'linear-gradient(to right, rgba(44,44,44,0.3) 0%, rgba(44,44,44,0.1) 30%, rgba(250,248,245,0.5) 55%, rgba(250,248,245,0.95) 70%, rgba(250,248,245,1) 100%)',
        }}
      />

      {/* Mobile: dark gradient from bottom for text readability */}
      <div
        className="absolute inset-0 z-[3] lg:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(44,44,44,0.9) 0%, rgba(44,44,44,0.5) 40%, transparent 70%)',
        }}
      />

      {/* ═══ Text content — right side on desktop, bottom on mobile ═══ */}
      <div className="absolute inset-0 z-[4] flex items-center">
        {/* Desktop: right-aligned text panel */}
        <div className="hidden lg:flex w-full justify-end pr-12 xl:pr-20">
          <div className="max-w-md flex flex-col items-start">
            {/* Slide counter */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#D4AF37] text-sm font-medium tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {String(current + 1).padStart(2, '0')}
              </span>
              <span className="text-[#8A8A8A] text-sm">/</span>
              <span className="text-[#8A8A8A] text-sm tracking-wider" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            {/* Tag */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#D4AF37]" />
              <span
                className="text-[#D4AF37] text-xs tracking-[3px] uppercase font-medium"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {slide.tag}
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-[#2C2C2C] font-bold leading-[1.15] mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 2.8vw, 48px)' }}
            >
              {slide.heading}
            </h1>

            {/* Gold accent line */}
            <div className="w-12 h-[2px] bg-[#D4AF37] mb-4" />

            {/* Subtitle */}
            <p
              className="text-[#5A5A5A] text-sm leading-relaxed mb-8 max-w-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {slide.subtitle}
            </p>

            {/* CTA */}
            <button
              onClick={() => setPage(slide.cta.page)}
              className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer hover:gap-3"
              style={{
                backgroundColor: '#D4AF37',
                color: '#FFFFFF',
                fontFamily: "'Poppins', sans-serif",
                borderRadius: '2px',
              }}
            >
              {slide.cta.label}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2 mt-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full cursor-pointer transition-all duration-300"
                  style={{
                    width: i === current ? '24px' : '8px',
                    height: '8px',
                    backgroundColor: i === current ? '#D4AF37' : '#E8D5A3',
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: bottom-aligned text overlay */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-px bg-[#D4AF37]" />
            <span
              className="text-[#D4AF37] text-[10px] tracking-[2px] uppercase font-medium"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {slide.tag}
            </span>
          </div>
          <h1
            className="text-white font-bold leading-[1.15] mb-3"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 7vw, 36px)' }}
          >
            {slide.heading}
          </h1>
          <p
            className="text-white/80 text-sm leading-relaxed mb-5 max-w-xs"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {slide.subtitle}
          </p>
          <button
            onClick={() => setPage(slide.cta.page)}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: '#D4AF37',
              color: '#FFFFFF',
              fontFamily: "'Poppins', sans-serif",
              borderRadius: '2px',
            }}
          >
            {slide.cta.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mt-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full cursor-pointer transition-all duration-300"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: i === current ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Arrow Navigation ═══ */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors duration-300 lg:right-[42%]"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

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
