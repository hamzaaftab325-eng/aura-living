'use client';

/**
 * Hero Demos v5 — 5 Professional Shopify-style hero sections.
 *
 * Each demo is a complete, production-ready hero design inspired by
 * award-winning e-commerce sites (Brooklinen, Burrow, The Citizenry, etc.).
 *
 * Demos:
 * 1. Split Product Showcase — Left: product image + floating badges. Right: headline + CTA + trust
 * 2. Full-Bleed Lifestyle — Full-screen lifestyle image + overlay text + centered CTA
 * 3. Multi-Slide Carousel — Auto-rotating 3-slide carousel with arrows + dots
 * 4. Asymmetric Magazine — Editorial split, big product image, magazine typography
 * 5. Video Background + Floating Cards — Video bg + floating product cards on right
 *
 * Visit /hero-demos to preview all 5.
 *
 * All styling via CSS classes (.aura-hero-v5-*). Zero inline styles except
 * dynamic image URLs.
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Star, Truck, ShieldCheck, Banknote, Sparkles, ShoppingBag } from 'lucide-react';

// ── Shared slide data ──

interface Slide {
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
}

const slides: Slide[] = [
  {
    eyebrow: 'New Collection 2026',
    title: 'Where Comfort',
    titleAccent: 'Meets Style',
    subtitle: 'Handcrafted decor for the modern Pakistani home. Premium quality, delivered nationwide.',
    ctaLabel: 'Shop Collection',
    ctaHref: '/shop',
    image: '/images/hero/hero-slide-1.webp',
  },
  {
    eyebrow: 'Artisan Crafted',
    title: 'Made by Hand,',
    titleAccent: 'Made with Heart',
    subtitle: 'Every piece tells a story of Pakistani craftsmanship — from brass to ceramic.',
    ctaLabel: 'Explore Lighting',
    ctaHref: '/shop?category=lighting',
    image: '/images/hero/hero-slide-2.webp',
  },
  {
    eyebrow: 'Limited Edition',
    title: 'Bring Nature',
    titleAccent: 'Indoors',
    subtitle: 'Curated plants, planters & botanical accents that breathe life into your space.',
    ctaLabel: 'Shop Plants & Pots',
    ctaHref: '/shop?category=plants',
    image: '/images/hero/hero-slide-3.webp',
  },
];

const VIDEO_URL = 'https://res.cloudinary.com/diometfe9/video/upload/v1781723540/Working_on_ecommerce_store_backg__202606180012_pm2rtf.mp4';

// ═══════════════════════════════════════════════════════════
// DEMO 1 — Split Product Showcase
// Left: product image with floating badges. Right: headline + CTA + trust.
// ═══════════════════════════════════════════════════════════

function Hero1() {
  return (
    <section className="aura-hero-v5-1">
      <div className="aura-hero-v5-1-inner">
        {/* Left: product image */}
        <div className="aura-hero-v5-1-image-wrap">
          <Image
            src="/images/hero/hero-slide-1.webp"
            alt="Aura Living product"
            fill
            className="aura-hero-v5-1-image"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {/* Floating badge: rating */}
          <div className="aura-hero-v5-1-badge aura-hero-v5-1-badge-rating">
            <div className="aura-hero-v5-1-badge-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="aura-hero-v5-1-star aura-hero-v5-1-star-filled" />
              ))}
            </div>
            <span className="aura-hero-v5-1-badge-text">4.8/5 · 2,000+ reviews</span>
          </div>
          {/* Floating badge: COD */}
          <div className="aura-hero-v5-1-badge aura-hero-v5-1-badge-cod">
            <Banknote className="aura-hero-v5-1-badge-icon" />
            <span className="aura-hero-v5-1-badge-label">COD Available</span>
          </div>
        </div>

        {/* Right: content */}
        <div className="aura-hero-v5-1-content">
          <div className="aura-hero-v5-1-eyebrow">
            <Sparkles className="aura-hero-v5-1-eyebrow-icon" />
            <span>New Collection 2026</span>
          </div>
          <h1 className="aura-hero-v5-1-title">
            Where Comfort<br />
            <span className="aura-hero-v5-1-title-accent">Meets Style</span>
          </h1>
          <p className="aura-hero-v5-1-subtitle">
            Handcrafted decor for the modern Pakistani home. Premium quality, delivered nationwide.
          </p>
          <div className="aura-hero-v5-1-cta-row">
            <Link href="/shop" className="aura-hero-v5-1-cta-primary">
              Shop Collection
              <ArrowRight className="aura-hero-v5-1-cta-icon" />
            </Link>
            <Link href="/about" className="aura-hero-v5-1-cta-secondary">
              Our Story
            </Link>
          </div>
          {/* Trust row */}
          <div className="aura-hero-v5-1-trust">
            <div className="aura-hero-v5-1-trust-item">
              <Truck className="aura-hero-v5-1-trust-icon" />
              <span>Free Shipping<br />over Rs. 10,000</span>
            </div>
            <div className="aura-hero-v5-1-trust-divider" />
            <div className="aura-hero-v5-1-trust-item">
              <ShieldCheck className="aura-hero-v5-1-trust-icon" />
              <span>7-Day<br />Easy Returns</span>
            </div>
            <div className="aura-hero-v5-1-trust-divider" />
            <div className="aura-hero-v5-1-trust-item">
              <Banknote className="aura-hero-v5-1-trust-icon" />
              <span>Cash on<br />Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 2 — Full-Bleed Lifestyle
// Full-screen lifestyle image with overlay text + centered CTA.
// ═══════════════════════════════════════════════════════════

function Hero2() {
  return (
    <section className="aura-hero-v5-2">
      <Image
        src="/images/hero/hero-slide-3.webp"
        alt="Aura Living lifestyle"
        fill
        className="aura-hero-v5-2-bg"
        sizes="100vw"
        priority
      />
      <div className="aura-hero-v5-2-overlay" />
      <div className="aura-hero-v5-2-content">
        <span className="aura-hero-v5-2-eyebrow">Handcrafted in Pakistan</span>
        <h1 className="aura-hero-v5-2-title">
          Bring Nature<br />
          <span className="aura-hero-v5-2-title-accent">Indoors</span>
        </h1>
        <p className="aura-hero-v5-2-subtitle">
          Curated plants, planters & botanical accents that breathe life into your space.
        </p>
        <div className="aura-hero-v5-2-cta-row">
          <Link href="/shop?category=plants" className="aura-hero-v5-2-cta">
            Shop Plants & Pots
            <ArrowRight className="aura-hero-v5-2-cta-icon" />
          </Link>
        </div>
        {/* Trust badges row */}
        <div className="aura-hero-v5-2-trust">
          <div className="aura-hero-v5-2-trust-item">
            <Truck className="aura-hero-v5-2-trust-icon" />
            <span>Nationwide Shipping</span>
          </div>
          <div className="aura-hero-v5-2-trust-item">
            <Banknote className="aura-hero-v5-2-trust-icon" />
            <span>COD Available</span>
          </div>
          <div className="aura-hero-v5-2-trust-item">
            <ShieldCheck className="aura-hero-v5-2-trust-icon" />
            <span>7-Day Returns</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 3 — Multi-Slide Carousel
// Auto-rotating 3-slide carousel with arrows + dots.
// ═══════════════════════════════════════════════════════════

function Hero3() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goNext = () => setActive((prev) => (prev + 1) % slides.length);
  const goPrev = () => setActive((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[active];

  return (
    <section className="aura-hero-v5-3">
      {/* Background images — all stacked, only active visible */}
      {slides.map((s, i) => (
        <Image
          key={i}
          src={s.image}
          alt={s.title}
          fill
          className={`aura-hero-v5-3-bg ${i === active ? 'aura-hero-v5-3-bg-active' : ''}`}
          sizes="100vw"
          priority={i === 0}
        />
      ))}
      <div className="aura-hero-v5-3-overlay" />

      {/* Content */}
      <div className="aura-hero-v5-3-content" key={active}>
        <span className="aura-hero-v5-3-eyebrow">{slide.eyebrow}</span>
        <h1 className="aura-hero-v5-3-title">
          {slide.title}<br />
          <span className="aura-hero-v5-3-title-accent">{slide.titleAccent}</span>
        </h1>
        <p className="aura-hero-v5-3-subtitle">{slide.subtitle}</p>
        <Link href={slide.ctaHref} className="aura-hero-v5-3-cta">
          {slide.ctaLabel}
          <ArrowRight className="aura-hero-v5-3-cta-icon" />
        </Link>
      </div>

      {/* Arrows */}
      <button
        onClick={goPrev}
        className="aura-hero-v5-3-arrow aura-hero-v5-3-arrow-prev"
        aria-label="Previous slide"
      >
        <ArrowLeft className="aura-hero-v5-3-arrow-icon" />
      </button>
      <button
        onClick={goNext}
        className="aura-hero-v5-3-arrow aura-hero-v5-3-arrow-next"
        aria-label="Next slide"
      >
        <ArrowRight className="aura-hero-v5-3-arrow-icon" />
      </button>

      {/* Dots + counter */}
      <div className="aura-hero-v5-3-nav">
        <div className="aura-hero-v5-3-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aura-hero-v5-3-dot ${i === active ? 'aura-hero-v5-3-dot-active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="aura-hero-v5-3-counter">
          0{active + 1} <span className="aura-hero-v5-3-counter-sep">/</span> 0{slides.length}
        </span>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 4 — Asymmetric Magazine
// Editorial split: big product image (left, 60%) + magazine typography (right, 40%).
// ═══════════════════════════════════════════════════════════

function Hero4() {
  return (
    <section className="aura-hero-v5-4">
      <div className="aura-hero-v5-4-image-wrap">
        <Image
          src="/images/hero/hero-slide-2.webp"
          alt="Aura Living editorial"
          fill
          className="aura-hero-v5-4-image"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
        {/* Floating issue number */}
        <div className="aura-hero-v5-4-issue">
          <span className="aura-hero-v5-4-issue-num">01</span>
          <span className="aura-hero-v5-4-issue-label">The Lighting Edit</span>
        </div>
      </div>
      <div className="aura-hero-v5-4-content">
        <div className="aura-hero-v5-4-eyebrow-row">
          <span className="aura-hero-v5-4-eyebrow-line" />
          <span className="aura-hero-v5-4-eyebrow">Featured Collection</span>
        </div>
        <h1 className="aura-hero-v5-4-title">
          Made by Hand,<br />
          <span className="aura-hero-v5-4-title-accent">Made with Heart</span>
        </h1>
        <p className="aura-hero-v5-4-subtitle">
          Every piece tells a story of Pakistani craftsmanship — from brass to ceramic, lamp to vase.
        </p>
        <Link href="/shop?category=lighting" className="aura-hero-v5-4-cta">
          Explore Lighting
          <ArrowRight className="aura-hero-v5-4-cta-icon" />
        </Link>
        {/* Editorial stats */}
        <div className="aura-hero-v5-4-stats">
          <div className="aura-hero-v5-4-stat">
            <span className="aura-hero-v5-4-stat-num">45+</span>
            <span className="aura-hero-v5-4-stat-label">Handcrafted Pieces</span>
          </div>
          <div className="aura-hero-v5-4-stat-divider" />
          <div className="aura-hero-v5-4-stat">
            <span className="aura-hero-v5-4-stat-num">6</span>
            <span className="aura-hero-v5-4-stat-label">Curated Categories</span>
          </div>
          <div className="aura-hero-v5-4-stat-divider" />
          <div className="aura-hero-v5-4-stat">
            <span className="aura-hero-v5-4-stat-num">5K+</span>
            <span className="aura-hero-v5-4-stat-label">Happy Homes</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 5 — Video Background + Floating Cards
// Video bg (left/center) + floating product cards on right.
// ═══════════════════════════════════════════════════════════

function Hero5() {
  const products = [
    { name: 'Brass Table Lamp', price: 'Rs. 9,999', image: '/images/products/hammered-brass-table-lamp-1.webp', href: '/product/hammered-brass-table-lamp' },
    { name: 'Smoked Glass Pendant', price: 'Rs. 14,499', image: '/images/products/smoked-glass-pendant-light-1.webp', href: '/product/smoked-glass-pendant-light' },
    { name: 'Terracotta Herb Pot', price: 'Rs. 2,499', image: '/images/products/terracotta-herb-pot-set-1.webp', href: '/product/terracotta-herb-pot-set' },
  ];

  return (
    <section className="aura-hero-v5-5">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="aura-hero-v5-5-video"
        poster="/images/hero/hero-slide-1.webp"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
      <div className="aura-hero-v5-5-overlay" />

      {/* Content */}
      <div className="aura-hero-v5-5-content">
        <span className="aura-hero-v5-5-eyebrow">
          <Sparkles className="aura-hero-v5-5-eyebrow-icon" />
          New Collection 2026
        </span>
        <h1 className="aura-hero-v5-5-title">
          Where Comfort<br />
          <span className="aura-hero-v5-5-title-accent">Meets Style</span>
        </h1>
        <p className="aura-hero-v5-5-subtitle">
          Handcrafted decor for the modern Pakistani home.
        </p>
        <Link href="/shop" className="aura-hero-v5-5-cta">
          <ShoppingBag className="aura-hero-v5-5-cta-icon" />
          Shop Collection
        </Link>
      </div>

      {/* Floating product cards */}
      <div className="aura-hero-v5-5-cards">
        {products.map((p, i) => (
          <Link
            key={p.name}
            href={p.href}
            className={`aura-hero-v5-5-card aura-hero-v5-5-card-${i + 1}`}
          >
            <div className="aura-hero-v5-5-card-img-wrap">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="aura-hero-v5-5-card-img"
                sizes="120px"
              />
            </div>
            <div className="aura-hero-v5-5-card-info">
              <p className="aura-hero-v5-5-card-name">{p.name}</p>
              <p className="aura-hero-v5-5-card-price">{p.price}</p>
            </div>
            <ArrowRight className="aura-hero-v5-5-card-arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE — Tabbed
// ═══════════════════════════════════════════════════════════

const tabs = [
  { id: 0, label: 'Split Product', desc: 'Left: product image + floating badges. Right: headline + CTA + trust signals.', inspir: 'Brooklinen, Burrow' },
  { id: 1, label: 'Full-Bleed', desc: 'Full-screen lifestyle image with overlay text + centered CTA + trust row.', inspir: 'The Citizenry, West Elm' },
  { id: 2, label: 'Carousel', desc: 'Auto-rotating 3-slide carousel with arrows + dots + counter.', inspir: 'Apple, Nike' },
  { id: 3, label: 'Magazine', desc: 'Editorial split: big product image (60%) + magazine typography (40%) + stats.', inspir: 'MR PORTER, SSENSE' },
  { id: 4, label: 'Video + Cards', desc: 'Video background + floating product cards on right with prices.', inspir: 'Aesop, COS' },
];

export default function HeroDemosPage() {
  const [activeTab, setActiveTab] = useState(0);
  const heroes = [Hero1, Hero2, Hero3, Hero4, Hero5];
  const ActiveHero = heroes[activeTab];

  return (
    <div className="w-full">
      {/* Top tab selector */}
      <header className="demo-chrome">
        <div className="demo-chrome-inner">
          <div className="demo-chrome-row1">
            <span className="demo-chrome-brand">
              Aura<span className="demo-chrome-brand-dot">.</span>
              <span className="demo-chrome-brand-sub">Hero Lab</span>
            </span>
            <div className="demo-chrome-sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`demo-chrome-section ${activeTab === tab.id ? 'demo-chrome-section-active' : ''}`}
                >
                  {tab.id + 1}. {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Active hero — mounted fresh per switch */}
      <div key={activeTab} className="demo-chrome-stage">
        <ActiveHero />
      </div>

      {/* Info bar */}
      <footer className="demo-chrome-info">
        <div className="demo-chrome-info-inner">
          <span className="demo-chrome-info-section">Hero Demo {activeTab + 1}</span>
          <span className="demo-chrome-info-sep">·</span>
          <span className="demo-chrome-info-variant">{tabs[activeTab].label}</span>
          <p className="demo-chrome-info-desc">{tabs[activeTab].desc}</p>
          <p className="demo-chrome-info-inspir">Inspired by: {tabs[activeTab].inspir}</p>
          <div className="demo-chrome-info-pill">
            <span className="demo-chrome-info-pill-text">
              Reply with number {activeTab + 1} if you like this hero design
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
