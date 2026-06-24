'use client';

/**
 * HeroSanctuary — "The Immersive Sanctuary" premium editorial hero.
 *
 * Design system:
 * - Light theme, warm-minimalist "affordable luxury" vibe
 * - Palette: off-white #FAF9F6, soft charcoal #1C1B19, warm terracotta #C07A65
 * - Full-bleed cinematic bg image with soft radial glaze + warm vignette
 * - 12-column grid, max-w-7xl, spacious padding
 *
 * Layout:
 * - LEFT (6 cols): pill badge "03 / The Immersive Sanctuary", huge serif heading
 *   "The Sahil Sanctuary", emotional storytelling, micro-scroller with pulsing dot
 * - RIGHT (5 cols, right-aligned): floating glassmorphic purchase card with
 *   backdrop-blur-xl + thin translucent white border. Contains:
 *   · Product detail zoom thumbnail with mini-indicator tag
 *   · Tab system (Craft Narrative / Blueprint Specs) with smooth underbars
 *   · Price + "Acquire Article" drawer showing COD availability
 *
 * GSAP entrance animations matching the home-new pattern.
 * All CSS-class driven (.aura-hero-sanctuary-*). Zero inline styles except
 * dynamic image URL.
 */

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Truck, Banknote, ShieldCheck, ChevronRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HeroSanctuaryProps {
  image?: string;
  productImage?: string;
  productName?: string;
  productPrice?: number;
}

const DEFAULT_BG = '/images/hero/sanctuary-hero.png';
const DEFAULT_PRODUCT_IMG = '/images/products/hammered-brass-table-lamp-1.webp';
const DEFAULT_PRODUCT_NAME = 'Sahil Sheesham Console';
const DEFAULT_PRODUCT_PRICE = 89999;

type Tab = 'craft' | 'blueprint';

export default function HeroSanctuary({
  image = DEFAULT_BG,
  productImage = DEFAULT_PRODUCT_IMG,
  productName = DEFAULT_PRODUCT_NAME,
  productPrice = DEFAULT_PRODUCT_PRICE,
}: HeroSanctuaryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>('craft');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Format price as PKR
  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(productPrice);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      // Left column
      tl.fromTo(
        '.aura-hero-sanctuary-badge',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
      tl.fromTo(
        '.aura-hero-sanctuary-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.3'
      );
      tl.fromTo(
        '.aura-hero-sanctuary-story',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      );
      tl.fromTo(
        '.aura-hero-sanctuary-scroller',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );

      // Right column (purchase card)
      tl.fromTo(
        '.aura-hero-sanctuary-card',
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.2)' },
        '-=0.6'
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="aura-hero-sanctuary">
      {/* Full-bleed background image */}
      <Image
        src={image}
        alt="The Sahil Sanctuary — modern luxury living room in Pakistan"
        fill
        className="aura-hero-sanctuary-bg"
        sizes="100vw"
        priority
      />

      {/* Soft radial glaze + warm vignette overlays */}
      <div className="aura-hero-sanctuary-glaze" />
      <div className="aura-hero-sanctuary-vignette" />

      {/* 12-column grid container */}
      <div className="aura-hero-sanctuary-inner">
        {/* LEFT COLUMN (6 cols) */}
        <div className="aura-hero-sanctuary-left">
          {/* Pill badge */}
          <span className="aura-hero-sanctuary-badge">
            <Sparkles className="aura-hero-sanctuary-badge-icon" />
            03 / The Immersive Sanctuary
          </span>

          {/* Huge editorial heading */}
          <h1 className="aura-hero-sanctuary-title">
            The Sahil<br />
            <span className="aura-hero-sanctuary-title-accent">Sanctuary</span>
          </h1>

          {/* Emotional storytelling */}
          <p className="aura-hero-sanctuary-story">
            Carved from raw sheesham by Lahori master carpenters, each piece
            carries the quiet patience of heritage. Organic materials, honest
            joinery, and the warm grain of wood that has waited decades to
            become this.
          </p>

          {/* Micro-scroller indicator */}
          <div className="aura-hero-sanctuary-scroller">
            <span className="aura-hero-sanctuary-scroller-dot" />
            <span className="aura-hero-sanctuary-scroller-line" />
            <span className="aura-hero-sanctuary-scroller-text">Scroll to explore</span>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols, right-aligned) */}
        <div className="aura-hero-sanctuary-right">
          {/* Floating glassmorphic purchase card */}
          <div className="aura-hero-sanctuary-card">
            {/* Product detail zoom thumbnail with mini-indicator */}
            <div className="aura-hero-sanctuary-thumb-wrap">
              <Image
                src={productImage}
                alt={productName}
                fill
                className="aura-hero-sanctuary-thumb"
                sizes="200px"
              />
              <span className="aura-hero-sanctuary-thumb-tag">Detail Zoom</span>
              <span className="aura-hero-sanctuary-thumb-indicator" />
            </div>

            {/* Product name + price */}
            <div className="aura-hero-sanctuary-card-head">
              <div>
                <p className="aura-hero-sanctuary-card-name">{productName}</p>
                <p className="aura-hero-sanctuary-card-sku">SKU: SAHIL-001</p>
              </div>
              <p className="aura-hero-sanctuary-card-price">Rs. {formattedPrice}</p>
            </div>

            {/* Tab system with smooth underbars */}
            <div className="aura-hero-sanctuary-tabs">
              <button
                type="button"
                onClick={() => setActiveTab('craft')}
                className={`aura-hero-sanctuary-tab ${activeTab === 'craft' ? 'aura-hero-sanctuary-tab-active' : ''}`}
              >
                Craft Narrative
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('blueprint')}
                className={`aura-hero-sanctuary-tab ${activeTab === 'blueprint' ? 'aura-hero-sanctuary-tab-active' : ''}`}
              >
                Blueprint Specs
              </button>
              <span
                className={`aura-hero-sanctuary-tab-underbar ${activeTab === 'blueprint' ? 'aura-hero-sanctuary-tab-underbar-right' : ''}`}
              />
            </div>

            {/* Tab content */}
            <div className="aura-hero-sanctuary-tab-content">
              {activeTab === 'craft' ? (
                <p className="aura-hero-sanctuary-tab-text">
                  Hand-finished by third-generation carpenters in Lahore. Solid
                  sheesham with traditional mortise-and-tenon joinery — no nails,
                  no shortcuts. Each piece is signed by its maker.
                </p>
              ) : (
                <ul className="aura-hero-sanctuary-specs">
                  <li className="aura-hero-sanctuary-spec">
                    <span className="aura-hero-sanctuary-spec-label">Material</span>
                    <span className="aura-hero-sanctuary-spec-value">Solid Sheesham Wood</span>
                  </li>
                  <li className="aura-hero-sanctuary-spec">
                    <span className="aura-hero-sanctuary-spec-label">Dimensions</span>
                    <span className="aura-hero-sanctuary-spec-value">160 × 40 × 75 cm</span>
                  </li>
                  <li className="aura-hero-sanctuary-spec">
                    <span className="aura-hero-sanctuary-spec-label">Finish</span>
                    <span className="aura-hero-sanctuary-spec-value">Hand-rubbed natural oil</span>
                  </li>
                  <li className="aura-hero-sanctuary-spec">
                    <span className="aura-hero-sanctuary-spec-label">Origin</span>
                    <span className="aura-hero-sanctuary-spec-value">Lahore, Pakistan</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Acquire Article drawer trigger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="aura-hero-sanctuary-acquire"
            >
              <span>Acquire Article</span>
              <ChevronRight className={`aura-hero-sanctuary-acquire-chevron ${drawerOpen ? 'aura-hero-sanctuary-acquire-chevron-open' : ''}`} />
            </button>

            {/* COD drawer */}
            <div className={`aura-hero-sanctuary-drawer ${drawerOpen ? 'aura-hero-sanctuary-drawer-open' : ''}`}>
              <div className="aura-hero-sanctuary-drawer-inner">
                <div className="aura-hero-sanctuary-drawer-row">
                  <Banknote className="aura-hero-sanctuary-drawer-icon" />
                  <div>
                    <p className="aura-hero-sanctuary-drawer-title">Cash on Delivery</p>
                    <p className="aura-hero-sanctuary-drawer-sub">Available across Pakistan</p>
                  </div>
                </div>
                <div className="aura-hero-sanctuary-drawer-row">
                  <Truck className="aura-hero-sanctuary-drawer-icon" />
                  <div>
                    <p className="aura-hero-sanctuary-drawer-title">Free White-Glove Delivery</p>
                    <p className="aura-hero-sanctuary-drawer-sub">Orders above Rs. 50,000</p>
                  </div>
                </div>
                <div className="aura-hero-sanctuary-drawer-row">
                  <ShieldCheck className="aura-hero-sanctuary-drawer-icon" />
                  <div>
                    <p className="aura-hero-sanctuary-drawer-title">7-Day Returns</p>
                    <p className="aura-hero-sanctuary-drawer-sub">No questions asked</p>
                  </div>
                </div>
                <Link href="/shop" className="aura-hero-sanctuary-drawer-cta">
                  Complete Purchase
                  <ArrowRight className="aura-hero-sanctuary-drawer-cta-icon" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="aura-hero-sanctuary-fade" />
    </section>
  );
}
