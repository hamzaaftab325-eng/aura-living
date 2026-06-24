'use client';

/**
 * Bento Grid Category Demos — 4 different designs.
 * Visit /bento-demos to see all 4 and pick your favorite.
 */

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const categories = [
  { id: 'lighting', name: 'Lighting', description: 'Elegant lamps & pendant lights', image: '/images/categories/lighting-category.webp' },
  { id: 'plants', name: 'Plants & Pots', description: 'Indoor greenery & planters', image: '/images/categories/plants-category.webp' },
  { id: 'vases', name: 'Vases & Decor', description: 'Artisan ceramics & accents', image: '/images/categories/vases-category.webp' },
  { id: 'candles', name: 'Candles & Fragrance', description: 'Scented candles & holders', image: '/images/categories/candles-category.webp' },
  { id: 'wall-art', name: 'Wall Art & Mirrors', description: 'Framed art & decorative mirrors', image: '/images/categories/wallart-category.webp' },
  { id: 'dining', name: 'Kitchen & Dining', description: 'Tableware & serving pieces', image: '/images/categories/dining-category.webp' },
];

function SectionLabel({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="py-8 px-4 text-center" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2C2C2C 100%)' }}>
      <div className="inline-flex items-center gap-3 mb-3">
        <div style={{ width: 32, height: 1, background: '#D4AF37' }} />
        <span className="text-xs uppercase tracking-[6px] font-bold" style={{ color: '#D4AF37' }}>Bento Demo {number}</span>
        <div style={{ width: 32, height: 1, background: '#D4AF37' }} />
      </div>
      <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h2>
      <p className="text-sm text-white/40">{description}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 1: CLASSIC BENTO — 1 tall + 1 wide + 4 standard
// Asymmetric layout with varied sizes
// ═══════════════════════════════════════════════════════════
function Bento1() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.b1-card', { opacity: 0, y: 50, scale: 0.95 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' }
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div style={{ width: 48, height: 2, background: '#D4AF37' }} />
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Explore</span>
        </div>
        <h2 className="text-4xl font-bold mb-12" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>
          Shop by <span style={{ color: '#D4AF37' }}>Category</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="sm:!grid-cols-4">
          {/* Tall card (spans 2 rows) */}
          <Link href="/shop?category=lighting" className="b1-card group relative overflow-hidden" style={{ gridRow: 'span 2', borderRadius: 20, minHeight: 400 }}>
            <Image src={categories[0].image} alt={categories[0].name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="50vw" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.1) 60%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{categories[0].name}</h3>
              <p className="text-sm text-white/60 mb-3">{categories[0].description}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white" style={{ color: '#D4AF37' }}>
                Shop Now <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          {/* Wide card (spans 2 cols) */}
          <Link href="/shop?category=plants" className="b1-card group relative overflow-hidden" style={{ gridColumn: 'span 2', borderRadius: 20, minHeight: 190 }}>
            <Image src={categories[1].image} alt={categories[1].name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="50vw" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.1) 60%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-lg font-bold text-white mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{categories[1].name}</h3>
              <p className="text-xs text-white/60">{categories[1].description}</p>
            </div>
          </Link>

          {/* Standard cards */}
          {categories.slice(2, 6).map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`} className="b1-card group relative overflow-hidden" style={{ borderRadius: 20, minHeight: 190 }}>
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.1) 60%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-base font-bold text-white mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3>
                <p className="text-[11px] text-white/60">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 2: HOVER REVEAL — cards with sliding overlay panels
// Overlay slides up on hover, revealing full description + CTA
// ═══════════════════════════════════════════════════════════
function Bento2() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.b2-card', { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' }
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#141414' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Explore</span>
          <h2 className="text-4xl font-bold text-white mt-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shop by <span style={{ color: '#D4AF37' }}>Category</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className={`b2-card group relative overflow-hidden ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              style={{ borderRadius: 20, height: 320 }}
            >
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="33vw" />

              {/* Initial overlay (name only) */}
              <div className="absolute inset-0 flex items-end p-6 transition-all duration-500 group-hover:opacity-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3>
              </div>

              {/* Hover panel (slides up from bottom) */}
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full transition-transform duration-500 group-hover:translate-y-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)' }}>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3>
                <p className="text-sm text-white/60 mb-4">{cat.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#D4AF37' }}>
                  Explore Collection <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 3: MOSAIC — varying heights with number labels
// Editorial magazine-style with category numbers
// ═══════════════════════════════════════════════════════════
function Bento3() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.b3-card', { opacity: 0, scale: 0.9 }, {
      opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' }
    });
  }, { scope: ref });

  const heights = [400, 300, 300, 300, 400, 300];

  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 48, height: 2, background: '#D4AF37' }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Explore</span>
            </div>
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>
              Categories
            </h2>
          </div>
          <Link href="/shop" className="text-sm font-medium flex items-center gap-1" style={{ color: '#D4AF37' }}>
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className={`b3-card group relative overflow-hidden ${i === 0 || i === 4 ? 'lg:row-span-2' : ''}`}
              style={{ borderRadius: 16, height: heights[i] }}
            >
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="33vw" />
              <div className="absolute inset-0 transition-all duration-500" style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.8) 0%, transparent 50%)', }} />

              {/* Number badge */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'rgba(212,175,55,0.9)', backdropFilter: 'blur(4px)' }}>
                0{i + 1}
              </div>

              {/* Name */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg font-bold text-white mb-1 transition-transform duration-500 group-hover:translate-x-1" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3>
                <p className="text-xs text-white/50 transition-all duration-500 group-hover:text-white/70">{cat.description}</p>
                <div className="h-0.5 mt-3 transition-all duration-500 group-hover:w-16" style={{ width: 0, background: '#D4AF37' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 4: SPLIT OVERLAY — image visible, gold bar slides on hover
// Minimalist, luxury feel — gold accent bar reveals on hover
// ═══════════════════════════════════════════════════════════
function Bento4() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.b4-card', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 80%' }
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #FAF8F5 0%, #F5EDDA 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <div style={{ width: 32, height: 1, background: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Explore</span>
            <div style={{ width: 32, height: 1, background: '#D4AF37' }} />
          </div>
          <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>
            Curated <span style={{ color: '#D4AF37' }}>Collections</span>
          </h2>
          <p className="text-sm" style={{ color: '#5A5A5A' }}>Handpicked categories for every corner of your home</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="b4-card group relative overflow-hidden"
              style={{ borderRadius: 20, height: 280 }}
            >
              {/* Image */}
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-[800ms] group-hover:scale-105" sizes="33vw" />

              {/* Top gradient (subtle) */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(20,20,20,0.6) 100%)' }} />

              {/* Gold bar (slides from left on hover) */}
              <div className="absolute top-0 left-0 h-1 transition-all duration-500 group-hover:w-full" style={{ width: 0, background: 'linear-gradient(90deg, #D4AF37, #F4D76E)' }} />

              {/* Content (always visible, lifts on hover) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3>
                <p className="text-sm text-white/50 mb-0 group-hover:block transition-all duration-500">{cat.description}</p>
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-xs font-semibold" style={{ color: '#D4AF37' }}>Shop Now</span>
                  <ArrowRight className="w-3 h-3" style={{ color: '#D4AF37' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE — Tabbed
// ═══════════════════════════════════════════════════════════
const tabs = [
  { id: 0, label: 'Classic Bento', desc: '1 tall + 1 wide + 4 standard · asymmetric grid' },
  { id: 1, label: 'Hover Reveal', desc: 'Panel slides up on hover · dark theme' },
  { id: 2, label: 'Mosaic', desc: 'Varying heights · number badges · gold bar reveal' },
  { id: 3, label: 'Split Overlay', desc: 'Gold bar slides from left · content lifts on hover' },
];

export default function BentoDemosPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(14,14,14,0.9)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between gap-2 py-3 overflow-x-auto">
            <span className="text-xs font-bold uppercase tracking-[3px] whitespace-nowrap" style={{ color: '#D4AF37' }}>Bento Demos</span>
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
                  style={{
                    background: activeTab === tab.id ? 'linear-gradient(135deg, #D4AF37, #C9A22E)' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: activeTab === tab.id ? '0 4px 12px rgba(212,175,55,0.3)' : 'none',
                  }}
                >
                  {tab.id + 1}. {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active demo */}
      <div key={activeTab}>
        {activeTab === 0 && <Bento1 />}
        {activeTab === 1 && <Bento2 />}
        {activeTab === 2 && <Bento3 />}
        {activeTab === 3 && <Bento4 />}
      </div>

      {/* Info bar */}
      <div className="py-12 px-4 text-center" style={{ background: '#0e0e0e' }}>
        <p className="text-sm text-white/40 mb-2">{tabs[activeTab].desc}</p>
        <p className="text-xs text-white/30">Viewing Demo {activeTab + 1} of {tabs.length}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <span className="text-xs font-semibold" style={{ color: '#D4AF37' }}>Reply with number {activeTab + 1} if you like this one</span>
        </div>
      </div>
    </div>
  );
}
