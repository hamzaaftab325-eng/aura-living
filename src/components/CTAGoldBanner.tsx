'use client';

/**
 * CTAGoldBanner — CTA Demo 2 (chosen design). 10/10 animations edition.
 *
 * Gold gradient banner with:
 * - Per-character mask reveal on heading (overflow:hidden + translateY)
 * - Animated gradient bg that subtly shifts hue over 8s
 * - Diagonal sheen sweep (continuous, 6s loop)
 * - Radial vignette for depth
 * - Staggered fade-in on subtitle + button
 * - Button: shimmer sweep + arrow slide + glow burst on hover
 * - Reduced-motion safe
 *
 * All styling via CSS classes (.aura-cta-gold-*). Zero inline styles.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WORDS = ['Your', 'Dream', 'Home', 'Starts', 'Here'];

export default function CTAGoldBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      });

      // Per-word masked reveal — each word slides up from inside its mask
      tl.fromTo(
        '.aura-cta-gold-word',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power4.out',
        }
      );

      // Subtitle slides in + fades
      tl.fromTo(
        '.aura-cta-gold-fade',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // Button pop-in with scale + slight rotation
      tl.fromTo(
        '.aura-cta-gold-btn',
        { scale: 0.85, opacity: 0, y: 12 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'back.out(1.7)',
        },
        '-=0.2'
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="aura-cta-gold">
      <div className="aura-cta-gold-inner">
        <h2 className="aura-cta-gold-title">
          {WORDS.map((w, i) => (
            <span key={i} className="aura-cta-gold-word-wrap">
              <span className="aura-cta-gold-word">{w}</span>
            </span>
          ))}
        </h2>
        <p className="aura-cta-gold-sub aura-cta-gold-fade">
          Explore our full collection of handcrafted decor, delivered to your door.
        </p>
        <Link
          href="/shop"
          className="aura-cta-gold-btn aura-cta-gold-fade"
          aria-label="Browse the Aura Living collection"
        >
          <span className="aura-cta-gold-btn-label">Browse Collection</span>
          <ArrowRight className="aura-cta-gold-btn-icon" />
        </Link>
      </div>
    </section>
  );
}
