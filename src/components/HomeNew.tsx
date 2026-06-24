'use client';

/**
 * HomeNew — Award-winning homepage design.
 *
 * Design approach (senior UI/UX perspective):
 * - Asymmetric split hero (no centered text — left content, right visual)
 * - Bento grid categories (not uniform cards — varied sizes creating visual rhythm)
 * - Scroll-driven brand story (sticky stacking cards with parallax)
 * - Editorial product showcase (magazine-style layout, not generic grid)
 * - Infinite marquee trust strip (movement = premium feel)
 * - Full-screen parallax CTA (dramatic, immersive)
 * - Minimal newsletter (not a heavy dark card — clean, airy)
 *
 * All using existing design tokens. Zero inline styles (except dynamic image URLs).
 */

import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CategoriesHoverReveal from '@/components/CategoriesHoverReveal';
import StoryQuote from '@/components/StoryQuote';
import CTAGoldBanner from '@/components/CTAGoldBanner';
import TrustMarquee from '@/components/TrustMarquee';
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

      // Parallax on hero image
      gsap.to('.aura-hero-parallax', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.aura-split-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Animated counters
      gsap.utils.toArray<HTMLElement>('.aura-counter-value').forEach((counter) => {
        const target = parseFloat(counter.dataset.target || '0');
        const decimals = parseInt(counter.dataset.decimals || '0');
        gsap.to(counter, {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: decimals === 0 ? 1 : 0.1 },
          onUpdate: function () {
            const val = parseFloat(counter.textContent || '0');
            counter.textContent = decimals > 0
              ? val.toFixed(decimals)
              : Math.round(val).toLocaleString('en-PK');
          },
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
            once: true,
          },
        });
      });
    },
    { scope: containerRef }
  );

  const products = featuredProducts.slice(0, 8);
  const newProducts = newArrivals.slice(0, 4);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════
          2. MARQUEE TRUST STRIP
          ═══════════════════════════════════════════════════════════ */}
      <div className="py-8 border-y border-[var(--color-gold-soft)]/20 bg-[var(--surface-card)] overflow-hidden">
        <div className="aura-marquee">
          <div className="aura-marquee-track">
            {['Handcrafted', 'Artisan Made', 'Premium Quality', 'COD Available', 'Free Shipping*', 'Made in Pakistan', 'Sustainable', '7-Day Returns'].map((item, i) => (
              <div key={i} className="aura-marquee-item">
                {item}
                <Sparkles className="w-5 h-5 aura-text-gold" />
              </div>
            ))}
          </div>
          <div className="aura-marquee-track" aria-hidden="true">
            {['Handcrafted', 'Artisan Made', 'Premium Quality', 'COD Available', 'Free Shipping*', 'Made in Pakistan', 'Sustainable', '7-Day Returns'].map((item, i) => (
              <div key={i} className="aura-marquee-item">
                {item}
                <Sparkles className="w-5 h-5 aura-text-gold" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. CATEGORIES — Hover Reveal (Demo 2 chosen design)
          ═══════════════════════════════════════════════════════════ */}
      <CategoriesHoverReveal categories={categories} />

      {/* ═══════════════════════════════════════════════════════════
          4. BRAND STORY — Quote-driven (Demo 5 chosen design)
          ═══════════════════════════════════════════════════════════ */}
      <StoryQuote />

      {/* ═══════════════════════════════════════════════════════════
          5. FEATURED PRODUCTS — using the shop ProductCard (cart + wishlist wired)
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
          5b. NEW ARRIVALS — fresh from the workshop (4 products)
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
          6. CTA — Gold Banner (Demo 2 chosen design)
          ═══════════════════════════════════════════════════════════ */}
      <CTAGoldBanner />

      {/* ═══════════════════════════════════════════════════════════
          7. TRUST — Dark Marquee (Demo 5 chosen design)
          ═══════════════════════════════════════════════════════════ */}
      <TrustMarquee />

      {/* ═══════════════════════════════════════════════════════════
          8. NEWSLETTER — Cinematic Dark (Demo 5 chosen design)
          ═══════════════════════════════════════════════════════════ */}
      <NewsletterCinematic />
    </div>
  );
}
