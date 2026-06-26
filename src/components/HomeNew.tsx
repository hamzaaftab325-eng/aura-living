'use client';

/**
 * HomeNew — Aura Living homepage sections.
 *
 * Section order:
 * 1. Categories — Asymmetric Magazine Spread (1 hero + 3 side, numbered)
 * 2. Brand Story — Process Timeline (4 craftsmanship steps, alternating)
 * 3. Featured Products — Editorial Showcase (1 hero product + 4 side, NOT a grid)
 * 4. New Arrivals — Horizontal Scroll Strip (NOT a grid, dark bg for contrast)
 * 5. Testimonials — Single Editorial Quote + stat cards (NOT a carousel)
 * 6. Newsletter — Cinematic Dark with parallax bg
 *
 * Design philosophy: Editorial composition, intentional asymmetry, layered depth,
 * typography-led hierarchy. Zero AI tells — every section has its own visual identity.
 * No two sections share the same layout pattern.
 *
 * All using existing design tokens. Zero inline styles (except dynamic image URLs).
 */

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CategoriesMagazine from '@/components/CategoriesMagazine';
import StoryProcess from '@/components/StoryProcess';
import ProductsEditorial from '@/components/ProductsEditorial';
import NewArrivalsStrip from '@/components/NewArrivalsStrip';
import TestimonialsEditorial from '@/components/TestimonialsEditorial';
import CTAGoldSection from '@/components/CTAGoldSection';
import type { Product, Category } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HomeNewProps {
  featuredProducts: Product[];
  newArrivals: Product[];
  categories: Category[];
}

export default function HomeNew({ featuredProducts, newArrivals, categories }: HomeNewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Legacy reveal support for any remaining [data-reveal] elements
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        );
      });
    },
    { scope: containerRef }
  );

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
          3. FEATURED PRODUCTS — Editorial Showcase
          1 hero product (left, large) + 4 side (right, 2x2). NOT a grid.
          Cart + wishlist wired via useStore.
          ═══════════════════════════════════════════════════════════ */}
      <ProductsEditorial products={featuredProducts} />

      {/* ═══════════════════════════════════════════════════════════
          4. NEW ARRIVALS — Horizontal Scroll Strip
          Dark bg for contrast. Tall cards, drag to scroll. NOT a grid.
          ═══════════════════════════════════════════════════════════ */}
      <NewArrivalsStrip products={newArrivals} />

      {/* ═══════════════════════════════════════════════════════════
          5. TESTIMONIALS — Single Editorial Quote
          One huge quote + stat cards. NOT a carousel of identical cards.
          ═══════════════════════════════════════════════════════════ */}
      <TestimonialsEditorial />

      {/* ═══════════════════════════════════════════════════════════
          7. CTA — Gold background closing section
          Newsletter lives in the footer. This closes the page with a
          bold gold CTA.
          ═══════════════════════════════════════════════════════════ */}
      <CTAGoldSection />
    </div>
  );
}
