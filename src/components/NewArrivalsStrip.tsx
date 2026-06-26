'use client';

/**
 * NewArrivalsStrip — Horizontal scrollable product strip.
 *
 * Design rationale (Senior Designer notes):
 * - NOT another 4-col grid (would be identical to Featured — repetitive).
 * - Instead: horizontal scrollable row of tall (3:4) cards, like Arc browser
 *   tabs or Apple Music. Drag to scroll on mobile, arrows on desktop.
 * - Each card: tall image + "NEW" tag + name + price + add-to-cart on hover.
 * - Breaks the vertical scroll rhythm — creates a horizontal "moment".
 * - Dark bg (#1C1B19) for contrast with the cream sections around it.
 *
 * Inspired by: Arc browser, Apple Music, Netflix rows
 *
 * All CSS-class driven (.aura-arr-strip-*). Zero inline styles.
 */

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/store/useStore';
import { formatRupees } from '@/lib/currency-display';
import type { Product } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface NewArrivalsStripProps {
  products: Product[];
}

export default function NewArrivalsStrip({ products }: NewArrivalsStripProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useStore();

  const scrollBy = (dir: number) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        '.aura-arr-strip-head',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      );

      gsap.fromTo(
        '.aura-arr-strip-track',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  if (!products.length) return null;

  return (
    <section ref={sectionRef} className="aura-arr-strip">
      <div className="aura-arr-strip-inner">
        {/* Header — left-aligned + arrows on right */}
        <div className="aura-arr-strip-head">
          <div>
            <span className="aura-arr-strip-eyebrow">05 — Just Landed</span>
            <h2 className="aura-arr-strip-title">
              Fresh from<br />
              <span className="aura-arr-strip-title-accent">the workshop.</span>
            </h2>
          </div>
          <div className="aura-arr-strip-arrows">
            <button onClick={() => scrollBy(-1)} className="aura-arr-strip-arrow" aria-label="Scroll left">
              <ArrowLeft className="aura-arr-strip-arrow-icon" />
            </button>
            <button onClick={() => scrollBy(1)} className="aura-arr-strip-arrow" aria-label="Scroll right">
              <ArrowRight className="aura-arr-strip-arrow-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll track — full-bleed */}
      <div ref={trackRef} className="aura-arr-strip-track">
        <div className="aura-arr-strip-track-inner">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="aura-arr-strip-card">
              <div className="aura-arr-strip-card-img-wrap">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="aura-arr-strip-card-img"
                  sizes="240px"
                />
                <span className="aura-arr-strip-card-tag">NEW</span>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
                  className="aura-arr-strip-card-cart"
                  aria-label={`Add ${p.name} to cart`}
                >
                  <ShoppingBag className="aura-arr-strip-card-cart-icon" />
                </button>
              </div>
              <div className="aura-arr-strip-card-info">
                <p className="aura-arr-strip-card-cat">{p.category}</p>
                <p className="aura-arr-strip-card-name">{p.name}</p>
                <p className="aura-arr-strip-card-price">{formatRupees(p.price)}</p>
              </div>
            </Link>
          ))}
          {/* End card — "View all" */}
          <Link href="/new-arrivals" className="aura-arr-strip-end">
            <span className="aura-arr-strip-end-text">View all</span>
            <span className="aura-arr-strip-end-sub">new arrivals</span>
            <ArrowRight className="aura-arr-strip-end-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}
