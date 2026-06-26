'use client';

/**
 * ProductsEditorial — Editorial product showcase (NOT a grid).
 *
 * Design rationale (Senior Designer notes):
 * - NOT a 4-col grid (too predictable, too AI). Instead: 1 large hero product
 *   (left, 50%, tall 3:4) + 4 smaller products in a 2x2 grid (right, 50%).
 * - Hero product has editorial treatment: large image, "Featured" tag, artisan
 *   name, story snippet, price, add-to-cart.
 * - Smaller products are minimal: image + name + price only.
 * - Creates visual hierarchy through SIZE, not color. Magazine feel.
 * - Left-aligned header with editorial copy.
 *
 * Inspired by: MR PORTER editorial, Shopify Spotlight, Apple product pages
 *
 * All CSS-class driven (.aura-prod-ed-*). Zero inline styles.
 */

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, ShoppingBag, Heart } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/store/useStore';
import { formatRupees } from '@/lib/currency-display';
import type { Product } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProductsEditorialProps {
  products: Product[];
}

export default function ProductsEditorial({ products }: ProductsEditorialProps) {
  const ref = useRef<HTMLElement>(null);
  const { addToCart, isInWishlist, toggleWishlist } = useStore();

  // Split: first product = hero, next 4 = side grid
  const hero = products[0];
  const side = products.slice(1, 5);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        '.aura-prod-ed-head',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.aura-prod-ed-grid', start: 'top 78%', once: true },
      });
      tl.fromTo('.aura-prod-ed-hero', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      tl.fromTo('.aura-prod-ed-side', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4');
    },
    { scope: ref }
  );

  if (!hero) return null;

  return (
    <section ref={ref} className="aura-prod-ed">
      <div className="aura-prod-ed-inner">
        {/* Header — left-aligned, editorial */}
        <div className="aura-prod-ed-head">
          <span className="aura-prod-ed-eyebrow">04 — Featured</span>
          <h2 className="aura-prod-ed-title">
            The pieces<br />
            <span className="aura-prod-ed-title-accent">we'd keep.</span>
          </h2>
          <p className="aura-prod-ed-sub">
            Hand-selected. Each one signed by the artisan who made it.
          </p>
        </div>

        {/* Editorial grid: 1 hero + 4 side */}
        <div className="aura-prod-ed-grid">
          {/* Hero product (left, large) */}
          <div className="aura-prod-ed-hero">
            <Link href={`/product/${hero.slug}`} className="aura-prod-ed-hero-img-wrap">
              <Image
                src={hero.image}
                alt={hero.name}
                fill
                className="aura-prod-ed-hero-img"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {hero.badge && (
                <span className="aura-prod-ed-hero-badge">{hero.badge}</span>
              )}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(hero.id); }}
                className={`aura-prod-ed-hero-wish ${isInWishlist(hero.id) ? 'aura-prod-ed-hero-wish-active' : ''}`}
                aria-label={isInWishlist(hero.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className="aura-prod-ed-hero-wish-icon" />
              </button>
            </Link>
            <div className="aura-prod-ed-hero-info">
              <div className="aura-prod-ed-hero-meta">
                <span className="aura-prod-ed-hero-cat">{hero.category}</span>
                <span className="aura-prod-ed-hero-dot" />
                <span className="aura-prod-ed-hero-artisan">By M. Raza</span>
              </div>
              <h3 className="aura-prod-ed-hero-name">{hero.name}</h3>
              <p className="aura-prod-ed-hero-story">
                {hero.description.slice(0, 120)}...
              </p>
              <div className="aura-prod-ed-hero-bottom">
                <div className="aura-prod-ed-hero-price-row">
                  <span className="aura-prod-ed-hero-price">{formatRupees(hero.price)}</span>
                  {hero.originalPrice && (
                    <span className="aura-prod-ed-hero-original">{formatRupees(hero.originalPrice)}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(hero)}
                  className="aura-prod-ed-hero-cart"
                >
                  <ShoppingBag className="aura-prod-ed-hero-cart-icon" />
                  Add to cart
                </button>
              </div>
            </div>
          </div>

          {/* Side products (right, 2x2) */}
          <div className="aura-prod-ed-side-wrap">
            {side.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="aura-prod-ed-side">
                <div className="aura-prod-ed-side-img-wrap">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="aura-prod-ed-side-img"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  {p.badge && (
                    <span className="aura-prod-ed-side-badge">{p.badge}</span>
                  )}
                </div>
                <div className="aura-prod-ed-side-info">
                  <p className="aura-prod-ed-side-name">{p.name}</p>
                  <div className="aura-prod-ed-side-bottom">
                    <span className="aura-prod-ed-side-price">{formatRupees(p.price)}</span>
                    <ArrowUpRight className="aura-prod-ed-side-arrow" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View all — text link, not button */}
        <div className="aura-prod-ed-cta-wrap">
          <Link href="/shop" className="aura-prod-ed-cta">
            <span>View all 45 pieces</span>
            <ArrowRight className="aura-prod-ed-cta-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}
