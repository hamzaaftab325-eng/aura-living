'use client';

/**
 * CategoriesHoverReveal — Chosen bento design (Demo 2).
 *
 * Features:
 * - Dark background (#141414)
 * - 3-column grid (1-col mobile, 2-col tablet)
 * - Initial: name visible at bottom with gradient
 * - Hover: panel slides up with description + CTA
 * - Image zoom on hover (scale 1.1, 700ms)
 * - GSAP scroll-triggered stagger reveal
 *
 * ALL styling via CSS classes (modern.css). Zero inline styles.
 */

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import type { Category } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  categories: Category[];
}

export default function CategoriesHoverReveal({ categories }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      '.aura-cat-card',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
        },
      }
    );
  }, { scope: ref });

  return (
    <section ref={ref} className="aura-cat-section">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="aura-cat-header">
          <span className="aura-cat-header-label">Explore</span>
          <h2 className="aura-cat-header-title">
            Shop by <span className="aura-cat-header-accent">Category</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="aura-cat-grid">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="aura-cat-card"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="aura-cat-card-img"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Initial overlay (name only) */}
              <div className="aura-cat-card-initial">
                <h3 className="aura-cat-card-name">{cat.name}</h3>
              </div>

              {/* Hover panel (slides up) */}
              <div className="aura-cat-card-panel">
                <h3 className="aura-cat-card-panel-name">{cat.name}</h3>
                <p className="aura-cat-card-panel-desc">{cat.description}</p>
                <span className="aura-cat-card-panel-cta">
                  Explore Collection
                  <ArrowUpRight className="aura-cat-card-panel-cta-icon" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
