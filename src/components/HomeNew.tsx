'use client';

/**
 * HomeNew — Aura Living homepage sections.
 *
 * Section order:
 * 1. Categories — Asymmetric Magazine Spread (1 hero + 3 side, numbered)
 * 2. Brand Story — Process Timeline (4 craftsmanship steps, alternating)
 * 3. Featured Products — 8 products using the shop ProductCard (cart + wishlist wired)
 * 4. New Arrivals — 4 fresh products
 * 5. Testimonials — customer reviews with stagger animation
 * 6. Newsletter — Cinematic Dark with parallax bg
 *
 * Design philosophy: Editorial composition, intentional asymmetry, layered depth,
 * typography-led hierarchy. Zero AI tells — every section has its own visual identity.
 *
 * All using existing design tokens. Zero inline styles (except dynamic image URLs).
 */

import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CategoriesMagazine from '@/components/CategoriesMagazine';
import StoryProcess from '@/components/StoryProcess';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterCinematic from '@/components/NewsletterCinematic';
import PremiumButton from '@/components/ui/PremiumButton';
import ProductCard from '@/components/ui/ProductCard';
import type { Product, Category } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HomeNewProps {
  featuredProducts: Product[];
  newArrivals: Product[];
  categories: Category[];
}

export default function HomeNew({ featuredProducts, newArrivals, categories }: HomeNewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered reveals for all [data-reveal] elements
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      // Stagger children
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((container) => {
        const children = container.children;
        gsap.fromTo(
          children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              once: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  const products = featuredProducts.slice(0, 8);
  const newProducts = newArrivals.slice(0, 4);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════
          1. CATEGORIES — Asymmetric Magazine Spread
          Editorial composition: 1 hero category + 3 side, numbered.
          ═══════════════════════════════════════════════════════════ */}
      <CategoriesMagazine categories={categories} />

      {/* ═══════════════════════════════════════════════════════════
          2. BRAND STORY — Process Timeline
          4 craftsmanship steps, alternating left/right, gold connector.
          ═══════════════════════════════════════════════════════════ */}
      <StoryProcess />

      {/* ═══════════════════════════════════════════════════════════
          3. FEATURED PRODUCTS — using the shop ProductCard (cart + wishlist wired)
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div data-reveal className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="aura-gold-line" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] aura-text-gold">Featured</span>
              <div className="aura-gold-line" />
            </div>
            <h2 className="aura-mega-text aura-heading-featured mb-4">
              Curated <span className="aura-text-gradient-gold">Favorites</span>
            </h2>
            <p className="text-base aura-text-secondary max-w-lg mx-auto">
              Our most-loved pieces, handpicked for your home
            </p>
          </div>

          {/* Product grid — uses the same ProductCard as the shop page */}
          <div data-stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View all CTA */}
          <div data-reveal className="text-center mt-12">
            <PremiumButton variant="primary" size="lg" href="/shop" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Products
            </PremiumButton>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. NEW ARRIVALS — fresh from the workshop (4 products)
          ═══════════════════════════════════════════════════════════ */}
      {newProducts.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 bg-[var(--surface-card)]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div data-reveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="aura-gold-line" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] aura-text-gold">Just Landed</span>
                <div className="aura-gold-line" />
              </div>
              <h2 className="aura-mega-text aura-heading-featured mb-4">
                New <span className="aura-text-gradient-gold">Arrivals</span>
              </h2>
              <p className="text-base aura-text-secondary max-w-lg mx-auto">
                Fresh pieces, just added to the collection
              </p>
            </div>

            {/* New arrivals grid */}
            <div data-stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* View all CTA */}
            <div data-reveal className="text-center mt-12">
              <PremiumButton variant="secondary" size="lg" href="/new-arrivals" rightIcon={<ArrowRight className="w-4 h-4" />}>
                See All New Arrivals
              </PremiumButton>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          5. TESTIMONIALS — customer reviews with stagger animation
          ═══════════════════════════════════════════════════════════ */}
      <TestimonialsSection />

      {/* ═══════════════════════════════════════════════════════════
          6. NEWSLETTER — Cinematic Dark with parallax bg
          ═══════════════════════════════════════════════════════════ */}
      <NewsletterCinematic />
    </div>
  );
}
