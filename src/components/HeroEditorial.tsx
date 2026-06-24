'use client';

/**
 * HeroEditorial — Editorial split hero with layered depth.
 *
 * Design rationale (Senior Designer notes):
 * - LEFT-aligned headline (not centered) — eliminates the #1 AI tell
 * - Asymmetric 7/5 column split — creates editorial tension
 * - Single text-link CTA (not a button) — understated, confident
 * - Layered depth: product image + overlapping gold accent + floating spec card
 * - Warm cream bg (#FAF9F6) — no gradients, no video, no drama
 * - Issue number "01" as editorial marker — magazine feel
 * - Custom line-height on headline — typography carries the design
 *
 * Inspired by: Aesop, MR PORTER, The Citizenry
 *
 * All CSS-class driven (.aura-hero-ed-*). Zero inline styles except bg image URL.
 */

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HeroEditorial() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Staggered entrance — eyebrow → title → story → CTA (left col)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });

      tl.fromTo('.aura-hero-ed-issue', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      tl.fromTo('.aura-hero-ed-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3');
      tl.fromTo('.aura-hero-ed-story', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
      tl.fromTo('.aura-hero-ed-cta', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');

      // Right column — image + spec card slide in
      tl.fromTo('.aura-hero-ed-image-wrap', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, '-=0.8');
      tl.fromTo('.aura-hero-ed-spec', { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.6');
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="aura-hero-ed">
      <div className="aura-hero-ed-inner">
        {/* ── LEFT (7 cols) — editorial copy ── */}
        <div className="aura-hero-ed-left">
          <span className="aura-hero-ed-issue">
            <span className="aura-hero-ed-issue-num">01</span>
            <span className="aura-hero-ed-issue-sep" />
            <span className="aura-hero-ed-issue-label">The Collection</span>
          </span>

          <h1 className="aura-hero-ed-title">
            Made by hand.<br />
            <span className="aura-hero-ed-title-accent">Made for you.</span>
          </h1>

          <p className="aura-hero-ed-story">
            Sheesham wood, raw brass, hand-thrown clay. Each piece is shaped by
            third-generation artisans in Lahore — signed, dated, and made to
            outlive trends.
          </p>

          <Link href="/shop" className="aura-hero-ed-cta">
            <span>Explore the collection</span>
            <ArrowRight className="aura-hero-ed-cta-icon" />
          </Link>
        </div>

        {/* ── RIGHT (5 cols) — layered visual ── */}
        <div className="aura-hero-ed-right">
          {/* Overlapping gold accent shape (behind image) */}
          <div className="aura-hero-ed-accent" aria-hidden="true" />

          {/* Product image with organic mask */}
          <div className="aura-hero-ed-image-wrap">
            <Image
              src="/images/hero/hero-slide-2.webp"
              alt="Handcrafted brass lamp on sheesham wood surface"
              fill
              className="aura-hero-ed-image"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
          </div>

          {/* Floating spec card — overlapping bottom-left of image */}
          <div className="aura-hero-ed-spec">
            <div className="aura-hero-ed-spec-row">
              <span className="aura-hero-ed-spec-label">Material</span>
              <span className="aura-hero-ed-spec-value">Solid Sheesham</span>
            </div>
            <div className="aura-hero-ed-spec-divider" />
            <div className="aura-hero-ed-spec-row">
              <span className="aura-hero-ed-spec-label">Origin</span>
              <span className="aura-hero-ed-spec-value">Lahore, PK</span>
            </div>
            <div className="aura-hero-ed-spec-divider" />
            <div className="aura-hero-ed-spec-row">
              <span className="aura-hero-ed-spec-label">Artisan</span>
              <span className="aura-hero-ed-spec-value">M. Raza · 3rd gen</span>
            </div>
            <Link href="/about" className="aura-hero-ed-spec-link">
              The craft
              <ArrowUpRight className="aura-hero-ed-spec-link-icon" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
