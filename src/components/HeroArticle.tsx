'use client';

/**
 * HeroArticle — Article.com-inspired hero for Aura Living.
 *
 * Design (replicated from article.com):
 * - Full-bleed lifestyle image background
 * - Subtle dark gradient overlay for text legibility
 * - Centered content: eyebrow → headline → subtitle → CTA
 * - White pill CTA (dark text) + ghost secondary CTA
 * - Bottom fade into the next section
 *
 * Aura Living adaptations:
 * - Playfair Display serif headline (Article uses sans, but Aura's brand is serif)
 * - Gold gradient accent on second line of headline
 * - Small eyebrow badge above headline
 *
 * GSAP entrance animations matching the home-new pattern:
 * - Eyebrow, headline, subtitle, CTA stagger in from below
 *
 * All styling via CSS classes (.aura-hero-article-*). Zero inline styles
 * except dynamic image URL.
 */

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HeroArticleProps {
  image?: string;
}

const DEFAULT_IMAGE = '/images/hero/hero-slide-1.webp';

export default function HeroArticle({ image = DEFAULT_IMAGE }: HeroArticleProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Stagger entrance: eyebrow → headline → subtitle → CTA row
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      tl.fromTo(
        '.aura-hero-article-eyebrow',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      tl.fromTo(
        '.aura-hero-article-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.3'
      );

      tl.fromTo(
        '.aura-hero-article-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      );

      tl.fromTo(
        '.aura-hero-article-cta-row',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="aura-hero-article">
      {/* Full-bleed background image */}
      <Image
        src={image}
        alt="Aura Living — handcrafted home decor"
        fill
        className="aura-hero-article-bg"
        sizes="100vw"
        priority
      />

      {/* Subtle dark gradient overlay for text legibility */}
      <div className="aura-hero-article-overlay" />

      {/* Centered content */}
      <div className="aura-hero-article-content">
        <span className="aura-hero-article-eyebrow">
          <span className="aura-hero-article-eyebrow-dot" />
          New Collection 2026
        </span>

        <h1 className="aura-hero-article-title">
          Where Comfort<br />
          <span className="aura-hero-article-title-accent">Meets Style</span>
        </h1>

        <p className="aura-hero-article-subtitle">
          Handcrafted decor for the modern Pakistani home.<br />
          Premium quality, delivered nationwide.
        </p>

        <div className="aura-hero-article-cta-row">
          <Link href="/shop" className="aura-hero-article-cta-primary">
            Shop Collection
            <ArrowRight className="aura-hero-article-cta-icon" />
          </Link>
          <Link href="/about" className="aura-hero-article-cta-secondary">
            Our Story
          </Link>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="aura-hero-article-fade" />
    </section>
  );
}
