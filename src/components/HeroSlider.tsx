'use client';

/**
 * HeroSlider — Bold Cinematic multi-slide carousel.
 *
 * Features:
 * - Full-screen slides with background images
 * - Auto-rotating (6s per slide)
 * - Parallax zoom effect on active slide
 * - Dot navigation
 * - Scroll-triggered text reveal via GSAP
 * - CTA buttons with gold styling
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '@/hooks/useAnimations';
import PremiumButton from '@/components/ui/PremiumButton';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

const slides: Slide[] = [
  {
    image: '/images/hero/hero-slide-1.webp',
    eyebrow: 'New Collection 2026',
    title: 'Where Comfort\nMeets Style',
    subtitle: 'Discover handcrafted home decor that turns houses into homes. Premium quality, delivered across Pakistan.',
    ctaLabel: 'Shop Collection',
    ctaHref: '/shop',
  },
  {
    image: '/images/hero/hero-slide-2.webp',
    eyebrow: 'Artisan Crafted',
    title: 'Made by Hand,\nMade with Heart',
    subtitle: 'Every piece tells a story of Pakistani craftsmanship — from brass lamps to hand-painted ceramics.',
    ctaLabel: 'Explore Lighting',
    ctaHref: '/shop?category=lighting',
  },
  {
    image: '/images/hero/hero-slide-3.webp',
    eyebrow: 'Limited Edition',
    title: 'Bring Nature\nIndoors',
    subtitle: 'Curated plants, planters, and botanical accents that breathe life into your living spaces.',
    ctaLabel: 'Shop Plants & Pots',
    ctaHref: '/shop?category=plants',
  },
];

const SLIDE_DURATION = 6000;

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const heroRef = useScrollReveal<HTMLDivElement>({ y: 0, duration: 0.8 });

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  // Animate text on slide change
  useEffect(() => {
    if (!textRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      textRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
    );
  }, [activeSlide]);

  // Parallax effect on scroll
  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.to(containerRef.current.querySelectorAll('.aura-hero-slide-bg'), {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
      aria-label="Hero carousel"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`aura-hero-slide ${index === activeSlide ? 'active' : ''}`}
          aria-hidden={index !== activeSlide}
        >
          <div
            className="aura-hero-slide-bg"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 aura-overlay-dark" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div ref={textRef} className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-6 aura-animate-fade-in">
            <Sparkles className="w-4 h-4 aura-text-gold" />
            <span className="text-xs sm:text-sm tracking-[4px] uppercase font-medium aura-text-on-dark-primary">
              {slides[activeSlide].eyebrow}
            </span>
            <Sparkles className="w-4 h-4 aura-text-gold" />
          </div>

          {/* Title */}
          <h1 className="aura-hero-title text-white aura-cinematic-text whitespace-pre-line mb-6">
            {slides[activeSlide].title}
          </h1>

          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto aura-text-on-dark-muted aura-cinematic-text mb-8">
            {slides[activeSlide].subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <PremiumButton
              variant="primary"
              size="lg"
              href={slides[activeSlide].ctaHref}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {slides[activeSlide].ctaLabel}
            </PremiumButton>
            <PremiumButton variant="secondary" size="lg" href="/about">
              Our Story
            </PremiumButton>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="aura-hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`aura-hero-dot ${index === activeSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeSlide}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden sm:flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[3px] aura-text-on-dark-faint">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--color-gold)]/60 to-transparent" />
      </div>
    </section>
  );
}
