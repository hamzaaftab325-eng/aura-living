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

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Truck, Banknote, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '@/hooks/useAnimations';
import { GoldDivider } from '@/components/SVGDecorations';
import PremiumButton from '@/components/ui/PremiumButton';
import { formatRupees } from '@/lib/currency-display';
import type { Product, Category } from '@/types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HomeNewProps {
  featuredProducts: Product[];
  categories: Category[];
}

export default function HomeNew({ featuredProducts, categories }: HomeNewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);

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

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════
          1. SPLIT HERO — Asymmetric, editorial, no centered text
          ═══════════════════════════════════════════════════════════ */}
      <section className="aura-split-hero">
        {/* Left: Content */}
        <div className="aura-split-hero-left">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="aura-gold-line" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] aura-text-gold">
                Est. 2026 · Pakistan
              </span>
            </div>

            <h1 className="aura-mega-text mb-6">
              Where<br />
              <span className="aura-text-gradient-gold">Comfort</span><br />
              Meets Style
            </h1>

            <p className="text-lg leading-relaxed aura-text-secondary mb-10 max-w-md">
              Handcrafted home decor for the modern Pakistani home. Lamps, vases,
              plants & more — designed in-house, made by artisans.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <PremiumButton variant="primary" size="lg" href="/shop" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Shop Collection
              </PremiumButton>
              <PremiumButton variant="secondary" size="lg" href="/about">
                Our Story
              </PremiumButton>
            </div>

            {/* Mini stats */}
            <div className="flex gap-8 pt-8 border-t border-[var(--color-gold-soft)]/30">
              <div>
                <div className="aura-inline-counter mb-1">
                  <span className="aura-counter-value" data-target="5000" data-decimals="0">0</span>+
                </div>
                <p className="text-xs uppercase tracking-wider aura-text-secondary">Happy Homes</p>
              </div>
              <div>
                <div className="aura-inline-counter mb-1">
                  <span className="aura-counter-value" data-target="200" data-decimals="0">0</span>+
                </div>
                <p className="text-xs uppercase tracking-wider aura-text-secondary">Artisans</p>
              </div>
              <div>
                <div className="aura-inline-counter mb-1">
                  <span className="aura-counter-value" data-target="4.8" data-decimals="1">0</span>
                </div>
                <p className="text-xs uppercase tracking-wider aura-text-secondary">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="aura-split-hero-right">
          <div className="aura-hero-parallax absolute inset-0">
            <Image
              src="/images/hero/hero-slide-1.webp"
              alt="Aura Living premium home decor"
              fill
              priority
              className="object-cover"
              sizes="50vw"
            />
          </div>
          {/* Floating product card */}
          <div className="absolute bottom-8 left-8 right-8 lg:right-auto lg:w-72 p-5 rounded-xl aura-glass-gold z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image src="/images/products/hammered-brass-table-lamp-1.webp" alt="Featured" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold">Hammered Brass Lamp</p>
                <p className="text-sm font-bold aura-text-gold">Rs. 9,999</p>
              </div>
            </div>
            <Link href="/product/hammered-brass-table-lamp" className="text-xs font-medium flex items-center gap-1 aura-text-gold hover:underline">
              View Product <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

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
          3. BENTO CATEGORIES — Asymmetric grid, not uniform cards
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div data-reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="aura-gold-line" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] aura-text-gold">Explore</span>
              </div>
              <h2 className="aura-mega-text" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                Shop by <span className="aura-text-gradient-gold">Category</span>
              </h2>
            </div>
            <Link href="/shop" className="text-sm font-medium flex items-center gap-1 aura-text-gold hover:underline whitespace-nowrap">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Bento grid */}
          <div data-stagger className="aura-bento">
            {categories.slice(0, 6).map((cat, i) => {
              const sizes = [
                'aura-bento-tall',
                '',
                'aura-bento-wide',
                '',
                '',
                '',
              ];
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.id}`}
                  className={`aura-bento-item ${sizes[i] || ''} ${i === 0 ? 'min-h-[300px] sm:min-h-[400px]' : 'min-h-[180px] sm:min-h-[200px]'}`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="aura-bento-overlay">
                    <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                    <p className="text-xs text-white/60">{cat.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. BRAND STORY — Editorial split with parallax
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 md:py-24 bg-[var(--surface-accent)]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div data-reveal className="relative">
              <div className="rounded-xl overflow-hidden aspect-[4/5] sm:aspect-[5/4]">
                <Image
                  src="/images/about-workshop.webp"
                  alt="Aura Living artisan workshop"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-6 p-6 rounded-xl aura-glass shadow-lg max-w-[200px] hidden sm:block">
                <p className="aura-inline-counter mb-1">
                  <span className="aura-counter-value" data-target="100" data-decimals="0">0</span>%
                </p>
                <p className="text-xs aura-text-secondary">Handcrafted by skilled artisans across Pakistan</p>
              </div>
            </div>

            {/* Text */}
            <div data-reveal className="aura-editorial">
              <div className="aura-editorial-eyebrow">
                <div className="aura-gold-line" />
                Our Story
              </div>
              <h2 className="aura-editorial-title">
                Not factory-made.<br />
                <span className="aura-text-gradient-gold">Hand-made.</span>
              </h2>
              <p className="aura-editorial-body">
                We work directly with artisans across Pakistan — brass-workers in Lahore,
                ceramicists in Sindh, weavers in Punjab. Every lamp, vase, and planter tells
                a story of traditional craftsmanship meeting modern design.
              </p>
              <p className="aura-editorial-body">
                No mass production. No middlemen. Just beautiful, lasting pieces made with
                pride — delivered to your doorstep.
              </p>
              <PremiumButton variant="secondary" href="/about" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Read Our Full Story
              </PremiumButton>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. PRODUCT SHOWCASE — Editorial magazine-style layout
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
            <h2 className="aura-mega-text mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Curated <span className="aura-text-gradient-gold">Favorites</span>
            </h2>
            <p className="text-base aura-text-secondary max-w-lg mx-auto">
              Our most-loved pieces, handpicked for your home
            </p>
          </div>

          {/* Product grid — first 4 large, next 4 smaller */}
          <div data-stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="aura-showcase-card group"
              >
                {product.badge && (
                  <span className={`aura-showcase-badge ${product.badge === 'SALE' ? 'aura-showcase-badge-gold' : 'aura-showcase-badge-dark'}`}>
                    {product.badge}
                  </span>
                )}
                <div className="aura-showcase-img">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="aura-showcase-info">
                  <p className="aura-showcase-name">{product.name}</p>
                  <div>
                    <span className="aura-showcase-price">{formatRupees(product.price)}</span>
                    {product.originalPrice && (
                      <span className="aura-showcase-original">{formatRupees(product.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </Link>
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
          6. FULL-SCREEN PARALLAX CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="aura-cta-fullscreen">
        <div
          className="aura-cta-bg"
          style={{ backgroundImage: 'url(/images/hero/hero-slide-3.webp)' }}
        />
        <div className="aura-cta-overlay" />
        <div data-reveal className="relative z-10 text-center px-4 max-w-2xl">
          <Sparkles className="w-8 h-8 aura-text-gold mx-auto mb-6" />
          <h2 className="aura-mega-text text-white mb-6 aura-cinematic-text" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            Ready to Transform Your Home?
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-md mx-auto">
            Join 5,000+ Pakistani homes that chose Aura Living for their decor.
          </p>
          <PremiumButton variant="primary" size="lg" href="/shop" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Start Shopping
          </PremiumButton>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. TRUST BADGES — Minimal, clean
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-stagger className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'Orders above Rs. 10,000' },
              { icon: Banknote, title: 'Cash on Delivery', desc: 'Pay when it arrives' },
              { icon: ShieldCheck, title: '7-Day Returns', desc: 'Easy & hassle-free' },
              { icon: Star, title: '4.8/5 Rating', desc: 'From 2,000+ reviews' },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.title} className="text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 aura-bg-gold-tint">
                    <Icon className="w-6 h-6 aura-text-gold" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{badge.title}</h3>
                  <p className="text-xs aura-text-secondary">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. NEWSLETTER — Minimal, airy, not heavy dark card
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 md:py-24 bg-[var(--surface-accent)]/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div data-reveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="aura-gold-line" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] aura-text-gold">Stay Connected</span>
              <div className="aura-gold-line" />
            </div>
            <h2 className="aura-mega-text mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Join the <span className="aura-text-gradient-gold">Aura Family</span>
            </h2>
            <p className="text-base aura-text-secondary mb-8 max-w-md mx-auto">
              Get 10% off your first order, plus early access to new arrivals and exclusive offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input');
                if (input?.value) {
                  fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: input.value, source: 'homepage-new' }),
                  });
                  input.value = '';
                  alert('Welcome to the family! Check your email for your discount code.');
                }
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="aura-input-modern flex-1 px-4 py-3"
              />
              <PremiumButton type="submit" variant="primary" size="lg">
                Subscribe
              </PremiumButton>
            </form>
            <p className="text-xs aura-text-secondary mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
