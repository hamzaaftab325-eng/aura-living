'use client';

/**
 * Design Demos — Bento Categories + Our Story sections.
 * Tab 1: 4 Bento grid category designs
 * Tab 2: 5 Our Story / Brand Story designs
 * Visit /bento-demos to see all.
 */

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Hammer, Heart, Award, Leaf, Sparkles, Star } from 'lucide-react';
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

const values = [
  { icon: Hammer, title: 'Handcrafted', description: 'Every piece made by skilled Pakistani artisans' },
  { icon: Leaf, title: 'Sustainable', description: 'Ethically sourced materials, eco-friendly practices' },
  { icon: Award, title: 'Premium Quality', description: 'Rigorous quality checks on every product' },
  { icon: Heart, title: 'Made with Love', description: 'Designed in-house, crafted with passion' },
];

// ═══════════════════════════════════════════════════════════
// BENTO DEMOS (same as before — unchanged)
// ═══════════════════════════════════════════════════════════

function SectionLabel({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="py-8 px-4 text-center" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2C2C2C 100%)' }}>
      <div className="inline-flex items-center gap-3 mb-3">
        <div style={{ width: 32, height: 1, background: '#D4AF37' }} />
        <span className="text-xs uppercase tracking-[6px] font-bold" style={{ color: '#D4AF37' }}>Demo {number}</span>
        <div style={{ width: 32, height: 1, background: '#D4AF37' }} />
      </div>
      <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h2>
      <p className="text-sm text-white/40">{description}</p>
    </div>
  );
}

function Bento1() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.b1-card', { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
  }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-3"><div style={{ width: 48, height: 2, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Explore</span></div>
        <h2 className="text-4xl font-bold mb-12" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>Shop by <span style={{ color: '#D4AF37' }}>Category</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }} className="sm:!grid-cols-4">
          <Link href="/shop?category=lighting" className="b1-card group relative overflow-hidden" style={{ gridRow: 'span 2', borderRadius: 20, minHeight: 400 }}>
            <Image src={categories[0].image} alt={categories[0].name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="50vw" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.1) 60%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-6"><h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{categories[0].name}</h3><p className="text-sm text-white/60 mb-3">{categories[0].description}</p><span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#D4AF37' }}>Shop Now <ArrowRight className="w-3 h-3" /></span></div>
          </Link>
          <Link href="/shop?category=plants" className="b1-card group relative overflow-hidden" style={{ gridColumn: 'span 2', borderRadius: 20, minHeight: 190 }}>
            <Image src={categories[1].image} alt={categories[1].name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="50vw" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.1) 60%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-5"><h3 className="text-lg font-bold text-white mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{categories[1].name}</h3><p className="text-xs text-white/60">{categories[1].description}</p></div>
          </Link>
          {categories.slice(2, 6).map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`} className="b1-card group relative overflow-hidden" style={{ borderRadius: 20, minHeight: 190 }}>
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.1) 60%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5"><h3 className="text-base font-bold text-white mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3><p className="text-[11px] text-white/60">{cat.description}</p></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bento2() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.fromTo('.b2-card', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } }); }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#141414' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12"><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Explore</span><h2 className="text-4xl font-bold text-white mt-3" style={{ fontFamily: 'Playfair Display, serif' }}>Shop by <span style={{ color: '#D4AF37' }}>Category</span></h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`} className={`b2-card group relative overflow-hidden ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`} style={{ borderRadius: 20, height: 320 }}>
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="33vw" />
              <div className="absolute inset-0 flex items-end p-6 transition-all duration-500 group-hover:opacity-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }}><h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3></div>
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full transition-transform duration-500 group-hover:translate-y-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)' }}><h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3><p className="text-sm text-white/60 mb-4">{cat.description}</p><span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#D4AF37' }}>Explore Collection <ArrowUpRight className="w-4 h-4" /></span></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bento3() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.fromTo('.b3-card', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } }); }, { scope: ref });
  const heights = [400, 300, 300, 300, 400, 300];
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12"><div><div className="flex items-center gap-3 mb-3"><div style={{ width: 48, height: 2, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Explore</span></div><h2 className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>Categories</h2></div><Link href="/shop" className="text-sm font-medium flex items-center gap-1" style={{ color: '#D4AF37' }}>View All <ArrowRight className="w-4 h-4" /></Link></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`} className={`b3-card group relative overflow-hidden ${i === 0 || i === 4 ? 'lg:row-span-2' : ''}`} style={{ borderRadius: 16, height: heights[i] }}>
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="33vw" />
              <div className="absolute inset-0 transition-all duration-500" style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.8) 0%, transparent 50%)' }} />
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'rgba(212,175,55,0.9)', backdropFilter: 'blur(4px)' }}>0{i + 1}</div>
              <div className="absolute bottom-0 left-0 right-0 p-5"><h3 className="text-lg font-bold text-white mb-1 transition-transform duration-500 group-hover:translate-x-1" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3><p className="text-xs text-white/50 transition-all duration-500 group-hover:text-white/70">{cat.description}</p><div className="h-0.5 mt-3 transition-all duration-500 group-hover:w-16" style={{ width: 0, background: '#D4AF37' }} /></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bento4() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.fromTo('.b4-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } }); }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #FAF8F5 0%, #F5EDDA 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12"><div className="inline-flex items-center gap-3 mb-3"><div style={{ width: 32, height: 1, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Explore</span><div style={{ width: 32, height: 1, background: '#D4AF37' }} /></div><h2 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>Curated <span style={{ color: '#D4AF37' }}>Collections</span></h2><p className="text-sm" style={{ color: '#5A5A5A' }}>Handpicked categories for every corner of your home</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`} className="b4-card group relative overflow-hidden" style={{ borderRadius: 20, height: 280 }}>
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-[800ms] group-hover:scale-105" sizes="33vw" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(20,20,20,0.6) 100%)' }} />
              <div className="absolute top-0 left-0 h-1 transition-all duration-500 group-hover:w-full" style={{ width: 0, background: 'linear-gradient(90deg, #D4AF37, #F4D76E)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500 group-hover:-translate-y-2"><h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{cat.name}</h3><p className="text-sm text-white/50 mb-0 group-hover:block transition-all duration-500">{cat.description}</p><div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"><span className="text-xs font-semibold" style={{ color: '#D4AF37' }}>Shop Now</span><ArrowRight className="w-3 h-3" style={{ color: '#D4AF37' }} /></div></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OUR STORY DEMOS — 5 designs
// ═══════════════════════════════════════════════════════════

// STORY 1: Split Editorial — Image left, text right, floating stat card
function Story1() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.s1-reveal', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
  }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EDDA 100%)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="s1-reveal relative">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
            <Image src="/images/about-workshop.webp" alt="Aura Living workshop" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl shadow-2xl max-w-[220px] hidden sm:block" style={{ background: 'rgba(255,253,247,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>100%</p>
            <p className="text-xs" style={{ color: '#5A5A5A' }}>Handcrafted by skilled artisans across Pakistan</p>
          </div>
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: 'rgba(212,175,55,0.3)' }} />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: 'rgba(212,175,55,0.3)' }} />
        </div>
        <div>
          <div className="s1-reveal flex items-center gap-3 mb-4"><div style={{ width: 48, height: 2, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Our Story</span></div>
          <h2 className="s1-reveal font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, color: '#2C2C2C' }}>Not factory-made.<br /><span style={{ color: '#D4AF37' }}>Hand-made.</span></h2>
          <p className="s1-reveal text-base mb-4" style={{ color: '#5A5A5A', lineHeight: 1.7 }}>We work directly with artisans across Pakistan — brass-workers in Lahore, ceramicists in Sindh, weavers in Punjab. Every lamp, vase, and planter tells a story of traditional craftsmanship meeting modern design.</p>
          <p className="s1-reveal text-base mb-8" style={{ color: '#5A5A5A', lineHeight: 1.7 }}>No mass production. No middlemen. Just beautiful, lasting pieces made with pride — delivered to your doorstep.</p>
          <div className="s1-reveal grid grid-cols-2 gap-4 mb-8">
            {values.map((v) => { const Icon = v.icon; return (
              <div key={v.title} className="flex items-start gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)' }}><Icon className="w-5 h-5" style={{ color: '#D4AF37' }} /></div><div><p className="text-sm font-semibold mb-0.5" style={{ color: '#2C2C2C' }}>{v.title}</p><p className="text-xs" style={{ color: '#5A5A5A' }}>{v.description}</p></div></div>
            ); })}
          </div>
          <Link href="/about" className="s1-reveal inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>Read Full Story <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}

// STORY 2: Full-width Parallax Band — dramatic, immersive
function Story2() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.s2-content', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
    gsap.to('.s2-parallax', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  }, { scope: ref });
  return (
    <div ref={ref} className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="s2-parallax absolute inset-0" style={{ backgroundImage: 'url(/images/about-workshop.webp)', backgroundSize: 'cover', backgroundPosition: 'center', height: '130%' }} />
      <div className="absolute inset-0" style={{ background: 'rgba(14,14,14,0.85)' }} />
      <div className="s2-content relative z-10 max-w-3xl text-center px-4 py-20">
        <div className="flex items-center justify-center gap-3 mb-6"><div style={{ width: 32, height: 1, background: '#D4AF37' }} /><Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Our Story</span><Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} /><div style={{ width: 32, height: 1, background: '#D4AF37' }} /></div>
        <h2 className="font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1.1 }}>Crafted in Pakistan,<br /><span style={{ color: '#E8C547' }}>Loved Worldwide.</span></h2>
        <p className="text-lg mb-4 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>Aura Living was born from a simple belief: that every home deserves pieces with soul. We work directly with artisans across Pakistan to bring you decor that tells a story.</p>
        <p className="text-base mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>Each piece is handcrafted using traditional techniques passed down through generations. No mass production. No compromises.</p>
        <div className="flex flex-col sm:flex-row gap-8 justify-center mb-10">
          {[{ num: '5,000+', label: 'Happy Homes' }, { num: '200+', label: 'Artisans' }, { num: '25+', label: 'Cities Served' }].map(s => (
            <div key={s.label}><p className="text-3xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>{s.num}</p><p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p></div>
          ))}
        </div>
        <Link href="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>Read Full Story <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

// STORY 3: Stacked Cards — overlapping image cards with text
function Story3() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.s3-card', { opacity: 0, y: 80, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
  }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4"><div style={{ width: 32, height: 1, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Our Story</span><div style={{ width: 32, height: 1, background: '#D4AF37' }} /></div>
        <h2 className="font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#2C2C2C' }}>The <span style={{ color: '#D4AF37' }}>Aura</span> Difference</h2>
        <p className="text-base mb-16 max-w-xl mx-auto" style={{ color: '#5A5A5A' }}>Three pillars that make every Aura Living piece special</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: '01', title: 'Artisan Direct', desc: 'We work directly with artisans — no middlemen, no factories. Each maker receives fair wages and recognition for their craft.', img: '/images/products/handpainted-ceramic-lamp-1.webp' },
            { num: '02', title: 'Traditional Craft', desc: 'Techniques passed down through generations — hand-hammered brass, hand-thrown ceramics, hand-blown glass.', img: '/images/products/hammered-brass-table-lamp-1.webp' },
            { num: '03', title: 'Modern Design', desc: 'Every piece is designed in-house, blending traditional craftsmanship with contemporary aesthetics.', img: '/images/products/handblown-glass-vase-amber-1.webp' },
          ].map((item) => (
            <div key={item.num} className="s3-card relative">
              <div className="relative overflow-hidden rounded-2xl mb-6" style={{ aspectRatio: '1' }}>
                <Image src={item.img} alt={item.title} fill className="object-cover" sizes="33vw" />
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'rgba(212,175,55,0.9)', backdropFilter: 'blur(4px)', fontFamily: 'Playfair Display, serif' }}>{item.num}</div>
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#5A5A5A', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// STORY 4: Timeline Strip — horizontal journey
function Story4() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.s4-step', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    gsap.fromTo('.s4-line', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
  }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#141414' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Our Journey</span>
          <h2 className="font-bold text-white mt-3" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>From Workshop to <span style={{ color: '#D4AF37' }}>Your Home</span></h2>
        </div>
        <div className="relative">
          <div className="s4-line absolute top-8 left-0 right-0 h-0.5 origin-left" style={{ background: 'linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.1))' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: 'Design', desc: 'Every piece starts as a sketch in our Lahore studio, blending modern aesthetics with traditional forms.' },
              { step: 'Craft', desc: 'Master artisans handcraft each piece using techniques refined over generations.' },
              { step: 'Inspect', desc: 'Every item is individually inspected for quality — no defects, no compromises.' },
              { step: 'Deliver', desc: 'Carefully packaged and delivered to your doorstep, anywhere in Pakistan.' },
            ].map((item, i) => (
              <div key={item.step} className="s4-step relative pt-16">
                <div className="absolute top-4 left-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#D4AF37', boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
                  <span className="text-xs font-bold text-white">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{item.step}</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// STORY 5: Quote-Driven — big quote, minimal, elegant
function Story5() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.s5-reveal', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
  }, { scope: ref });
  return (
    <div ref={ref} className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #FAF8F5 0%, #F5EDDA 50%, #FAF8F5 100%)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="s5-reveal text-7xl mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37', opacity: 0.2, lineHeight: 1 }}>"</div>
        <blockquote className="s5-reveal font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1.3, color: '#2C2C2C' }}>
          We don&apos;t just sell decor. We share the <span style={{ color: '#D4AF37' }}>soul</span> of Pakistani craftsmanship — one handcrafted piece at a time.
        </blockquote>
        <div className="s5-reveal flex items-center justify-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: '2px solid #D4AF37' }}>
            <Image src="/images/about-workshop.webp" alt="Founder" width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <div className="text-left"><p className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>Aura Living Team</p><p className="text-xs" style={{ color: '#5A5A5A' }}>Lahore, Pakistan</p></div>
        </div>
        <div className="s5-reveal grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
          {values.map((v) => { const Icon = v.icon; return (
            <div key={v.title} className="text-center"><div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(212,175,55,0.1)' }}><Icon className="w-5 h-5" style={{ color: '#D4AF37' }} /></div><p className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{v.title}</p></div>
          ); })}
        </div>
        <Link href="/about" className="s5-reveal inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>Discover More <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE — Dual tabs (Categories + Stories)
// ═══════════════════════════════════════════════════════════
const bentoTabs = [
  { id: 0, label: 'Classic Bento', desc: '1 tall + 1 wide + 4 standard · asymmetric grid' },
  { id: 1, label: 'Hover Reveal', desc: 'Panel slides up on hover · dark theme' },
  { id: 2, label: 'Mosaic', desc: 'Varying heights · number badges · gold bar reveal' },
  { id: 3, label: 'Split Overlay', desc: 'Gold bar slides from left · content lifts on hover' },
];

const storyTabs = [
  { id: 0, label: 'Split Editorial', desc: 'Image left + text right · floating stat card · gold corners' },
  { id: 1, label: 'Parallax Band', desc: 'Full-width parallax bg · centered text · stats row' },
  { id: 2, label: 'Stacked Cards', desc: '3 numbered cards · product images · staggered reveal' },
  { id: 3, label: 'Timeline', desc: 'Horizontal journey · gold line · 4 steps · dark bg' },
  { id: 4, label: 'Quote-Driven', desc: 'Big blockquote · founder avatar · values row · minimal' },
];

export default function BentoDemosPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [demoType, setDemoType] = useState<'bento' | 'story'>('bento');

  const tabs = demoType === 'bento' ? bentoTabs : storyTabs;

  return (
    <div className="w-full">
      {/* Main tab switcher: Bento vs Story */}
      <div className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(14,14,14,0.9)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Type toggle */}
          <div className="flex items-center justify-center gap-2 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <button onClick={() => { setDemoType('bento'); setActiveTab(0); }} className="px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all" style={{ background: demoType === 'bento' ? 'linear-gradient(135deg, #D4AF37, #C9A22E)' : 'transparent', color: demoType === 'bento' ? '#fff' : 'rgba(255,255,255,0.4)' }}>Categories</button>
            <button onClick={() => { setDemoType('story'); setActiveTab(0); }} className="px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all" style={{ background: demoType === 'story' ? 'linear-gradient(135deg, #D4AF37, #C9A22E)' : 'transparent', color: demoType === 'story' ? '#fff' : 'rgba(255,255,255,0.4)' }}>Our Story</button>
          </div>
          {/* Sub-tabs */}
          <div className="flex items-center justify-center gap-2 py-3 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap" style={{ background: activeTab === tab.id ? 'rgba(212,175,55,0.15)' : 'transparent', color: activeTab === tab.id ? '#D4AF37' : 'rgba(255,255,255,0.4)', border: activeTab === tab.id ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                {tab.id + 1}. {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active demo */}
      <div key={`${demoType}-${activeTab}`}>
        {demoType === 'bento' && activeTab === 0 && <Bento1 />}
        {demoType === 'bento' && activeTab === 1 && <Bento2 />}
        {demoType === 'bento' && activeTab === 2 && <Bento3 />}
        {demoType === 'bento' && activeTab === 3 && <Bento4 />}
        {demoType === 'story' && activeTab === 0 && <Story1 />}
        {demoType === 'story' && activeTab === 1 && <Story2 />}
        {demoType === 'story' && activeTab === 2 && <Story3 />}
        {demoType === 'story' && activeTab === 3 && <Story4 />}
        {demoType === 'story' && activeTab === 4 && <Story5 />}
      </div>

      {/* Info bar */}
      <div className="py-12 px-4 text-center" style={{ background: '#0e0e0e' }}>
        <p className="text-sm text-white/40 mb-2">{tabs[activeTab]?.desc}</p>
        <p className="text-xs text-white/30">Viewing {demoType === 'bento' ? 'Bento' : 'Story'} Demo {activeTab + 1} of {tabs.length}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <span className="text-xs font-semibold" style={{ color: '#D4AF37' }}>Reply with number {activeTab + 1} if you like this one</span>
        </div>
      </div>
    </div>
  );
}
