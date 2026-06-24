'use client';

/**
 * Hero Demos v6 — 5 MODERN hero sections.
 *
 * Inspired by the most cutting-edge 2025/2026 sites (Linear, Vercel, Stripe,
 * Arc, Framer). Each demo uses a distinct modern design language:
 *
 * 1. Aurora Mesh Gradient — animated mesh gradient bg + glass content card
 * 2. Spotlight Cursor — dark bg with cursor-following radial spotlight
 * 3. Bento Grid — asymmetric bento grid of category cards + headline
 * 4. Kinetic Marquee — giant scrolling marquee text + product cards row
 * 5. Split Glass — left: glass card with content. Right: floating product orbs
 *
 * Visit /hero-demos to preview all 5.
 *
 * All styling via CSS classes (.aura-hero-v6-*). Zero inline styles except
 * dynamic image URLs.
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Sparkles, Star } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// DEMO 1 — Aurora Mesh Gradient
// Animated mesh gradient background + glass content card centered.
// ═══════════════════════════════════════════════════════════

function Hero1() {
  return (
    <section className="aura-hero-v6-1">
      {/* Animated mesh gradient blobs */}
      <div className="aura-hero-v6-1-blob aura-hero-v6-1-blob-1" />
      <div className="aura-hero-v6-1-blob aura-hero-v6-1-blob-2" />
      <div className="aura-hero-v6-1-blob aura-hero-v6-1-blob-3" />
      {/* Grain texture */}
      <div className="aura-hero-v6-1-grain" />

      <div className="aura-hero-v6-1-content">
        <div className="aura-hero-v6-1-card">
          <span className="aura-hero-v6-1-badge">
            <span className="aura-hero-v6-1-badge-dot" />
            New Collection 2026
          </span>
          <h1 className="aura-hero-v6-1-title">
            Where Comfort<br />
            <span className="aura-hero-v6-1-title-accent">Meets Style</span>
          </h1>
          <p className="aura-hero-v6-1-subtitle">
            Handcrafted decor for the modern Pakistani home. Premium quality, delivered nationwide.
          </p>
          <div className="aura-hero-v6-1-cta-row">
            <Link href="/shop" className="aura-hero-v6-1-cta-primary">
              Shop Collection
              <ArrowRight className="aura-hero-v6-1-cta-icon" />
            </Link>
            <Link href="/lookbook" className="aura-hero-v6-1-cta-secondary">
              Lookbook
              <ArrowUpRight className="aura-hero-v6-1-cta-icon-sm" />
            </Link>
          </div>
          {/* Mini stats */}
          <div className="aura-hero-v6-1-stats">
            <div className="aura-hero-v6-1-stat">
              <span className="aura-hero-v6-1-stat-num">5K+</span>
              <span className="aura-hero-v6-1-stat-label">Homes</span>
            </div>
            <div className="aura-hero-v6-1-stat-sep" />
            <div className="aura-hero-v6-1-stat">
              <span className="aura-hero-v6-1-stat-num">4.8</span>
              <span className="aura-hero-v6-1-stat-label">Rating</span>
            </div>
            <div className="aura-hero-v6-1-stat-sep" />
            <div className="aura-hero-v6-1-stat">
              <span className="aura-hero-v6-1-stat-num">45+</span>
              <span className="aura-hero-v6-1-stat-label">Products</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 2 — Spotlight Cursor
// Dark bg with cursor-following radial spotlight + bold typography.
// ═══════════════════════════════════════════════════════════

function Hero2() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--aura-hero-v6-2-x', `${x}%`);
      el.style.setProperty('--aura-hero-v6-2-y', `${y}%`);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section ref={ref} className="aura-hero-v6-2">
      <div className="aura-hero-v6-2-spotlight" />
      <div className="aura-hero-v6-2-grid" />

      <div className="aura-hero-v6-2-content">
        <span className="aura-hero-v6-2-eyebrow">
          <Sparkles className="aura-hero-v6-2-eyebrow-icon" />
          Handcrafted in Pakistan
        </span>
        <h1 className="aura-hero-v6-2-title">
          Bring Nature
          <br />
          <span className="aura-hero-v6-2-title-accent">Indoors</span>
        </h1>
        <p className="aura-hero-v6-2-subtitle">
          Curated plants, planters & botanical accents that breathe life into your space.
        </p>
        <div className="aura-hero-v6-2-cta-row">
          <Link href="/shop?category=plants" className="aura-hero-v6-2-cta">
            Shop Plants
            <ArrowRight className="aura-hero-v6-2-cta-icon" />
          </Link>
          <Link href="/shop" className="aura-hero-v6-2-cta-ghost">
            Explore All
          </Link>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="aura-hero-v6-2-marquee">
        <div className="aura-hero-v6-2-marquee-track">
          {['Free Shipping', 'COD Available', '7-Day Returns', 'Handcrafted', 'Made in Pakistan', 'Premium Quality', 'Free Shipping', 'COD Available', '7-Day Returns', 'Handcrafted', 'Made in Pakistan', 'Premium Quality'].map((t, i) => (
            <span key={i} className="aura-hero-v6-2-marquee-item">
              {t}
              <span className="aura-hero-v6-2-marquee-dot" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 3 — Bento Grid
// Asymmetric bento grid of category cards + headline block.
// ═══════════════════════════════════════════════════════════

function Hero3() {
  const cats = [
    { name: 'Lighting', img: '/images/categories/lighting-category.webp', span: 'tall' },
    { name: 'Plants & Pots', img: '/images/categories/plants-category.webp', span: 'wide' },
    { name: 'Vases', img: '/images/categories/vases-category.webp', span: 'small' },
    { name: 'Candles', img: '/images/categories/candles-category.webp', span: 'small' },
    { name: 'Wall Art', img: '/images/categories/wallart-category.webp', span: 'small' },
  ];

  return (
    <section className="aura-hero-v6-3">
      <div className="aura-hero-v6-3-inner">
        {/* Left: headline block */}
        <div className="aura-hero-v6-3-headline-block">
          <span className="aura-hero-v6-3-eyebrow">New Collection 2026</span>
          <h1 className="aura-hero-v6-3-title">
            Where Comfort<br />
            <span className="aura-hero-v6-3-title-accent">Meets Style</span>
          </h1>
          <p className="aura-hero-v6-3-subtitle">
            Handcrafted decor for the modern Pakistani home.
          </p>
          <Link href="/shop" className="aura-hero-v6-3-cta">
            Shop Collection
            <ArrowRight className="aura-hero-v6-3-cta-icon" />
          </Link>
        </div>

        {/* Right: bento grid */}
        <div className="aura-hero-v6-3-bento">
          {cats.map((c, i) => (
            <Link
              key={c.name}
              href={`/shop?category=${c.name.toLowerCase().split(' ')[0]}`}
              className={`aura-hero-v6-3-cell aura-hero-v6-3-cell-${c.span}`}
            >
              <Image
                src={c.img}
                alt={c.name}
                fill
                className="aura-hero-v6-3-cell-img"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="aura-hero-v6-3-cell-overlay" />
              <div className="aura-hero-v6-3-cell-content">
                <span className="aura-hero-v6-3-cell-name">{c.name}</span>
                <ArrowUpRight className="aura-hero-v6-3-cell-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 4 — Kinetic Marquee
// Giant scrolling marquee text + product cards row below.
// ═══════════════════════════════════════════════════════════

function Hero4() {
  const products = [
    { name: 'Brass Table Lamp', price: 'Rs. 9,999', image: '/images/products/hammered-brass-table-lamp-1.webp', href: '/product/hammered-brass-table-lamp' },
    { name: 'Glass Pendant', price: 'Rs. 14,499', image: '/images/products/smoked-glass-pendant-light-1.webp', href: '/product/smoked-glass-pendant-light' },
    { name: 'Terracotta Pot', price: 'Rs. 2,499', image: '/images/products/terracotta-herb-pot-set-1.webp', href: '/product/terracotta-herb-pot-set' },
    { name: 'Marble Vase', price: 'Rs. 5,999', image: '/images/products/marble-vase-1.webp', href: '/product/marble-vase' },
  ];

  return (
    <section className="aura-hero-v6-4">
      {/* Top: giant kinetic marquee */}
      <div className="aura-hero-v6-4-marquee">
        <div className="aura-hero-v6-4-marquee-track">
          {['Handcrafted', 'Premium', 'Artisan', 'Made in Pakistan'].map((word, i) => (
            <span key={i} className="aura-hero-v6-4-marquee-word">
              {word}
              <span className="aura-hero-v6-4-marquee-star">✦</span>
            </span>
          ))}
          {['Handcrafted', 'Premium', 'Artisan', 'Made in Pakistan'].map((word, i) => (
            <span key={`d-${i}`} className="aura-hero-v6-4-marquee-word" aria-hidden="true">
              {word}
              <span className="aura-hero-v6-4-marquee-star">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Middle: content */}
      <div className="aura-hero-v6-4-content">
        <span className="aura-hero-v6-4-eyebrow">New Collection 2026</span>
        <h1 className="aura-hero-v6-4-title">
          Made by Hand,<br />
          <span className="aura-hero-v6-4-title-accent">Made with Heart</span>
        </h1>
        <Link href="/shop" className="aura-hero-v6-4-cta">
          Shop Collection
          <ArrowRight className="aura-hero-v6-4-cta-icon" />
        </Link>
      </div>

      {/* Bottom: product cards row */}
      <div className="aura-hero-v6-4-products">
        {products.map((p) => (
          <Link key={p.name} href={p.href} className="aura-hero-v6-4-product">
            <div className="aura-hero-v6-4-product-img-wrap">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="aura-hero-v6-4-product-img"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            </div>
            <div className="aura-hero-v6-4-product-info">
              <span className="aura-hero-v6-4-product-name">{p.name}</span>
              <span className="aura-hero-v6-4-product-price">{p.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 5 — Split Glass
// Left: glass card with content. Right: floating product orbs.
// ═══════════════════════════════════════════════════════════

function Hero5() {
  const orbs = [
    { name: 'Brass Lamp', price: 'Rs. 9,999', image: '/images/products/hammered-brass-table-lamp-1.webp', href: '/product/hammered-brass-table-lamp', pos: 1 },
    { name: 'Glass Pendant', price: 'Rs. 14,499', image: '/images/products/smoked-glass-pendant-light-1.webp', href: '/product/smoked-glass-pendant-light', pos: 2 },
    { name: 'Terracotta', price: 'Rs. 2,499', image: '/images/products/terracotta-herb-pot-set-1.webp', href: '/product/terracotta-herb-pot-set', pos: 3 },
  ];

  return (
    <section className="aura-hero-v6-5">
      {/* Background gradient mesh */}
      <div className="aura-hero-v6-5-mesh" />

      <div className="aura-hero-v6-5-inner">
        {/* Left: glass content card */}
        <div className="aura-hero-v6-5-glass">
          <span className="aura-hero-v6-5-badge">
            <span className="aura-hero-v6-5-badge-dot" />
            New Collection 2026
          </span>
          <h1 className="aura-hero-v6-5-title">
            Where Comfort<br />
            <span className="aura-hero-v6-5-title-accent">Meets Style</span>
          </h1>
          <p className="aura-hero-v6-5-subtitle">
            Handcrafted decor for the modern Pakistani home. Premium quality, delivered nationwide.
          </p>
          <div className="aura-hero-v6-5-cta-row">
            <Link href="/shop" className="aura-hero-v6-5-cta">
              Shop Collection
              <ArrowRight className="aura-hero-v6-5-cta-icon" />
            </Link>
          </div>
          {/* Rating row */}
          <div className="aura-hero-v6-5-rating">
            <div className="aura-hero-v6-5-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="aura-hero-v6-5-star" />
              ))}
            </div>
            <span className="aura-hero-v6-5-rating-text">4.8/5 · 2,000+ reviews</span>
          </div>
        </div>

        {/* Right: floating product orbs */}
        <div className="aura-hero-v6-5-orbs">
          {orbs.map((o) => (
            <Link
              key={o.name}
              href={o.href}
              className={`aura-hero-v6-5-orb aura-hero-v6-5-orb-${o.pos}`}
            >
              <div className="aura-hero-v6-5-orb-img-wrap">
                <Image
                  src={o.image}
                  alt={o.name}
                  fill
                  className="aura-hero-v6-5-orb-img"
                  sizes="200px"
                />
              </div>
              <div className="aura-hero-v6-5-orb-info">
                <span className="aura-hero-v6-5-orb-name">{o.name}</span>
                <span className="aura-hero-v6-5-orb-price">{o.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE — Tabbed
// ═══════════════════════════════════════════════════════════

const tabs = [
  { id: 0, label: 'Aurora Mesh', desc: 'Animated mesh gradient blobs + glass content card + mini stats.', inspir: 'Linear, Vercel' },
  { id: 1, label: 'Spotlight Cursor', desc: 'Dark bg with cursor-following radial spotlight + bottom marquee.', inspir: 'Stripe, Arc' },
  { id: 2, label: 'Bento Grid', desc: 'Asymmetric bento grid of category cards + headline block.', inspir: 'Apple, Framer' },
  { id: 3, label: 'Kinetic Marquee', desc: 'Giant scrolling marquee text + product cards row.', inspir: 'Awwwards sites' },
  { id: 4, label: 'Split Glass', desc: 'Left: glass card with content. Right: floating product orbs.', inspir: 'Framer, Linear' },
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
