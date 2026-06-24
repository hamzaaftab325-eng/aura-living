'use client';

/**
 * HeroCinematic — The chosen hero design (Demo 1).
 *
 * Features:
 * - Video background (Cloudinary) with poster fallback
 * - Split letter stagger animation (each letter flies in with rotation + blur)
 * - Auto-rotating slides (3 slides, 6s each)
 * - Magnetic gold CTA button
 * - Parallax on scroll
 * - Film grain texture
 * - Slide dots + counter
 *
 * ALL styling via CSS classes (modern.css). Zero inline styles.
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Slide {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

const slides: Slide[] = [
  {
    eyebrow: 'New Collection 2026',
    title: 'Where Comfort',
    titleAccent: 'Meets Style',
    subtitle: 'Handcrafted decor for the modern Pakistani home. Premium quality, delivered nationwide.',
    ctaLabel: 'Shop Collection',
    ctaHref: '/shop',
  },
  {
    eyebrow: 'Artisan Crafted',
    title: 'Made by Hand,',
    titleAccent: 'Made with Heart',
    subtitle: 'Every piece tells a story of Pakistani craftsmanship — from brass to ceramic.',
    ctaLabel: 'Explore Lighting',
    ctaHref: '/shop?category=lighting',
  },
  {
    eyebrow: 'Limited Edition',
    title: 'Bring Nature',
    titleAccent: 'Indoors',
    subtitle: 'Curated plants, planters & botanical accents that breathe life into your space.',
    ctaLabel: 'Shop Plants & Pots',
    ctaHref: '/shop?category=plants',
  },
];

const VIDEO_URL = 'https://res.cloudinary.com/diometfe9/video/upload/v1781723540/Working_on_ecommerce_store_backg__202606180012_pm2rtf.mp4';
const POSTER_URL = '/images/hero/hero-slide-1.webp';

export default function HeroCinematic() {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const magneticRef = useRef<HTMLAnchorElement>(null);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Split text into letter spans
  const splitText = (text: string): string => {
    return text
      .split('')
      .map((c) =>
        c === ' '
          ? '<span class="aura-hero-letter-space"> </span>'
          : `<span class="aura-hero-letter">${c}</span>`
      )
      .join('');
  };

  // Animate letters in
  const animateLetters = (delay: number) => {
    if (!titleRef.current || !accentRef.current) return;
    titleRef.current.innerHTML = splitText(slides[activeSlide].title);
    accentRef.current.innerHTML = splitText(slides[activeSlide].titleAccent);

    const titleLetters = titleRef.current.querySelectorAll('.aura-hero-letter');
    const accentLetters = accentRef.current.querySelectorAll('.aura-hero-letter');

    gsap.to(titleLetters, {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      stagger: 0.03,
      ease: 'power3.out',
      delay,
    });

    gsap.to(accentLetters, {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      stagger: 0.03,
      ease: 'power3.out',
      delay: delay + 0.5,
    });
  };

  // Initial animation + parallax + magnetic button
  useGSAP(
    () => {
      // Split letter animation on load
      animateLetters(0.3);

      // Fade in eyebrow, subtitle, buttons
      gsap.fromTo(
        '.aura-hero-eyebrow',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.2 }
      );
      gsap.fromTo(
        '.aura-hero-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.4 }
      );
      gsap.fromTo(
        '.aura-hero-cta-row',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.6 }
      );

      // Parallax on video
      gsap.to('.aura-hero-parallax-layer', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Magnetic button
      const btn = magneticRef.current;
      if (btn) {
        const handleMove = (e: Event) => {
          const me = e as MouseEvent;
          const rect = btn.getBoundingClientRect();
          const x = me.clientX - rect.left - rect.width / 2;
          const y = me.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out' });
        };
        const handleLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        };
        btn.addEventListener('mousemove', handleMove);
        btn.addEventListener('mouseleave', handleLeave);
        return () => {
          btn.removeEventListener('mousemove', handleMove);
          btn.removeEventListener('mouseleave', handleLeave);
        };
      }
    },
    { scope: containerRef }
  );

  // Re-animate on slide change
  useEffect(() => {
    if (activeSlide === 0) return; // Skip initial (handled by useGSAP)
    animateLetters(0.1);

    // Re-fade subtitle + CTA
    gsap.fromTo(
      '.aura-hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.8 }
    );
    gsap.fromTo(
      '.aura-hero-cta-row',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 1.0 }
    );
  }, [activeSlide]);

  const slide = slides[activeSlide];

  return (
    <section ref={containerRef} className="aura-hero-cinematic" aria-label="Hero carousel">
      {/* Video background with parallax */}
      <div className="aura-hero-parallax-layer">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="aura-hero-video"
          poster={POSTER_URL}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      {/* Cinematic overlay */}
      <div className="aura-hero-overlay" />

      {/* Film grain */}
      <div className="aura-hero-grain" />

      {/* Content */}
      <div className="aura-hero-content">
        {/* Eyebrow */}
        <div className="aura-hero-eyebrow">
          <div className="aura-hero-eyebrow-line-left" />
          <Sparkles className="aura-hero-eyebrow-spark w-4 h-4" />
          <span className="aura-hero-eyebrow-text">{slide.eyebrow}</span>
          <div className="aura-hero-eyebrow-line-right" />
        </div>

        {/* Title with split letter animation */}
        <div className="aura-hero-title-wrapper">
          <h1>
            <span ref={titleRef} className="aura-hero-title-main" />
            <span ref={accentRef} className="aura-hero-title-accent" />
          </h1>
        </div>

        {/* Subtitle */}
        <p className="aura-hero-subtitle">{slide.subtitle}</p>

        {/* CTAs */}
        <div className="aura-hero-cta-row">
          <Link
            ref={magneticRef}
            href={slide.ctaHref}
            className="aura-hero-btn-gold"
          >
            {slide.ctaLabel}
            <ArrowRight className="aura-hero-btn-gold-arrow" />
          </Link>
          <Link href="/about" className="aura-hero-btn-ghost">
            Our Story
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      <div className="aura-hero-dots-wrapper">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={`aura-hero-dot-btn ${i === activeSlide ? 'aura-hero-dot-btn-active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === activeSlide}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="aura-hero-counter">
        <span className="aura-hero-counter-text">
          0{activeSlide + 1}
        </span>
        <div className="aura-hero-counter-line" />
        <span className="aura-hero-counter-text">
          0{slides.length}
        </span>
      </div>

      {/* Animated scroll cue */}
      <div className="aura-hero-scroll-cue" aria-hidden="true">
        <span className="aura-hero-scroll-cue-text">Scroll</span>
        <div className="aura-hero-scroll-cue-line" />
      </div>
    </section>
  );
}
