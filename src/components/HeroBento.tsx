'use client';

/**
 * HeroBento — Polished Bento Grid hero (chosen design from /hero-demos Demo 3).
 *
 * Features:
 * - Asymmetric bento grid of category cards (1 tall + 1 wide + 3 small)
 * - Left: headline block with badge, title, subtitle, CTA
 * - Right: bento grid with image zoom + arrow reveal on hover
 * - GSAP entrance animations matching the home-new pattern:
 *   · Headline block fades up on scroll (data-reveal)
 *   · Bento cells stagger in with scale + opacity (data-stagger)
 * - Dynamic: accepts categories from DB, falls back to static if empty
 * - Cream→gold gradient background
 * - Fully responsive (2-col mobile, 5-cell bento desktop)
 *
 * All styling via CSS classes (.aura-hero-bento-*). Zero inline styles.
 */

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Category } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HeroBentoProps {
  categories?: Category[];
}

// Fallback categories if DB returns empty (keeps hero looking good)
const FALLBACK_CATEGORIES = [
  { id: 'lighting', name: 'Lighting', image: '/images/categories/lighting-category.webp' },
  { id: 'plants', name: 'Plants & Pots', image: '/images/categories/plants-category.webp' },
  { id: 'vases', name: 'Vases', image: '/images/categories/vases-category.webp' },
  { id: 'candles', name: 'Candles', image: '/images/categories/candles-category.webp' },
  { id: 'wall-art', name: 'Wall Art', image: '/images/categories/wallart-category.webp' },
];

export default function HeroBento({ categories }: HeroBentoProps) {
  const containerRef = useRef<HTMLElement>(null);

  // Use DB categories if available, otherwise fallback
  const cats = (categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES).slice(0, 5);

  // Assign bento spans: first = tall, second = wide, rest = small
  const spans = ['tall', 'wide', 'small', 'small', 'small'];

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Headline block — fade up on scroll
      const headline = containerRef.current?.querySelector('.aura-hero-bento-headline');
      if (headline) {
        gsap.fromTo(
          headline,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headline,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Bento cells — stagger in with scale + opacity
      const cells = containerRef.current?.querySelectorAll('.aura-hero-bento-cell');
      if (cells && cells.length > 0) {
        gsap.fromTo(
          cells,
          { opacity: 0, scale: 0.92, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current?.querySelector('.aura-hero-bento-bento'),
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="aura-hero-bento">
      <div className="aura-hero-bento-inner">
        {/* Left: headline block */}
        <div className="aura-hero-bento-headline">
          <span className="aura-hero-bento-eyebrow">
            <span className="aura-hero-bento-eyebrow-dot" />
            New Collection 2026
          </span>
          <h1 className="aura-hero-bento-title">
            Where Comfort<br />
            <span className="aura-hero-bento-title-accent">Meets Style</span>
          </h1>
          <p className="aura-hero-bento-subtitle">
            Handcrafted decor for the modern Pakistani home. Premium quality, delivered nationwide.
          </p>
          <Link href="/shop" className="aura-hero-bento-cta">
            Shop Collection
            <ArrowRight className="aura-hero-bento-cta-icon" />
          </Link>
          {/* Trust row */}
          <div className="aura-hero-bento-trust">
            <span className="aura-hero-bento-trust-item">COD Available</span>
            <span className="aura-hero-bento-trust-sep" />
            <span className="aura-hero-bento-trust-item">Free Shipping over Rs. 10,000</span>
            <span className="aura-hero-bento-trust-sep" />
            <span className="aura-hero-bento-trust-item">7-Day Returns</span>
          </div>
        </div>

        {/* Right: bento grid */}
        <div className="aura-hero-bento-bento">
          {cats.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className={`aura-hero-bento-cell aura-hero-bento-cell-${spans[i] || 'small'}`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="aura-hero-bento-cell-img"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={i < 2}
              />
              <div className="aura-hero-bento-cell-overlay" />
              <div className="aura-hero-bento-cell-content">
                <span className="aura-hero-bento-cell-name">{cat.name}</span>
                <ArrowUpRight className="aura-hero-bento-cell-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Decorative bottom fade into next section */}
      <div className="aura-hero-bento-fade" />
    </section>
  );
}
