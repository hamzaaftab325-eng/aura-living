'use client';

/**
 * HeroSlider — Full-bleed background image slider with editorial overlay.
 *
 * Design rationale (Senior Designer notes):
 * - Full-screen background images that auto-rotate with smooth crossfade
 * - Ken Burns slow-zoom effect on each slide (premium, cinematic)
 * - Gradient overlay (dark at bottom-left for text legibility, transparent top-right)
 * - Left-aligned editorial text — NOT centered (keeps anti-AI design language)
 * - Issue marker, headline with gold italic accent, story copy, text-link CTA
 * - Slide dots + counter (01/03) at bottom-right
 * - Progress bar showing auto-advance timing
 * - Parallax: text lifts slightly on scroll
 * - All brand colors (gold accent, cream text). Zero inline styles.
 *
 * Inspired by: The Citizenry, Aesop, Apple keynote slides
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  story: string;
  ctaLabel: string;
  ctaHref: string;
}

const SLIDES: Slide[] = [
  {
    image: '/images/hero/hero-slide-1.webp',
    eyebrow: 'The Collection',
    title: 'Forty hours.',
    titleAccent: 'One piece.',
    story: 'Sheesham wood from Punjab. Brass from Lahore foundries. Each piece signed, dated, and made to outlive the room it lives in.',
    ctaLabel: 'See the forty-hour pieces',
    ctaHref: '/shop',
  },
  {
    image: '/images/hero/hero-slide-2.webp',
    eyebrow: 'Artisan Crafted',
    title: 'Made by hand.',
    titleAccent: 'Made with heart.',
    story: 'Third-generation carpenters shape each piece with mortise-and-tenon joinery — no nails, no shortcuts, no compromises.',
    ctaLabel: 'Meet the artisans',
    ctaHref: '/about',
  },
  {
    image: '/images/hero/hero-slide-3.webp',
    eyebrow: 'Bring Nature Indoors',
    title: 'Greenery that',
    titleAccent: 'breathes.',
    story: 'Curated plants, planters, and botanical accents that turn a room into a living space. Sourced from Punjab nurseries.',
    ctaLabel: 'Shop plants & pots',
    ctaHref: '/shop?category=plants',
  },
];

const SLIDE_DURATION = 6000;

export default function HeroSlider() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance slides
  useEffect(() => {
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActive((current) => (current + 1) % SLIDES.length);
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, []);

  const goTo = (idx: number) => {
    setActive(idx);
    setProgress(0);
  };

  const slide = SLIDES[active];

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Entrance animation on each slide change
      const tl = gsap.timeline({ key: 'slide-' + active });
      tl.fromTo('.aura-hero-slider-eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      tl.fromTo('.aura-hero-slider-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
      tl.fromTo('.aura-hero-slider-story', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
      tl.fromTo('.aura-hero-slider-cta', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');

      // Parallax on scroll — text lifts slightly
      gsap.to('.aura-hero-slider-content', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },
    { scope: ref, dependencies: [active] }
  );

  return (
    <section ref={ref} className="aura-hero-slider">
      {/* Background images — all stacked, only active visible with Ken Burns */}
      <div className="aura-hero-slider-bg-wrap">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`aura-hero-slider-bg ${i === active ? 'aura-hero-slider-bg-active' : ''}`}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="aura-hero-slider-bg-img"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay — dark at bottom-left for text, transparent top-right */}
      <div className="aura-hero-slider-overlay" />

      {/* Content — left-aligned, editorial */}
      <div className="aura-hero-slider-content">
        <div className="aura-hero-slider-content-inner">
          <span className="aura-hero-slider-eyebrow">{slide.eyebrow}</span>

          <h1 className="aura-hero-slider-title">
            {slide.title}<br />
            <span className="aura-hero-slider-title-accent">{slide.titleAccent}</span>
          </h1>

          <p className="aura-hero-slider-story">{slide.story}</p>

          <Link href={slide.ctaHref} className="aura-hero-slider-cta">
            <span>{slide.ctaLabel}</span>
            <ArrowRight className="aura-hero-slider-cta-icon" />
          </Link>
        </div>
      </div>

      {/* Slide navigation — dots + counter at bottom-right */}
      <div className="aura-hero-slider-nav">
        <div className="aura-hero-slider-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`aura-hero-slider-dot ${i === active ? 'aura-hero-slider-dot-active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === active && (
                <span
                  className="aura-hero-slider-dot-progress"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
        <span className="aura-hero-slider-counter">
          0{active + 1}<span className="aura-hero-slider-counter-sep"> / </span>0{SLIDES.length}
        </span>
      </div>
    </section>
  );
}
