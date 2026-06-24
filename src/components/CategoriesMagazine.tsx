'use client';

/**
 * CategoriesMagazine — Asymmetric magazine-spread categories.
 *
 * Design rationale (Senior Designer notes):
 * - NOT a bento grid (too predictable). Instead: 1 large hero category (left, 60%)
 *   + 3 smaller stacked categories (right, 40%) with varying heights.
 * - Each category is numbered (01, 02, 03...) — editorial marker, magazine feel.
 * - Hover: image zoom + gold line draws across the bottom + name slides up.
 * - Varying card heights create rhythm — no identical cards.
 * - Cream bg, generous whitespace, intentional asymmetry.
 *
 * Inspired by: Magazine spreads, Apple bento, MR PORTER editorial
 *
 * All CSS-class driven (.aura-cat-mag-*). Zero inline styles.
 */

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Category } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface CategoriesMagazineProps {
  categories: Category[];
}

// Fallback if DB returns empty
const FALLBACK = [
  { id: 'lighting', name: 'Lighting', image: '/images/categories/lighting-category.webp', description: 'Lamps, pendants & sconces' },
  { id: 'plants', name: 'Plants & Pots', image: '/images/categories/plants-category.webp', description: 'Indoor greenery & planters' },
  { id: 'vases', name: 'Vases & Decor', image: '/images/categories/vases-category.webp', description: 'Artisan ceramics & accents' },
  { id: 'candles', name: 'Candles', image: '/images/categories/candles-category.webp', description: 'Scented candles & holders' },
];

export default function CategoriesMagazine({ categories }: CategoriesMagazineProps) {
  const ref = useRef<HTMLElement>(null);

  const cats = (categories && categories.length > 0 ? categories : FALLBACK).slice(0, 4);
  // First category = hero (large), rest = small stack
  const heroCat = cats[0];
  const sideCats = cats.slice(1, 4);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Section header fades up
      gsap.fromTo(
        '.aura-cat-mag-head',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        }
      );

      // Hero card + side cards stagger in
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.aura-cat-mag-grid', start: 'top 78%', once: true },
      });
      tl.fromTo('.aura-cat-mag-hero', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      tl.fromTo('.aura-cat-mag-side', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, '-=0.5');
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="aura-cat-mag">
      <div className="aura-cat-mag-inner">
        {/* Section header — left-aligned, editorial */}
        <div className="aura-cat-mag-head">
          <span className="aura-cat-mag-eyebrow">02 — Categories</span>
          <h2 className="aura-cat-mag-title">
            Four worlds,<br />
            <span className="aura-cat-mag-title-accent">one craft.</span>
          </h2>
        </div>

        {/* Asymmetric grid: 1 hero + 3 side */}
        <div className="aura-cat-mag-grid">
          {/* Hero category (left, large) */}
          {heroCat && (
            <Link href={`/shop?category=${heroCat.id}`} className="aura-cat-mag-hero">
              <Image
                src={heroCat.image}
                alt={heroCat.name}
                fill
                className="aura-cat-mag-hero-img"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="aura-cat-mag-hero-overlay" />
              <div className="aura-cat-mag-hero-content">
                <span className="aura-cat-mag-num">01</span>
                <div className="aura-cat-mag-hero-text">
                  <h3 className="aura-cat-mag-hero-name">{heroCat.name}</h3>
                  <p className="aura-cat-mag-hero-desc">{heroCat.description}</p>
                </div>
                <ArrowUpRight className="aura-cat-mag-hero-arrow" />
              </div>
              <div className="aura-cat-mag-line" />
            </Link>
          )}

          {/* Side categories (right, stacked) */}
          <div className="aura-cat-mag-side-wrap">
            {sideCats.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="aura-cat-mag-side"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="aura-cat-mag-side-img"
                  sizes="(max-width: 1024px) 50vw, 24vw"
                />
                <div className="aura-cat-mag-side-overlay" />
                <div className="aura-cat-mag-side-content">
                  <span className="aura-cat-mag-num aura-cat-mag-num-sm">0{i + 2}</span>
                  <div>
                    <h3 className="aura-cat-mag-side-name">{cat.name}</h3>
                    <p className="aura-cat-mag-side-desc">{cat.description}</p>
                  </div>
                  <ArrowUpRight className="aura-cat-mag-side-arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
