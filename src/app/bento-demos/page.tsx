'use client';

/**
 * Design Demos v3 — All homepage section demos.
 * Categories (4) · Our Story (5) · Products (5) · CTA (5) · Trust (5) · Newsletter (5)
 * Visit /bento-demos
 */

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Hammer, Heart, Award, Leaf, Sparkles, Star, Truck, Banknote, ShieldCheck, Play, Search, ShoppingCart, ShoppingBag, User, ChevronDown, Instagram, Facebook, Twitter } from 'lucide-react';
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

const products = [
  { name: 'Hammered Brass Table Lamp', price: 9999, image: '/images/products/hammered-brass-table-lamp-1.webp', badge: 'NEW' },
  { name: 'Smoked Glass Pendant Light', price: 14499, image: '/images/products/smoked-glass-pendant-light-1.webp', badge: 'BESTSELLER' },
  { name: 'Crystal Drop Chandelier', price: 24999, originalPrice: 29999, image: '/images/products/crystal-drop-chandelier-1.webp', badge: 'SALE' },
  { name: 'Hand-Blown Glass Vase', price: 4499, image: '/images/products/handblown-glass-vase-amber-1.webp' },
  { name: 'Concrete Geometric Planter', price: 3999, image: '/images/products/concrete-geometric-planter-1.webp' },
  { name: 'Industrial Wall Sconce', price: 6499, image: '/images/products/industrial-wall-sconce-1.webp', badge: 'NEW' },
  { name: 'Hand-Painted Ceramic Lamp', price: 7999, image: '/images/products/handpainted-ceramic-lamp-1.webp' },
  { name: 'Marble Coaster Set Gold', price: 2999, image: '/images/products/marble-coaster-set-gold-1.webp' },
];

const values = [
  { icon: Hammer, title: 'Handcrafted' },
  { icon: Leaf, title: 'Sustainable' },
  { icon: Award, title: 'Premium Quality' },
  { icon: Heart, title: 'Made with Love' },
];

const fmt = (n: number) => `Rs. ${n.toLocaleString('en-PK')}`;

// ═══════════════════════════════════════════════════════════
// BENTO DEMOS (4 — unchanged)
// ═══════════════════════════════════════════════════════════

function Bento1() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.fromTo('.b1-card', { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } }); }, { scope: ref });
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
// STORY DEMOS (5 — unchanged from v2)
// ═══════════════════════════════════════════════════════════

function Story1() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
    tl.fromTo('.s1-img-wrap', { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.out' });
    tl.fromTo('.s1-word', { opacity: 0, y: 50, rotateX: -80 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.6');
    tl.fromTo('.s1-para', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, '-=0.4');
    tl.fromTo('.s1-value', { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' }, '-=0.2');
    tl.fromTo('.s1-stat-card', { opacity: 0, x: 60, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.5');
    tl.fromTo('.s1-corner', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.4');
    tl.fromTo('.s1-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
    const counter = ref.current?.querySelector('.s1-counter');
    if (counter) { gsap.to(counter, { textContent: 100, duration: 2, ease: 'power2.out', snap: { textContent: 1 }, onUpdate: () => { counter.textContent = Math.round(parseFloat(counter.textContent || '0')) + '%'; }, scrollTrigger: { trigger: counter, start: 'top 85%', once: true } }); }
    gsap.to('.s1-stat-card', { y: '+=10', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
  }, { scope: ref });
  const words = ['Not', 'factory-made.', 'Hand-made.'];
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EDDA 100%)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative">
          <div className="s1-img-wrap relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/5' }}><Image src="/images/about-workshop.webp" alt="Aura Living workshop" fill className="object-cover" sizes="50vw" /></div>
          <div className="s1-stat-card absolute -bottom-6 -right-6 p-6 rounded-2xl shadow-2xl max-w-[220px] hidden sm:block" style={{ background: 'rgba(255,253,247,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(212,175,55,0.2)' }}><p className="s1-counter text-4xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>0%</p><p className="text-xs" style={{ color: '#5A5A5A' }}>Handcrafted by skilled artisans across Pakistan</p></div>
          <div className="s1-corner absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: 'rgba(212,175,55,0.3)' }} />
          <div className="s1-corner absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: 'rgba(212,175,55,0.3)' }} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4"><div style={{ width: 48, height: 2, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Our Story</span></div>
          <h2 className="font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, color: '#2C2C2C', perspective: '800px' }}>{words.map((w, i) => <span key={i} className="s1-word inline-block mr-3" style={{ color: i === 2 ? '#D4AF37' : '#2C2C2C' }}>{w}</span>)}</h2>
          <p className="s1-para text-base mb-4" style={{ color: '#5A5A5A', lineHeight: 1.7 }}>We work directly with artisans across Pakistan — brass-workers in Lahore, ceramicists in Sindh, weavers in Punjab. Every lamp, vase, and planter tells a story of traditional craftsmanship meeting modern design.</p>
          <p className="s1-para text-base mb-8" style={{ color: '#5A5A5A', lineHeight: 1.7 }}>No mass production. No middlemen. Just beautiful, lasting pieces made with pride — delivered to your doorstep.</p>
          <div className="grid grid-cols-2 gap-4 mb-8">{values.map((v) => { const Icon = v.icon; return (<div key={v.title} className="s1-value flex items-start gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)' }}><Icon className="w-5 h-5" style={{ color: '#D4AF37' }} /></div><div><p className="text-sm font-semibold mb-0.5" style={{ color: '#2C2C2C' }}>{v.title}</p><p className="text-xs" style={{ color: '#5A5A5A' }}>Crafted with care</p></div></div>); })}</div>
          <Link href="/about" className="s1-cta inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>Read Full Story <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}

function Story2() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to('.s2-parallax', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 65%' } });
    tl.fromTo('.s2-mask', { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' }).fromTo('.s2-fade', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.5').fromTo('.s2-stat', { opacity: 0, scale: 0.7, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.3').fromTo('.s2-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
    gsap.utils.toArray<HTMLElement>('.s2-stat').forEach((s, i) => gsap.to(s, { y: '+=8', duration: 2 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 }));
    const container = ref.current?.querySelector('.s2-particles');
    if (container) { for (let i = 0; i < 20; i++) { const p = document.createElement('div'); p.style.cssText = `position:absolute;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;border-radius:50%;background:rgba(212,175,55,${0.3+Math.random()*0.4});pointer-events:none;`; container.appendChild(p); gsap.set(p, { x: Math.random() * (window.innerWidth || 1200), y: Math.random() * 600 }); gsap.to(p, { y: `-=${150+Math.random()*200}`, opacity: 0, duration: 4+Math.random()*4, repeat: -1, delay: Math.random()*5, ease: 'none', onRepeat: () => gsap.set(p, { y: 600, opacity: 0.6, x: Math.random() * (window.innerWidth || 1200) }) }); } }
  }, { scope: ref });
  return (
    <div ref={ref} className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="s2-parallax absolute inset-0" style={{ backgroundImage: 'url(/images/about-workshop.webp)', backgroundSize: 'cover', backgroundPosition: 'center', height: '130%' }} />
      <div className="absolute inset-0" style={{ background: 'rgba(10,10,12,0.88)' }} />
      <div className="s2-particles absolute inset-0 pointer-events-none" />
      <div className="relative z-10 max-w-3xl text-center px-4 py-20">
        <div className="s2-fade flex items-center justify-center gap-3 mb-6"><div style={{ width: 32, height: 1, background: '#D4AF37' }} /><Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Our Story</span><Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} /><div style={{ width: 32, height: 1, background: '#D4AF37' }} /></div>
        <h2 className="font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1.1 }}><span className="block overflow-hidden"><span className="s2-mask block">Crafted in Pakistan,</span></span><span className="block overflow-hidden"><span className="s2-mask block italic" style={{ color: '#E8C547' }}>Loved Worldwide.</span></span></h2>
        <p className="s2-fade text-lg mb-4 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>Aura Living was born from a simple belief: that every home deserves pieces with soul. We work directly with artisans across Pakistan to bring you decor that tells a story.</p>
        <p className="s2-fade text-base mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>Each piece is handcrafted using traditional techniques passed down through generations. No mass production. No compromises.</p>
        <div className="flex flex-col sm:flex-row gap-8 justify-center mb-10">{[{ num: '5,000+', label: 'Happy Homes' }, { num: '200+', label: 'Artisans' }, { num: '25+', label: 'Cities Served' }].map(s => (<div key={s.label} className="s2-stat"><p className="text-3xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>{s.num}</p><p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</p></div>))}</div>
        <Link href="/about" className="s2-cta inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>Read Full Story <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

function Story3() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 65%' } }); tl.fromTo('.s3-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }); tl.fromTo('.s3-card', { opacity: 0, y: 80, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, '-=0.4'); tl.fromTo('.s3-card-img', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, stagger: 0.15, ease: 'power4.out' }, '-=0.6'); tl.fromTo('.s3-badge', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.4'); tl.fromTo('.s3-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' }, '-=0.3'); }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-5xl mx-auto text-center">
        <div className="s3-header flex items-center justify-center gap-3 mb-4"><div style={{ width: 32, height: 1, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Our Story</span><div style={{ width: 32, height: 1, background: '#D4AF37' }} /></div>
        <h2 className="s3-header font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#2C2C2C' }}>The <span style={{ color: '#D4AF37' }}>Aura</span> Difference</h2>
        <p className="s3-header text-base mb-16 max-w-xl mx-auto" style={{ color: '#5A5A5A' }}>Three pillars that make every Aura Living piece special</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{ num: '01', title: 'Artisan Direct', desc: 'We work directly with artisans — no middlemen, no factories. Each maker receives fair wages and recognition for their craft.', img: '/images/products/handpainted-ceramic-lamp-1.webp' }, { num: '02', title: 'Traditional Craft', desc: 'Techniques passed down through generations — hand-hammered brass, hand-thrown ceramics, hand-blown glass.', img: '/images/products/hammered-brass-table-lamp-1.webp' }, { num: '03', title: 'Modern Design', desc: 'Every piece is designed in-house, blending traditional craftsmanship with contemporary aesthetics.', img: '/images/products/handblown-glass-vase-amber-1.webp' }].map((item) => (
            <div key={item.num} className="s3-card"><div className="relative overflow-hidden rounded-2xl mb-6" style={{ aspectRatio: '1' }}><div className="s3-card-img absolute inset-0"><Image src={item.img} alt={item.title} fill className="object-cover" sizes="33vw" /></div><div className="s3-badge absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'rgba(212,175,55,0.95)', backdropFilter: 'blur(4px)', fontFamily: 'Playfair Display, serif', zIndex: 2 }}>{item.num}</div></div><div className="s3-text"><h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>{item.title}</h3><p className="text-sm" style={{ color: '#5A5A5A', lineHeight: 1.6 }}>{item.desc}</p></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Story4() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 65%' } }); tl.fromTo('.s4-header', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }); tl.fromTo('.s4-line', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power2.out' }, '-=0.3'); tl.fromTo('.s4-step', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, '-=0.8'); tl.fromTo('.s4-circle', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.5, stagger: 0.2, ease: 'back.out(1.7)' }, '-=0.6'); gsap.utils.toArray<HTMLElement>('.s4-circle').forEach((c) => { gsap.to(c, { boxShadow: '0 0 30px rgba(212,175,55,0.5)', duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 }); }); }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#141414' }}>
      <div className="max-w-6xl mx-auto">
        <div className="s4-header text-center mb-16"><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Our Journey</span><h2 className="font-bold text-white mt-3" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>From Workshop to <span style={{ color: '#D4AF37' }}>Your Home</span></h2></div>
        <div className="relative"><div className="s4-line absolute top-8 left-0 right-0 h-0.5 origin-left" style={{ background: 'linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.1))' }} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">{[{ step: 'Design', desc: 'Every piece starts as a sketch in our Lahore studio, blending modern aesthetics with traditional forms.' }, { step: 'Craft', desc: 'Master artisans handcraft each piece using techniques refined over generations.' }, { step: 'Inspect', desc: 'Every item is individually inspected for quality — no defects, no compromises.' }, { step: 'Deliver', desc: 'Carefully packaged and delivered to your doorstep, anywhere in Pakistan.' }].map((item, i) => (<div key={item.step} className="s4-step relative pt-16"><div className="s4-circle absolute top-4 left-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#D4AF37', boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}><span className="text-xs font-bold text-white">{i + 1}</span></div><h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{item.step}</h3><p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.desc}</p></div>))}</div></div>
      </div>
    </div>
  );
}

function Story5() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 65%' } }); tl.fromTo('.s5-quote-mark', { scale: 0, rotation: -45, opacity: 0 }, { scale: 1, rotation: 0, opacity: 0.2, duration: 0.8, ease: 'back.out(1.5)' }); tl.fromTo('.s5-mask', { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out' }, '-=0.3'); tl.fromTo('.s5-author', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4'); tl.fromTo('.s5-value', { opacity: 0, scale: 0.7, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' }, '-=0.2'); tl.fromTo('.s5-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2'); gsap.to('.s5-bg', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 } }); }, { scope: ref });
  const quoteWords = ["We", "don't", "just", "sell", "decor.", "We", "share", "the", "soul", "of", "Pakistani", "craftsmanship", "—", "one", "handcrafted", "piece", "at", "a", "time."];
  return (
    <div ref={ref} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: 'linear-gradient(180deg, #FAF8F5 0%, #F5EDDA 50%, #FAF8F5 100%)' }}>
      <div className="s5-bg absolute inset-0 opacity-5" style={{ backgroundImage: 'url(/images/about-workshop.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="s5-quote-mark text-7xl mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37', lineHeight: 1 }}>"</div>
        <blockquote className="font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1.3, color: '#2C2C2C' }}>{quoteWords.map((w, i) => (<span key={i} className="inline-block overflow-hidden mr-2"><span className="s5-mask inline-block" style={{ color: w === 'soul' ? '#D4AF37' : '#2C2C2C' }}>{w}</span></span>))}</blockquote>
        <div className="s5-author flex items-center justify-center gap-4 mb-12"><div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: '2px solid #D4AF37' }}><Image src="/images/about-workshop.webp" alt="Founder" width={48} height={48} className="w-full h-full object-cover" /></div><div className="text-left"><p className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>Aura Living Team</p><p className="text-xs" style={{ color: '#5A5A5A' }}>Lahore, Pakistan</p></div></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">{values.map((v) => { const Icon = v.icon; return (<div key={v.title} className="s5-value text-center"><div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(212,175,55,0.1)' }}><Icon className="w-5 h-5" style={{ color: '#D4AF37' }} /></div><p className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{v.title}</p></div>); })}</div>
        <Link href="/about" className="s5-cta inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>Discover More <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PRODUCT SHOWCASE DEMOS (5) — 10/10 with advanced animations
// ═══════════════════════════════════════════════════════════

function Products1() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.p1-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    tl.fromTo('.p1-card', { opacity: 0, y: 80, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, '-=0.3');
    tl.fromTo('.p1-card-img', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, stagger: 0.08, ease: 'power4.out' }, '-=0.5');
    tl.fromTo('.p1-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto">
        <div className="p1-header text-center mb-12"><div className="inline-flex items-center gap-3 mb-3"><div style={{ width: 32, height: 1, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Featured</span><div style={{ width: 32, height: 1, background: '#D4AF37' }} /></div><h2 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>Curated <span style={{ color: '#D4AF37' }}>Favorites</span></h2><p className="text-sm" style={{ color: '#5A5A5A' }}>Our most-loved pieces, handpicked for your home</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((p) => (
            <Link key={p.name} href="/shop" className="p1-card group relative overflow-hidden rounded-2xl" style={{ background: '#FFFDF7', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', transition: 'transform 0.5s ease, box-shadow 0.5s ease' }}>
              <div className="relative overflow-hidden rounded-t-2xl" style={{ aspectRatio: '4/5' }}>
                <div className="p1-card-img absolute inset-0"><Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" /></div>
                {p.badge && <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white z-10" style={{ background: p.badge === 'SALE' ? '#D4AF37' : '#2C2C2C', color: p.badge === 'SALE' ? '#fff' : '#D4AF37' }}>{p.badge}</span>}
                <div className="absolute bottom-3 left-3 right-3 py-2 px-4 rounded-full text-center text-xs font-semibold text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400" style={{ background: 'rgba(212,175,55,0.95)', backdropFilter: 'blur(4px)' }}>Quick Add</div>
              </div>
              <div className="p-4 sm:p-5"><p className="text-sm font-medium mb-1 truncate" style={{ color: '#2C2C2C' }}>{p.name}</p><div><span className="text-base font-bold" style={{ color: '#D4AF37' }}>{fmt(p.price)}</span>{p.originalPrice && <span className="text-xs ml-2 line-through" style={{ color: '#8A8A8A' }}>{fmt(p.originalPrice)}</span>}</div></div>
            </Link>
          ))}
        </div>
        <div className="p1-cta text-center mt-12"><Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>View All Products <ArrowRight className="w-4 h-4" /></Link></div>
      </div>
    </div>
  );
}

function Products2() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.p2-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    tl.fromTo('.p2-card', { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.1)' }, '-=0.3');
    tl.fromTo('.p2-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#141414' }}>
      <div className="max-w-7xl mx-auto">
        <div className="p2-header text-center mb-12"><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Featured</span><h2 className="text-4xl font-bold text-white mt-3 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Curated <span style={{ color: '#D4AF37' }}>Favorites</span></h2><p className="text-sm text-white/40">Our most-loved pieces, handpicked for your home</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((p) => (
            <Link key={p.name} href="/shop" className="p2-card group relative overflow-hidden rounded-2xl" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.1)', transition: 'transform 0.4s ease, border-color 0.4s ease' }}>
              <div className="relative overflow-hidden rounded-t-2xl" style={{ aspectRatio: '4/5' }}><Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />{p.badge && <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white z-10" style={{ background: '#D4AF37' }}>{p.badge}</span>}<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%)' }} /></div>
              <div className="p-4 sm:p-5"><p className="text-sm font-medium text-white mb-1 truncate">{p.name}</p><div><span className="text-base font-bold" style={{ color: '#D4AF37' }}>{fmt(p.price)}</span>{p.originalPrice && <span className="text-xs ml-2 line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>{fmt(p.originalPrice)}</span>}</div></div>
            </Link>
          ))}
        </div>
        <div className="p2-cta text-center mt-12"><Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ border: '1px solid #D4AF37', color: '#D4AF37' }}>View All Products <ArrowRight className="w-4 h-4" /></Link></div>
      </div>
    </div>
  );
}

function Products3() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.p3-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    tl.fromTo('.p3-card', { opacity: 0, y: 60, rotateX: -20 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #FAF8F5 0%, #F5EDDA 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="p3-header flex items-end justify-between mb-12"><div><div className="flex items-center gap-3 mb-3"><div style={{ width: 48, height: 2, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#D4AF37' }}>Featured</span></div><h2 className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>Curated <span style={{ color: '#D4AF37' }}>Favorites</span></h2></div><Link href="/shop" className="text-sm font-medium flex items-center gap-1" style={{ color: '#D4AF37' }}>View All <ArrowRight className="w-4 h-4" /></Link></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: '1000px' }}>
          {products.slice(0, 8).map((p) => (
            <Link key={p.name} href="/shop" className="p3-card group" style={{ transition: 'transform 0.3s ease' }}>
              <div className="relative overflow-hidden rounded-2xl mb-4" style={{ aspectRatio: '1', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}><Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />{p.badge && <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: p.badge === 'SALE' ? '#D4AF37' : '#2C2C2C', color: p.badge === 'SALE' ? '#fff' : '#D4AF37' }}>{p.badge}</span>}</div>
              <p className="text-sm font-medium mb-1 truncate" style={{ color: '#2C2C2C' }}>{p.name}</p><div><span className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>{fmt(p.price)}</span>{p.originalPrice && <span className="text-xs ml-2 line-through" style={{ color: '#8A8A8A' }}>{fmt(p.originalPrice)}</span>}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Products4() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.p4-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    tl.fromTo('.p4-card', { opacity: 0, y: 80, clipPath: 'inset(100% 0% 0% 0%)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, stagger: 0.12, ease: 'power4.out' }, '-=0.3');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-7xl mx-auto">
        <div className="p4-header text-center mb-12"><div className="inline-flex items-center gap-3 mb-3"><div style={{ width: 32, height: 1, background: '#D4AF37' }} /><Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Featured</span><Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} /><div style={{ width: 32, height: 1, background: '#D4AF37' }} /></div><h2 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>Curated <span style={{ color: '#D4AF37' }}>Favorites</span></h2></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((p) => (
            <Link key={p.name} href="/shop" className="p4-card group relative overflow-hidden rounded-2xl" style={{ background: '#FFFDF7', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}><Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />{p.badge && <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white" style={{ background: p.badge === 'SALE' ? '#D4AF37' : '#2C2C2C', color: p.badge === 'SALE' ? '#fff' : '#D4AF37' }}>{p.badge}</span>}<div className="absolute bottom-3 left-3 right-3 py-2 px-4 rounded-full text-center text-xs font-semibold text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400" style={{ background: 'rgba(212,175,55,0.95)', backdropFilter: 'blur(4px)' }}>Quick Add</div></div>
              <div className="p-4 sm:p-5"><p className="text-sm font-medium mb-1 truncate" style={{ color: '#2C2C2C' }}>{p.name}</p><div><span className="text-base font-bold" style={{ color: '#D4AF37' }}>{fmt(p.price)}</span>{p.originalPrice && <span className="text-xs ml-2 line-through" style={{ color: '#8A8A8A' }}>{fmt(p.originalPrice)}</span>}</div></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Products5() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.p5-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    tl.fromTo('.p5-card', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#141414' }}>
      <div className="max-w-6xl mx-auto">
        <div className="p5-header text-center mb-12"><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Featured</span><h2 className="text-4xl font-bold text-white mt-3" style={{ fontFamily: 'Playfair Display, serif' }}>Curated <span style={{ color: '#D4AF37' }}>Favorites</span></h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((p) => (
            <Link key={p.name} href="/shop" className="p5-card group flex gap-4 p-4 rounded-2xl" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.08)', transition: 'border-color 0.3s ease' }}>
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"><Image src={p.image} alt={p.name} fill className="object-cover" sizes="80px" /></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white mb-1 truncate">{p.name}</p>{p.badge && <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide text-white" style={{ background: '#D4AF37' }}>{p.badge}</span>}<p className="text-lg font-bold mt-1" style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>{fmt(p.price)}</p></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CTA DEMOS (5) — 10/10 with parallax, masks, particles
// ═══════════════════════════════════════════════════════════

function CTA1() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
    tl.fromTo('.c1-icon', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.5)' });
    tl.fromTo('.c1-mask', { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' }, '-=0.3');
    tl.fromTo('.c1-fade', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.5');
    gsap.to('.c1-bg', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  }, { scope: ref });
  return (
    <div ref={ref} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="c1-bg absolute inset-0" style={{ backgroundImage: 'url(/images/hero/hero-slide-3.webp)', backgroundSize: 'cover', backgroundPosition: 'center', height: '130%' }} />
      <div className="absolute inset-0" style={{ background: 'rgba(10,10,12,0.82)' }} />
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <div className="c1-icon w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(212,175,55,0.15)', backdropFilter: 'blur(8px)' }}><Sparkles className="w-8 h-8" style={{ color: '#D4AF37' }} /></div>
        <h2 className="font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 6vw, 4rem)', lineHeight: 1, textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}><span className="block overflow-hidden"><span className="c1-mask block">Ready to Transform</span></span><span className="block overflow-hidden"><span className="c1-mask block italic" style={{ color: '#E8C547' }}>Your Home?</span></span></h2>
        <p className="c1-fade text-lg text-white/60 mb-10 max-w-md mx-auto">Join 5,000+ Pakistani homes that chose Aura Living for their decor.</p>
        <Link href="/shop" className="c1-fade inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 32px rgba(212,175,55,0.35)' }}>Start Shopping <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

function CTA2() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
    tl.fromTo('.c2-word', { opacity: 0, y: 50, rotateX: -80 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    tl.fromTo('.c2-fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref });
  const words = ['Your', 'Dream', 'Home', 'Starts', 'Here'];
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)' }}>
      <div className="max-w-4xl mx-auto text-center" style={{ perspective: '800px' }}>
        <h2 className="font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>{words.map((w, i) => <span key={i} className="c2-word inline-block mr-3">{w}</span>)}</h2>
        <p className="c2-fade text-lg text-white/70 mb-10 max-w-md mx-auto">Explore our full collection of handcrafted decor, delivered to your door.</p>
        <Link href="/shop" className="c2-fade inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: '#fff', color: '#D4AF37', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>Browse Collection <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

function CTA3() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
    tl.fromTo('.c3-left', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
    tl.fromTo('.c3-img', { opacity: 0, scale: 0.9, clipPath: 'inset(0% 0% 0% 100%)' }, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, stagger: 0.1, ease: 'power4.out' }, '-=0.4');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#141414' }}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="c3-left"><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Ready?</span><h2 className="font-bold text-white mt-3 mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>Let&apos;s Find Your<br /><span style={{ color: '#D4AF37' }}>Perfect Piece</span></h2><p className="text-white/50 mb-8">Browse 45+ handcrafted products across 6 categories. Free shipping above Rs. 10,000.</p><Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff' }}>Shop Now <ArrowRight className="w-4 h-4" /></Link></div>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((p) => (<div key={p.name} className="c3-img relative rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}><Image src={p.image} alt={p.name} fill className="object-cover" sizes="25vw" /><div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%)' }} /><p className="absolute bottom-2 left-2 text-xs font-medium text-white truncate max-w-[90%]">{p.name}</p></div>))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CTA4() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
    tl.fromTo('.c4-word', { opacity: 0, y: 50, rotateX: -80 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    tl.fromTo('.c4-fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref });
  const words = ['Transform', 'Your', 'Space.'];
  return (
    <div ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 text-center" style={{ background: 'linear-gradient(180deg, #FAF8F5 0%, #F5EDDA 50%, #FAF8F5 100%)' }}>
      <div className="max-w-3xl mx-auto" style={{ perspective: '800px' }}>
        <h2 className="font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 1, color: '#2C2C2C' }}>{words.map((w, i) => <span key={i} className="c4-word inline-block mr-3" style={{ color: i === 2 ? '#D4AF37' : '#2C2C2C' }}>{w}</span>)}</h2>
        <p className="c4-fade text-lg mb-10" style={{ color: '#5A5A5A' }}>Premium handcrafted decor, delivered across Pakistan.</p>
        <Link href="/shop" className="c4-fade inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 32px rgba(212,175,55,0.35)' }}>Explore Collection <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );
}

function CTA5() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
    tl.fromTo('.c5-icon', { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.5)' });
    tl.fromTo('.c5-mask', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.3');
    tl.fromTo('.c5-fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl" style={{ background: '#FFFDF7', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="c5-icon w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(212,175,55,0.1)' }}><Sparkles className="w-8 h-8" style={{ color: '#D4AF37' }} /></div>
        <h2 className="font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#2C2C2C' }}><span className="block overflow-hidden"><span className="c5-mask block">Begin Your</span></span><span className="block overflow-hidden"><span className="c5-mask block" style={{ color: '#D4AF37' }}>Decor Journey</span></span></h2>
        <p className="c5-fade text-base mb-8 max-w-md mx-auto" style={{ color: '#5A5A5A' }}>Discover handcrafted pieces that tell your story. Free shipping on orders above Rs. 10,000.</p>
        <div className="c5-fade flex flex-col sm:flex-row gap-3 justify-center"><Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>Shop Now <ArrowRight className="w-4 h-4" /></Link><Link href="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:bg-[#D4AF37]/10 border" style={{ borderColor: '#D4AF37', color: '#B8941F' }}>Learn More</Link></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TRUST BADGES DEMOS (5) — 10/10 with stagger, glow, back ease
// ═══════════════════════════════════════════════════════════

const badges = [
  { icon: Truck, title: 'Free Shipping', desc: 'Orders above Rs. 10,000' },
  { icon: Banknote, title: 'Cash on Delivery', desc: 'Pay when it arrives' },
  { icon: ShieldCheck, title: '7-Day Returns', desc: 'Easy & hassle-free' },
  { icon: Star, title: '4.8/5 Rating', desc: 'From 2,000+ reviews' },
];

function Trust1() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.t1-badge', { opacity: 0, y: 40, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: ref.current, start: 'top 80%' } });
    gsap.utils.toArray<HTMLElement>('.t1-icon').forEach((el) => {
      gsap.to(el, { boxShadow: '0 0 20px rgba(212,175,55,0.2)', duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
    });
  }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-5xl mx-auto"><div className="grid grid-cols-2 lg:grid-cols-4 gap-8">{badges.map((b) => { const Icon = b.icon; return (<div key={b.title} className="t1-badge text-center"><div className="t1-icon w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(212,175,55,0.1)' }}><Icon className="w-6 h-6" style={{ color: '#D4AF37' }} /></div><h3 className="text-sm font-semibold mb-1" style={{ color: '#2C2C2C' }}>{b.title}</h3><p className="text-xs" style={{ color: '#5A5A5A' }}>{b.desc}</p></div>); })}</div></div>
    </div>
  );
}

function Trust2() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.fromTo('.t2-badge', { opacity: 0, scale: 0.8, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', scrollTrigger: { trigger: ref.current, start: 'top 80%' } }); }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#141414' }}>
      <div className="max-w-5xl mx-auto"><div className="grid grid-cols-2 lg:grid-cols-4 gap-6">{badges.map((b) => { const Icon = b.icon; return (<div key={b.title} className="t2-badge p-6 rounded-2xl text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.1)', transition: 'border-color 0.3s ease' }}><div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(212,175,55,0.1)' }}><Icon className="w-5 h-5" style={{ color: '#D4AF37' }} /></div><h3 className="text-sm font-semibold text-white mb-1">{b.title}</h3><p className="text-xs text-white/40">{b.desc}</p></div>); })}</div></div>
    </div>
  );
}

function Trust3() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.fromTo('.t3-badge', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } }); }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EDDA 100%)' }}>
      <div className="max-w-4xl mx-auto space-y-4">{badges.map((b) => { const Icon = b.icon; return (<div key={b.title} className="t3-badge flex items-center gap-4 p-5 rounded-2xl" style={{ background: '#FFFDF7', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}><div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)' }}><Icon className="w-5 h-5" style={{ color: '#D4AF37' }} /></div><div><h3 className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{b.title}</h3><p className="text-xs" style={{ color: '#5A5A5A' }}>{b.desc}</p></div><div className="ml-auto w-8 h-px" style={{ background: '#D4AF37' }} /></div>); })}</div>
    </div>
  );
}

function Trust4() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.fromTo('.t4-badge', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.3)', scrollTrigger: { trigger: ref.current, start: 'top 80%' } }); }, { scope: ref });
  return (
    <div ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">{badges.map((b) => { const Icon = b.icon; return (<div key={b.title} className="t4-badge p-6 rounded-2xl text-center transition-all hover:-translate-y-1" style={{ background: '#FFFDF7', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid rgba(212,175,55,0.08)' }}><Icon className="w-7 h-7 mx-auto mb-3" style={{ color: '#D4AF37' }} /><h3 className="text-sm font-semibold mb-1" style={{ color: '#2C2C2C' }}>{b.title}</h3><p className="text-xs" style={{ color: '#5A5A5A' }}>{b.desc}</p></div>); })}</div>
    </div>
  );
}

function Trust5() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const track = ref.current?.querySelector('.t5-track');
    if (track) { gsap.to(track, { x: '-50%', duration: 20, repeat: -1, ease: 'none' }); }
    gsap.fromTo('.t5-item', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%' } });
  }, { scope: ref });
  const items = [...badges, ...badges, ...badges];
  return (
    <div ref={ref} className="py-10 overflow-hidden" style={{ background: '#141414' }}>
      <div className="t5-track flex gap-8 whitespace-nowrap" style={{ width: 'max-content' }}>
        {items.map((b, i) => { const Icon = b.icon; return (
          <div key={i} className="t5-item flex items-center gap-3 flex-shrink-0">
            <Icon className="w-5 h-5" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-medium text-white/70">{b.title}</span>
            <span className="text-white/20">·</span>
          </div>
        ); })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NEWSLETTER DEMOS (5) — 10/10 with text reveals, glassmorphism
// ═══════════════════════════════════════════════════════════

function Newsletter1() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.n1-line', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.out' });
    tl.fromTo('.n1-mask', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: 'power4.out' }, '-=0.3');
    tl.fromTo('.n1-fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, #FAF8F5 0%, #F5EDDA 100%)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4"><div className="n1-line w-8 h-px origin-left" style={{ background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Stay Connected</span><div className="n1-line w-8 h-px origin-right" style={{ background: '#D4AF37' }} /></div>
        <h2 className="font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#2C2C2C' }}><span className="block overflow-hidden"><span className="n1-mask block">Join the</span></span><span className="block overflow-hidden"><span className="n1-mask block" style={{ color: '#D4AF37' }}>Aura Family</span></span></h2>
        <p className="n1-fade text-base mb-8 max-w-md mx-auto" style={{ color: '#5A5A5A' }}>Get 10% off your first order, plus early access to new arrivals.</p>
        <form className="n1-fade flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="your@email.com" required className="flex-1 px-4 py-3 rounded-full text-sm outline-none" style={{ border: '1.5px solid rgba(212,175,55,0.2)', background: '#FFFDF7' }} /><button type="submit" className="px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}>Subscribe</button></form>
        <p className="n1-fade text-xs mt-4" style={{ color: '#8A8A8A' }}>No spam, unsubscribe anytime.</p>
      </div>
    </div>
  );
}

function Newsletter2() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.n2-icon', { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.5)' });
    tl.fromTo('.n2-mask', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: 'power4.out' }, '-=0.3');
    tl.fromTo('.n2-fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#141414' }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="n2-icon w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(212,175,55,0.1)' }}><Sparkles className="w-8 h-8" style={{ color: '#D4AF37' }} /></div>
        <h2 className="font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)' }}><span className="block overflow-hidden"><span className="n2-mask block">Get</span></span><span className="block overflow-hidden"><span className="n2-mask block" style={{ color: '#D4AF37' }}>10% Off</span></span></h2>
        <p className="n2-fade text-white/50 mb-8 max-w-md mx-auto">Subscribe to our newsletter for exclusive offers and new arrivals.</p>
        <form className="n2-fade flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="your@email.com" required className="flex-1 px-4 py-3 rounded-full text-sm outline-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.15)', color: '#fff' }} /><button type="submit" className="px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)' }}>Subscribe</button></form>
      </div>
    </div>
  );
}

function Newsletter3() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.n3-card', { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)' });
    tl.fromTo('.n3-icon', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.3');
    tl.fromTo('.n3-mask', { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, '-=0.2');
    tl.fromTo('.n3-fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#FAF8F5' }}>
      <div className="n3-card max-w-3xl mx-auto p-12 rounded-3xl text-center" style={{ background: '#FFFDF7', boxShadow: '0 20px 60px rgba(0,0,0,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="n3-icon w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(212,175,55,0.1)' }}><Sparkles className="w-7 h-7" style={{ color: '#D4AF37' }} /></div>
        <h2 className="font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#2C2C2C' }}><span className="block overflow-hidden"><span className="n3-mask block">Join the Aura Family</span></span></h2>
        <p className="n3-fade text-sm mb-8 max-w-md mx-auto" style={{ color: '#5A5A5A' }}>Get 10% off your first order, plus early access to new arrivals and exclusive offers.</p>
        <form className="n3-fade flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="your@email.com" required className="flex-1 px-4 py-3 rounded-full text-sm outline-none" style={{ border: '1.5px solid rgba(212,175,55,0.2)', background: '#FAF8F5' }} /><button type="submit" className="px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}>Subscribe</button></form>
      </div>
    </div>
  );
}

function Newsletter4() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.n4-left', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
    tl.fromTo('.n4-right', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
  }, { scope: ref });
  return (
    <div ref={ref} className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)' }}>
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="n4-left"><h2 className="font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: 1.1 }}>Never Miss a<br />New Arrival</h2><p className="text-white/70 mb-6">Subscribe and get 10% off your first order.</p><div className="flex gap-6">{[{ num: '5K+', label: 'Subscribers' }, { num: '10%', label: 'First Order' }].map(s => (<div key={s.label}><p className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{s.num}</p><p className="text-xs text-white/50 uppercase tracking-wider">{s.label}</p></div>))}</div></div>
        <form className="n4-right space-y-3" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="your@email.com" required className="w-full px-4 py-3 rounded-full text-sm outline-none" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)' }} /><button type="submit" className="w-full px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all hover:scale-[1.02]" style={{ background: '#fff', color: '#D4AF37' }}>Subscribe Now</button></form>
      </div>
    </div>
  );
}

function Newsletter5() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to('.n5-bg', { yPercent: 15, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
    tl.fromTo('.n5-mask', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: 'power4.out' });
    tl.fromTo('.n5-fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref });
  return (
    <div ref={ref} className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: '#141414' }}>
      <div className="n5-bg absolute inset-0 opacity-5" style={{ backgroundImage: 'url(/images/hero/hero-slide-4.webp)', backgroundSize: 'cover', backgroundPosition: 'center', height: '130%' }} />
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <div className="n5-fade flex items-center justify-center gap-3 mb-4"><div style={{ width: 32, height: 1, background: '#D4AF37' }} /><span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: '#D4AF37' }}>Newsletter</span><div style={{ width: 32, height: 1, background: '#D4AF37' }} /></div>
        <h2 className="font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)' }}><span className="block overflow-hidden"><span className="n5-mask block">Stay in the</span></span><span className="block overflow-hidden"><span className="n5-mask block" style={{ color: '#D4AF37' }}>Loop</span></span></h2>
        <p className="n5-fade text-white/50 mb-8 max-w-md mx-auto">Be the first to know about new arrivals, sales, and styling tips.</p>
        <form className="n5-fade flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="your@email.com" required className="flex-1 px-4 py-3 rounded-full text-sm outline-none text-white" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.15)', color: '#fff' }} /><button type="submit" className="px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' }}>Subscribe</button></form>
        <p className="n5-fade text-xs text-white/30 mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NAV DEMOS (4) — Premium 10/10 designs (Aesop / MR PORTER / SSENSE inspired)
// ═══════════════════════════════════════════════════════════

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Journal', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

function Nav1() {
  // Editorial Center Split — Aesop-style. Logo centered, links split L/R.
  // Slim gold baseline animates width on scroll. Icons at far right with cart count badge.
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const onScroll = () => {
      if (!ref.current) return;
      if (window.scrollY > 40) ref.current.classList.add('demo-nav1-scrolled');
      else ref.current.classList.remove('demo-nav1-scrolled');
      // Animate the gold baseline width based on scroll
      const baseline = ref.current.querySelector('.demo-nav1-baseline');
      if (baseline) {
        const w = Math.min(100, window.scrollY / 4);
        (baseline as HTMLElement).style.width = w + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, { scope: ref });

  const leftLinks = navLinks.slice(0, 2);
  const rightLinks = navLinks.slice(2);

  return (
    <div ref={ref} className="demo-nav1">
      <div className="demo-nav1-baseline" />
      <div className="demo-nav1-inner">
        <nav className="demo-nav1-side demo-nav1-left">
          {leftLinks.map((l, i) => (
            <Link key={l.href} href={l.href} className={`demo-nav1-link ${i === 0 ? 'demo-nav1-link-active' : ''}`}>
              <span className="demo-nav1-link-num">0{i + 1}</span>
              <span className="demo-nav1-link-text">{l.label}</span>
            </Link>
          ))}
        </nav>
        <Link href="/" className="demo-nav1-logo">
          <span className="demo-nav1-logo-aura">Aura</span>
          <span className="demo-nav1-logo-dot">.</span>
          <span className="demo-nav1-logo-sub">Living</span>
        </Link>
        <nav className="demo-nav1-side demo-nav1-right">
          {rightLinks.map((l) => (
            <Link key={l.href} href={l.href} className="demo-nav1-link">
              <span className="demo-nav1-link-text">{l.label}</span>
            </Link>
          ))}
          <div className="demo-nav1-icons">
            <button className="demo-nav1-icon-btn" aria-label="Search"><Search className="demo-nav1-icon" /></button>
            <button className="demo-nav1-icon-btn" aria-label="Account"><User className="demo-nav1-icon" /></button>
            <button className="demo-nav1-icon-btn demo-nav1-cart" aria-label="Cart">
              <ShoppingBag className="demo-nav1-icon" />
              <span className="demo-nav1-cart-count">3</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

function Nav2() {
  // Floating Glass Bar — Apple Store-style. Frosted glass bar with category mega-dropdowns.
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  return (
    <div className="demo-nav2" onMouseLeave={() => setOpenMenu(null)}>
      <div className="demo-nav2-glow" />
      <div className="demo-nav2-inner">
        <Link href="/" className="demo-nav2-logo">
          <span className="demo-nav2-logo-mark">A</span>
          <span className="demo-nav2-logo-text">Aura Living</span>
        </Link>
        <nav className="demo-nav2-links">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`demo-nav2-link ${openMenu === i ? 'demo-nav2-link-open' : ''}`}
              onMouseEnter={() => setOpenMenu(i === 1 ? i : null)}
            >
              {l.label}
              {i === 1 && <ChevronDown className="demo-nav2-chev" />}
            </Link>
          ))}
        </nav>
        <div className="demo-nav2-actions">
          <button className="demo-nav2-icon-btn" aria-label="Search"><Search className="demo-nav2-icon" /></button>
          <button className="demo-nav2-icon-btn" aria-label="Cart"><ShoppingBag className="demo-nav2-icon" /><span className="demo-nav2-badge">3</span></button>
          <button className="demo-nav2-cta">Shop Now <ArrowRight className="demo-nav2-cta-arrow" /></button>
        </div>
      </div>
      {openMenu === 1 && (
        <div className="demo-nav2-mega" onMouseEnter={() => setOpenMenu(1)} onMouseLeave={() => setOpenMenu(null)}>
          <div className="demo-nav2-mega-inner">
            <div className="demo-nav2-mega-col">
              <span className="demo-nav2-mega-h">Categories</span>
              {['Lighting', 'Plants & Pots', 'Vases & Decor', 'Candles & Fragrance', 'Wall Art & Mirrors', 'Kitchen & Dining'].map((c) => (
                <Link key={c} href="/shop" className="demo-nav2-mega-link">
                  <span>{c}</span>
                  <ArrowUpRight className="demo-nav2-mega-arrow" />
                </Link>
              ))}
            </div>
            <div className="demo-nav2-mega-col">
              <span className="demo-nav2-mega-h">Featured</span>
              <Link href="/shop" className="demo-nav2-mega-feature">
                <Image src="/images/categories/lighting-category.webp" alt="Featured" fill className="demo-nav2-mega-img" />
                <div className="demo-nav2-mega-feature-overlay" />
                <div className="demo-nav2-mega-feature-content">
                  <span className="demo-nav2-mega-feature-eyebrow">New Collection</span>
                  <p className="demo-nav2-mega-feature-title">Lighting 2026</p>
                  <span className="demo-nav2-mega-feature-cta">Discover <ArrowRight className="demo-nav2-mega-arrow" /></span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Nav3() {
  // Full-Screen Takeover — SSENSE / Off-White-style. Minimal top bar, hamburger opens full-screen menu
  // with HUGE editorial typography (8vw), image preview on right, staggered GSAP reveal.
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current || !open) return;
    const tl = gsap.timeline();
    tl.fromTo('.demo-nav3-line', { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power4.out' });
    tl.fromTo('.demo-nav3-item', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power4.out' }, '-=0.3');
    tl.fromTo('.demo-nav3-foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
  }, { scope: ref, dependencies: [open] });

  return (
    <div ref={ref} className="demo-nav3">
      <div className="demo-nav3-bar">
        <Link href="/" className="demo-nav3-logo">
          <span className="demo-nav3-logo-aura">Aura</span>
          <span className="demo-nav3-logo-dot">.</span>
        </Link>
        <button className="demo-nav3-trigger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className="demo-nav3-trigger-label">{open ? 'Close' : 'Menu'}</span>
          <span className="demo-nav3-trigger-icon">
            <span className={`demo-nav3-trigger-line ${open ? 'demo-nav3-trigger-line-1' : ''}`} />
            <span className={`demo-nav3-trigger-line ${open ? 'demo-nav3-trigger-line-2' : ''}`} />
          </span>
        </button>
      </div>
      {open && (
        <div className="demo-nav3-overlay">
          <div className="demo-nav3-overlay-inner">
            <nav className="demo-nav3-list">
              {navLinks.map((l, i) => (
                <Link key={l.href} href={l.href} className="demo-nav3-item" onClick={() => setOpen(false)}>
                  <span className="demo-nav3-item-num">0{i + 1}</span>
                  <span className="demo-nav3-item-text">{l.label}</span>
                  <ArrowRight className="demo-nav3-item-arrow" />
                </Link>
              ))}
            </nav>
            <div className="demo-nav3-foot">
              <div className="demo-nav3-foot-left">
                <span className="demo-nav3-foot-h">Get in touch</span>
                <a href="mailto:hello@aura-living.pk" className="demo-nav3-foot-mail">hello@aura-living.pk</a>
                <span className="demo-nav3-foot-loc">Lahore, Pakistan</span>
              </div>
              <div className="demo-nav3-foot-right">
                <span className="demo-nav3-foot-h">Follow</span>
                <div className="demo-nav3-foot-socials">
                  <Instagram className="demo-nav3-foot-social" />
                  <Facebook className="demo-nav3-foot-social" />
                  <Twitter className="demo-nav3-foot-social" />
                </div>
              </div>
            </div>
            <span className="demo-nav3-line demo-nav3-line-1" />
            <span className="demo-nav3-line demo-nav3-line-2" />
          </div>
        </div>
      )}
    </div>
  );
}

function Nav4() {
  // Sticky Mega Grid — MR PORTER-style. Refined sticky bar with editorial mega dropdown.
  // Mega menu has 3 cols: category list / featured product / new arrivals mini-list.
  const [open, setOpen] = useState(false);
  return (
    <div className="demo-nav4" onMouseLeave={() => setOpen(false)}>
      <div className="demo-nav4-inner">
        <div className="demo-nav4-left">
          <Link href="/" className="demo-nav4-logo">
            <span className="demo-nav4-logo-aura">Aura</span>
            <span className="demo-nav4-logo-dot">.</span>
            <span className="demo-nav4-logo-sub">Living</span>
          </Link>
        </div>
        <nav className="demo-nav4-links">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`demo-nav4-link ${i === 1 ? 'demo-nav4-link-active' : ''}`}
              onMouseEnter={() => setOpen(i === 1)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="demo-nav4-right">
          <button className="demo-nav4-icon-btn" aria-label="Search"><Search className="demo-nav4-icon" /></button>
          <button className="demo-nav4-icon-btn" aria-label="Account"><User className="demo-nav4-icon" /></button>
          <button className="demo-nav4-icon-btn demo-nav4-cart" aria-label="Cart">
            <ShoppingBag className="demo-nav4-icon" />
            <span className="demo-nav4-cart-count">3</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="demo-nav4-mega" onMouseEnter={() => setOpen(true)}>
          <div className="demo-nav4-mega-inner">
            <div className="demo-nav4-mega-col demo-nav4-mega-col-list">
              <span className="demo-nav4-mega-h">Shop by Category</span>
              {[
                { name: 'Lighting', desc: 'Lamps, pendants & sconces' },
                { name: 'Plants & Pots', desc: 'Indoor greenery & planters' },
                { name: 'Vases & Decor', desc: 'Artisan ceramics & accents' },
                { name: 'Candles & Fragrance', desc: 'Scented candles & holders' },
                { name: 'Wall Art & Mirrors', desc: 'Framed art & mirrors' },
                { name: 'Kitchen & Dining', desc: 'Tableware & serving' },
              ].map((c) => (
                <Link key={c.name} href="/shop" className="demo-nav4-mega-cat">
                  <div>
                    <span className="demo-nav4-mega-cat-name">{c.name}</span>
                    <span className="demo-nav4-mega-cat-desc">{c.desc}</span>
                  </div>
                  <ArrowRight className="demo-nav4-mega-cat-arrow" />
                </Link>
              ))}
            </div>
            <div className="demo-nav4-mega-col demo-nav4-mega-col-feature">
              <Link href="/shop" className="demo-nav4-mega-feature">
                <Image src="/images/categories/lighting-category.webp" alt="Featured" fill className="demo-nav4-mega-img" />
                <div className="demo-nav4-mega-feature-overlay" />
                <div className="demo-nav4-mega-feature-content">
                  <span className="demo-nav4-mega-feature-eyebrow">Featured Collection</span>
                  <p className="demo-nav4-mega-feature-title">The Lighting Edit 2026</p>
                  <span className="demo-nav4-mega-feature-cta">Discover Now <ArrowRight className="demo-nav4-mega-arrow" /></span>
                </div>
              </Link>
            </div>
            <div className="demo-nav4-mega-col demo-nav4-mega-col-new">
              <span className="demo-nav4-mega-h">New Arrivals</span>
              {[
                { name: 'Brass Table Lamp', price: 'Rs. 9,999' },
                { name: 'Smoked Glass Pendant', price: 'Rs. 14,499' },
                { name: 'Terracotta Herb Pot', price: 'Rs. 2,499' },
                { name: 'Marble Vase', price: 'Rs. 5,999' },
              ].map((p) => (
                <Link key={p.name} href="/shop" className="demo-nav4-mega-new">
                  <span className="demo-nav4-mega-new-name">{p.name}</span>
                  <span className="demo-nav4-mega-new-price">{p.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NAV DEMOS (5-8) — Premium variants round 2
// ═══════════════════════════════════════════════════════════

function Nav5() {
  // Aurora Centered — morphing gradient bg, centered glass pill nav, big brand above
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    // Animate gradient position via CSS variable
    let raf = 0;
    const tick = () => {
      if (ref.current) {
        const t = Date.now() / 4000;
        const x = 50 + Math.sin(t) * 25;
        const y = 50 + Math.cos(t * 0.8) * 20;
        ref.current.style.setProperty('--demo-nav5-x', x + '%');
        ref.current.style.setProperty('--demo-nav5-y', y + '%');
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, { scope: ref });
  return (
    <div ref={ref} className="demo-nav5">
      <div className="demo-nav5-pill">
        <Link href="/" className="demo-nav5-logo">
          <span className="demo-nav5-logo-mark">A</span>
          <span className="demo-nav5-logo-text">Aura Living</span>
        </Link>
        <nav className="demo-nav5-links">
          {navLinks.map((l, i) => (
            <Link key={l.href} href={l.href} className={`demo-nav5-link ${i === 0 ? 'demo-nav5-link-active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="demo-nav5-actions">
          <button className="demo-nav5-icon-btn" aria-label="Search"><Search className="demo-nav5-icon" /></button>
          <button className="demo-nav5-icon-btn" aria-label="Cart">
            <ShoppingBag className="demo-nav5-icon" />
            <span className="demo-nav5-count">3</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Nav6() {
  // Brutalist Bold — heavy condensed type, asymmetric, monochrome on cream
  return (
    <div className="demo-nav6">
      <div className="demo-nav6-inner">
        <Link href="/" className="demo-nav6-logo">AURA<br />LIVING.</Link>
        <nav className="demo-nav6-links">
          {navLinks.map((l, i) => (
            <Link key={l.href} href={l.href} className={`demo-nav6-link ${i === 0 ? 'demo-nav6-link-active' : ''}`}>
              <span className="demo-nav6-link-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="demo-nav6-link-text">{l.label}</span>
            </Link>
          ))}
        </nav>
        <div className="demo-nav6-actions">
          <button className="demo-nav6-cart" aria-label="Cart">
            <ShoppingBag className="demo-nav6-cart-icon" />
            <span className="demo-nav6-cart-num">03</span>
            <span className="demo-nav6-cart-label">Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Nav7() {
  // Sidebar Vertical — fixed left vertical nav with rotated logo + vertical links
  return (
    <div className="demo-nav7">
      <aside className="demo-nav7-side">
        <Link href="/" className="demo-nav7-logo">
          <span className="demo-nav7-logo-aura">Aura</span>
          <span className="demo-nav7-logo-dot">.</span>
        </Link>
        <div className="demo-nav7-divider" />
        <nav className="demo-nav7-links">
          {navLinks.map((l, i) => (
            <Link key={l.href} href={l.href} className={`demo-nav7-link ${i === 0 ? 'demo-nav7-link-active' : ''}`}>
              <span className="demo-nav7-link-num">0{i + 1}</span>
              <span className="demo-nav7-link-text">{l.label}</span>
            </Link>
          ))}
        </nav>
        <div className="demo-nav7-foot">
          <button className="demo-nav7-icon-btn" aria-label="Search"><Search className="demo-nav7-icon" /></button>
          <button className="demo-nav7-icon-btn" aria-label="Cart">
            <ShoppingBag className="demo-nav7-icon" />
            <span className="demo-nav7-count">3</span>
          </button>
          <div className="demo-nav7-socials">
            <Instagram className="demo-nav7-social" />
            <Facebook className="demo-nav7-social" />
          </div>
        </div>
      </aside>
      <div className="demo-nav7-main">
        <div className="demo-nav7-main-eyebrow">
          <Sparkles className="demo-nav7-spark" /> Featured Collection
        </div>
        <h3 className="demo-nav7-main-title">Handcrafted Lighting 2026</h3>
        <p className="demo-nav7-main-sub">Premium lamps, pendants & sconces — made in Lahore.</p>
        <Link href="/shop" className="demo-nav7-main-cta">Explore <ArrowRight className="demo-nav7-main-arrow" /></Link>
      </div>
    </div>
  );
}

function Nav8() {
  // Promo + Bar Combo — top thin promo marquee strip + main nav below
  return (
    <div className="demo-nav8">
      <div className="demo-nav8-promo">
        <div className="demo-nav8-promo-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="demo-nav8-promo-group">
              {['Free Shipping over Rs. 10,000', 'COD Available Nationwide', '7-Day Easy Returns', 'Handcrafted in Pakistan'].map((t, i) => (
                <span key={i} className="demo-nav8-promo-item">
                  <Sparkles className="demo-nav8-promo-spark" /> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="demo-nav8-bar">
        <div className="demo-nav8-bar-inner">
          <Link href="/" className="demo-nav8-logo">
            <span className="demo-nav8-logo-aura">Aura</span>
            <span className="demo-nav8-logo-dot">.</span>
            <span className="demo-nav8-logo-sub">Living</span>
          </Link>
          <nav className="demo-nav8-links">
            {navLinks.map((l, i) => (
              <Link key={l.href} href={l.href} className={`demo-nav8-link ${i === 0 ? 'demo-nav8-link-active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="demo-nav8-actions">
            <button className="demo-nav8-icon-btn" aria-label="Search"><Search className="demo-nav8-icon" /></button>
            <button className="demo-nav8-icon-btn" aria-label="Account"><User className="demo-nav8-icon" /></button>
            <button className="demo-nav8-icon-btn demo-nav8-cart" aria-label="Cart">
              <ShoppingBag className="demo-nav8-icon" />
              <span className="demo-nav8-count">3</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FOOTER DEMOS (4) — Premium 10/10 designs (SSENSE / MR PORTER / Aesop / COS inspired)
// ═══════════════════════════════════════════════════════════

function Footer1() {
  // Editorial Big Type — SSENSE-style. Massive wordmark filling top half.
  // Gold gradient text fill. 4 link columns. Inline newsletter. Atmospheric dark bg.
  return (
    <footer className="demo-footer1">
      <div className="demo-footer1-glow" />
      <div className="demo-footer1-inner">
        <div className="demo-footer1-mega-row">
          <span className="demo-footer1-mega-eyebrow">
            <span className="demo-footer1-line" /> Handcrafted in Pakistan <span className="demo-footer1-line" />
          </span>
          <h2 className="demo-footer1-mega" aria-label="Aura Living">
            AURA LIVING
          </h2>
          <p className="demo-footer1-mega-tag">
            Modern Pakistani home decor, handcrafted one piece at a time.
          </p>
        </div>
        <div className="demo-footer1-grid">
          <div className="demo-footer1-col">
            <span className="demo-footer1-h">Shop</span>
            <Link href="/shop">All Products</Link>
            <Link href="/shop?category=lighting">Lighting</Link>
            <Link href="/shop?category=plants">Plants & Pots</Link>
            <Link href="/shop?category=vases">Vases & Decor</Link>
            <Link href="/sale">Sale</Link>
          </div>
          <div className="demo-footer1-col">
            <span className="demo-footer1-h">Company</span>
            <Link href="/about">About Us</Link>
            <Link href="/blog">Journal</Link>
            <Link href="/care-guide">Care Guide</Link>
            <Link href="/lookbook">Lookbook</Link>
          </div>
          <div className="demo-footer1-col">
            <span className="demo-footer1-h">Help</span>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="demo-footer1-col demo-footer1-col-news">
            <span className="demo-footer1-h">Newsletter</span>
            <p className="demo-footer1-news-sub">10% off your first order. New arrivals every week.</p>
            <form className="demo-footer1-news-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email address" required className="demo-footer1-news-input" />
              <button type="submit" className="demo-footer1-news-btn" aria-label="Subscribe">
                <ArrowRight className="demo-footer1-news-arrow" />
              </button>
            </form>
          </div>
        </div>
        <div className="demo-footer1-bottom">
          <span className="demo-footer1-copy">© 2026 Aura Living — Lahore, Pakistan</span>
          <div className="demo-footer1-socials">
            <Instagram className="demo-footer1-social" />
            <Facebook className="demo-footer1-social" />
            <Twitter className="demo-footer1-social" />
          </div>
          <div className="demo-footer1-pay">
            <span className="demo-footer1-pay-chip">COD</span>
            <span className="demo-footer1-pay-chip">VISA</span>
            <span className="demo-footer1-pay-chip">MC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer2() {
  // Asymmetric Magazine — Aesop-style. 60/40 split: brand mark + tagline left, 3 link cols right.
  // Atmospheric cream→gold gradient bg. Big social circles. Refined editorial typography.
  return (
    <footer className="demo-footer2">
      <div className="demo-footer2-inner">
        <div className="demo-footer2-top">
          <div className="demo-footer2-brand">
            <span className="demo-footer2-eyebrow">
              <span className="demo-footer2-line" /> Aura Living <span className="demo-footer2-line" />
            </span>
            <h2 className="demo-footer2-brand-mark">Made with<br />love, in<br />Lahore.</h2>
            <p className="demo-footer2-brand-tag">
              Handcrafted decor for the modern Pakistani home. Each piece is made by skilled artisans using
              time-honored techniques and premium materials.
            </p>
            <div className="demo-footer2-socials">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="demo-footer2-social" aria-label="Social">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <div className="demo-footer2-cols">
            <div className="demo-footer2-col">
              <span className="demo-footer2-h">Shop</span>
              <Link href="/shop">All Products</Link>
              <Link href="/new-arrivals">New Arrivals</Link>
              <Link href="/sale">Sale</Link>
              <Link href="/lookbook">Lookbook</Link>
            </div>
            <div className="demo-footer2-col">
              <span className="demo-footer2-h">Company</span>
              <Link href="/about">Our Story</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/care-guide">Care Guide</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="demo-footer2-col">
              <span className="demo-footer2-h">Help</span>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="demo-footer2-news-strip">
          <div>
            <span className="demo-footer2-news-h">Stay in the loop</span>
            <p className="demo-footer2-news-sub">Get 10% off your first order + early access to new arrivals.</p>
          </div>
          <form className="demo-footer2-news-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" required className="demo-footer2-news-input" />
            <button type="submit" className="demo-footer2-news-btn">Subscribe <ArrowRight className="demo-footer2-news-arrow" /></button>
          </form>
        </div>
        <div className="demo-footer2-bottom">
          <span>© 2026 Aura Living</span>
          <span className="demo-footer2-bottom-mid">Lahore · Karachi · Islamabad — Nationwide COD</span>
          <div className="demo-footer2-pay">
            <span className="demo-footer2-pay-chip">COD</span>
            <span className="demo-footer2-pay-chip">VISA</span>
            <span className="demo-footer2-pay-chip">MC</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer3() {
  // Stacked CTA Dark — Apple-style. Top: massive "Stay Connected" CTA + newsletter.
  // Middle: 3 col links + brand col. Bottom: condensed link row + socials + copyright.
  // Dark bg with floating ambient gold orbs.
  return (
    <footer className="demo-footer3">
      <div className="demo-footer3-orb demo-footer3-orb-1" />
      <div className="demo-footer3-orb demo-footer3-orb-2" />
      <div className="demo-footer3-inner">
        <div className="demo-footer3-cta">
          <span className="demo-footer3-eyebrow">
            <span className="demo-footer3-line" /> Stay Connected <span className="demo-footer3-line" />
          </span>
          <h2 className="demo-footer3-cta-title">Be the first to<br /><span className="demo-footer3-cta-accent">know.</span></h2>
          <p className="demo-footer3-cta-sub">New arrivals, sales, and styling tips — straight to your inbox.</p>
          <form className="demo-footer3-cta-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" required className="demo-footer3-cta-input" />
            <button type="submit" className="demo-footer3-cta-btn">Subscribe <ArrowRight className="demo-footer3-cta-arrow" /></button>
          </form>
        </div>
        <div className="demo-footer3-divider" />
        <div className="demo-footer3-grid">
          <div className="demo-footer3-brand-col">
            <Link href="/" className="demo-footer3-logo">
              <span className="demo-footer3-logo-aura">Aura</span>
              <span className="demo-footer3-logo-dot">.</span>
              <span className="demo-footer3-logo-sub">Living</span>
            </Link>
            <p className="demo-footer3-brand-tag">Handcrafted decor for the modern Pakistani home.</p>
            <div className="demo-footer3-socials">
              <Instagram className="demo-footer3-social" />
              <Facebook className="demo-footer3-social" />
              <Twitter className="demo-footer3-social" />
            </div>
          </div>
          <div className="demo-footer3-cols">
            <div className="demo-footer3-col">
              <span className="demo-footer3-h">Shop</span>
              <Link href="/shop">All Products</Link>
              <Link href="/new-arrivals">New Arrivals</Link>
              <Link href="/sale">Sale</Link>
              <Link href="/lookbook">Lookbook</Link>
            </div>
            <div className="demo-footer3-col">
              <span className="demo-footer3-h">Help</span>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="demo-footer3-col">
              <span className="demo-footer3-h">Company</span>
              <Link href="/about">Our Story</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/care-guide">Care Guide</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="demo-footer3-bottom">
          <span>© 2026 Aura Living — Handcrafted in Pakistan</span>
          <div className="demo-footer3-bottom-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer4() {
  // Minimal Grid Light — COS-style. Clean cream bg, asymmetric grid.
  // Brand statement + 2 link cols + minimal newsletter. Lots of whitespace.
  // Subtle hover animations, refined typography, thin gold dividers.
  return (
    <footer className="demo-footer4">
      <div className="demo-footer4-inner">
        <div className="demo-footer4-grid">
          <div className="demo-footer4-brand-col">
            <Link href="/" className="demo-footer4-logo">
              <span className="demo-footer4-logo-aura">Aura</span>
              <span className="demo-footer4-logo-dot">.</span>
            </Link>
            <p className="demo-footer4-tag">Handcrafted decor, made in Pakistan.</p>
            <form className="demo-footer4-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email for 10% off" required className="demo-footer4-input" />
              <button type="submit" className="demo-footer4-submit" aria-label="Subscribe">
                <ArrowRight className="demo-footer4-submit-icon" />
              </button>
            </form>
          </div>
          <div className="demo-footer4-cols">
            <div className="demo-footer4-col">
              <span className="demo-footer4-h">Shop</span>
              <Link href="/shop">All</Link>
              <Link href="/new-arrivals">New</Link>
              <Link href="/sale">Sale</Link>
              <Link href="/lookbook">Lookbook</Link>
            </div>
            <div className="demo-footer4-col">
              <span className="demo-footer4-h">About</span>
              <Link href="/about">Story</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/care-guide">Care</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="demo-footer4-col">
              <span className="demo-footer4-h">Help</span>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="demo-footer4-strip">
          <div className="demo-footer4-socials">
            <Instagram className="demo-footer4-social" />
            <Facebook className="demo-footer4-social" />
            <Twitter className="demo-footer4-social" />
          </div>
          <span className="demo-footer4-copy">© 2026 Aura Living</span>
          <div className="demo-footer4-pay">
            <span className="demo-footer4-pay-chip">COD</span>
            <span className="demo-footer4-pay-chip">VISA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════
// FOOTER DEMOS (5-8) — Premium variants round 2
// ═══════════════════════════════════════════════════════════

function Footer5() {
  // Newsletter Hero — newsletter as full hero with massive headline, links condensed below
  return (
    <footer className="demo-footer5">
      <div className="demo-footer5-glow" />
      <div className="demo-footer5-inner">
        <div className="demo-footer5-hero">
          <span className="demo-footer5-eyebrow">
            <span className="demo-footer5-line" /> Newsletter <span className="demo-footer5-line" />
          </span>
          <h2 className="demo-footer5-title">
            Be the first<br /><span className="demo-footer5-title-accent">to know.</span>
          </h2>
          <p className="demo-footer5-sub">New arrivals, sales, and styling tips. 10% off your first order.</p>
          <form className="demo-footer5-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" required className="demo-footer5-input" />
            <button type="submit" className="demo-footer5-btn">Subscribe <ArrowRight className="demo-footer5-arrow" /></button>
          </form>
        </div>
        <div className="demo-footer5-links">
          {[
            { h: 'Shop', items: ['All Products', 'New Arrivals', 'Sale'] },
            { h: 'Company', items: ['About', 'Journal', 'Contact'] },
            { h: 'Help', items: ['Shipping', 'Returns', 'FAQ'] },
            { h: 'Legal', items: ['Privacy', 'Terms'] },
          ].map((col) => (
            <div key={col.h} className="demo-footer5-col">
              <span className="demo-footer5-h">{col.h}</span>
              {col.items.map((it) => (
                <Link key={it} href="/" className="demo-footer5-link">{it}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="demo-footer5-bottom">
          <Link href="/" className="demo-footer5-logo">
            <span className="demo-footer5-logo-aura">Aura</span>
            <span className="demo-footer5-logo-dot">.</span>
            <span className="demo-footer5-logo-sub">Living</span>
          </Link>
          <span className="demo-footer5-copy">© 2026 Aura Living — Handcrafted in Pakistan</span>
          <div className="demo-footer5-socials">
            <Instagram className="demo-footer5-social" />
            <Facebook className="demo-footer5-social" />
            <Twitter className="demo-footer5-social" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer6() {
  // Color Block — top dark section (newsletter + brand), bottom cream section (links + social)
  return (
    <footer className="demo-footer6">
      <div className="demo-footer6-top">
        <div className="demo-footer6-top-inner">
          <div className="demo-footer6-brand">
            <Link href="/" className="demo-footer6-logo">
              <span className="demo-footer6-logo-aura">Aura</span>
              <span className="demo-footer6-logo-dot">.</span>
              <span className="demo-footer6-logo-sub">Living</span>
            </Link>
            <p className="demo-footer6-tag">Handcrafted decor for the modern Pakistani home. Made with love in Lahore.</p>
            <div className="demo-footer6-socials">
              <Instagram className="demo-footer6-social" />
              <Facebook className="demo-footer6-social" />
              <Twitter className="demo-footer6-social" />
            </div>
          </div>
          <form className="demo-footer6-form" onSubmit={(e) => e.preventDefault()}>
            <span className="demo-footer6-form-h">Stay in the loop</span>
            <p className="demo-footer6-form-sub">10% off your first order + early access to new arrivals.</p>
            <div className="demo-footer6-form-row">
              <input type="email" placeholder="your@email.com" required className="demo-footer6-input" />
              <button type="submit" className="demo-footer6-btn">Subscribe <ArrowRight className="demo-footer6-arrow" /></button>
            </div>
          </form>
        </div>
      </div>
      <div className="demo-footer6-bottom">
        <div className="demo-footer6-bottom-inner">
          <div className="demo-footer6-cols">
            {[
              { h: 'Shop', items: ['All Products', 'New Arrivals', 'Bestsellers', 'Sale'] },
              { h: 'Company', items: ['About', 'Journal', 'Care Guide', 'Contact'] },
              { h: 'Help', items: ['Shipping', 'Returns', 'FAQ', 'Track Order'] },
              { h: 'Legal', items: ['Privacy', 'Terms', 'Cookies'] },
            ].map((col) => (
              <div key={col.h} className="demo-footer6-col">
                <span className="demo-footer6-h">{col.h}</span>
                {col.items.map((it) => (
                  <Link key={it} href="/" className="demo-footer6-link">{it}</Link>
                ))}
              </div>
            ))}
          </div>
          <div className="demo-footer6-strip">
            <span className="demo-footer6-copy">© 2026 Aura Living — Lahore, Pakistan</span>
            <div className="demo-footer6-pay">
              <span className="demo-footer6-pay-chip">COD</span>
              <span className="demo-footer6-pay-chip">VISA</span>
              <span className="demo-footer6-pay-chip">MC</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer7() {
  // Magazine Spread — image column left, text + link cols right
  return (
    <footer className="demo-footer7">
      <div className="demo-footer7-inner">
        <div className="demo-footer7-image-col">
          <Image
            src="/images/about-workshop.webp"
            alt="Aura Living workshop"
            fill
            className="demo-footer7-img"
          />
          <div className="demo-footer7-img-overlay" />
          <div className="demo-footer7-img-content">
            <span className="demo-footer7-img-eyebrow">Our Workshop</span>
            <p className="demo-footer7-img-quote">"Every piece tells a story of Pakistani craftsmanship."</p>
            <span className="demo-footer7-img-loc">Lahore, Pakistan</span>
          </div>
        </div>
        <div className="demo-footer7-content-col">
          <Link href="/" className="demo-footer7-logo">
            <span className="demo-footer7-logo-aura">Aura</span>
            <span className="demo-footer7-logo-dot">.</span>
            <span className="demo-footer7-logo-sub">Living</span>
          </Link>
          <p className="demo-footer7-tag">Handcrafted decor for the modern Pakistani home.</p>
          <div className="demo-footer7-cols">
            <div className="demo-footer7-col">
              <span className="demo-footer7-h">Shop</span>
              <Link href="/shop">All Products</Link>
              <Link href="/new-arrivals">New Arrivals</Link>
              <Link href="/sale">Sale</Link>
            </div>
            <div className="demo-footer7-col">
              <span className="demo-footer7-h">Company</span>
              <Link href="/about">Our Story</Link>
              <Link href="/blog">Journal</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="demo-footer7-col">
              <span className="demo-footer7-h">Help</span>
              <Link href="/shipping">Shipping</Link>
              <Link href="/returns">Returns</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </div>
          <form className="demo-footer7-form" onSubmit={(e) => e.preventDefault()}>
            <span className="demo-footer7-form-h">10% off your first order</span>
            <div className="demo-footer7-form-row">
              <input type="email" placeholder="your@email.com" required className="demo-footer7-input" />
              <button type="submit" className="demo-footer7-btn" aria-label="Subscribe">
                <ArrowRight className="demo-footer7-arrow" />
              </button>
            </div>
          </form>
          <div className="demo-footer7-bottom">
            <span className="demo-footer7-copy">© 2026 Aura Living</span>
            <div className="demo-footer7-socials">
              <Instagram className="demo-footer7-social" />
              <Facebook className="demo-footer7-social" />
              <Twitter className="demo-footer7-social" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Footer8() {
  // Brutalist Type — massive condensed uppercase AURA LIVING filling top, link cols in a row below, monochrome
  return (
    <footer className="demo-footer8">
      <div className="demo-footer8-inner">
        <div className="demo-footer8-mega-row">
          <span className="demo-footer8-eyebrow">Handcrafted · Made in Pakistan · 2026</span>
          <h2 className="demo-footer8-mega" aria-label="Aura Living">AURA LIVING.</h2>
        </div>
        <div className="demo-footer8-grid">
          <div className="demo-footer8-col">
            <span className="demo-footer8-h">Shop</span>
            <Link href="/shop">All</Link>
            <Link href="/new-arrivals">New</Link>
            <Link href="/sale">Sale</Link>
            <Link href="/lookbook">Lookbook</Link>
          </div>
          <div className="demo-footer8-col">
            <span className="demo-footer8-h">Company</span>
            <Link href="/about">About</Link>
            <Link href="/blog">Journal</Link>
            <Link href="/care-guide">Care</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="demo-footer8-col">
            <span className="demo-footer8-h">Help</span>
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <div className="demo-footer8-col">
            <span className="demo-footer8-h">Follow</span>
            <a href="#" className="demo-footer8-social-link">Instagram</a>
            <a href="#" className="demo-footer8-social-link">Facebook</a>
            <a href="#" className="demo-footer8-social-link">Twitter</a>
            <a href="#" className="demo-footer8-social-link">Pinterest</a>
          </div>
          <div className="demo-footer8-col demo-footer8-col-news">
            <span className="demo-footer8-h">Newsletter</span>
            <p className="demo-footer8-news-sub">10% off your first order.</p>
            <form className="demo-footer8-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email" required className="demo-footer8-input" />
              <button type="submit" className="demo-footer8-btn" aria-label="Subscribe">
                <ArrowRight className="demo-footer8-arrow" />
              </button>
            </form>
          </div>
        </div>
        <div className="demo-footer8-bottom">
          <span>© 2026 AURA LIVING</span>
          <span className="demo-footer8-bottom-mid">LAHORE · KARACHI · ISLAMABAD</span>
          <div className="demo-footer8-pay">
            <span className="demo-footer8-pay-chip">COD</span>
            <span className="demo-footer8-pay-chip">VISA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const sections = [
  { type: 'nav', label: 'Nav', tabs: [
    { id: 0, label: 'Editorial Split', desc: 'Aesop-style · logo centered · links split L/R · gold baseline scroll anim · cart count badge' },
    { id: 1, label: 'Glass Mega', desc: 'Apple-style · floating frosted glass bar · 2-col mega dropdown with featured product' },
    { id: 2, label: 'Full Takeover', desc: 'SSENSE-style · minimal bar · full-screen menu · 8vw editorial type · staggered GSAP reveal' },
    { id: 3, label: 'Sticky Mega Grid', desc: 'MR PORTER-style · 3-col mega menu · categories + featured + new arrivals mini-list' },
    { id: 4, label: 'Aurora Centered', desc: 'Morphing gradient bg · centered glass pill nav · gold "A" logo mark · animated radial glow' },
    { id: 5, label: 'Brutalist Bold', desc: 'Heavy condensed type · all caps · asymmetric · monochrome on cream · big cart counter' },
    { id: 6, label: 'Sidebar Vertical', desc: 'Fixed left vertical nav · numbered links · search + cart + socials at bottom · featured panel right' },
    { id: 7, label: 'Promo + Bar', desc: 'Top thin gold promo marquee strip · main nav bar below · clean & informative' },
  ]},
  { type: 'footer', label: 'Footer', tabs: [
    { id: 0, label: 'Big Type', desc: 'SSENSE-style · massive AURA LIVING wordmark · gold gradient text · 4 cols + newsletter' },
    { id: 1, label: 'Magazine Split', desc: 'Aesop-style · 60/40 split · big brand mark · 3 cols · cream→gold gradient bg' },
    { id: 2, label: 'CTA Dark', desc: 'Apple-style · massive "Be the first to know" CTA · floating gold orbs · 3 cols + brand' },
    { id: 3, label: 'Minimal Light', desc: 'COS-style · cream bg · asymmetric grid · minimal newsletter · lots of whitespace' },
    { id: 4, label: 'Newsletter Hero', desc: 'Newsletter as full hero · massive "Be the first to know" headline · condensed link row below' },
    { id: 5, label: 'Color Block', desc: 'Two horizontal sections · top dark (brand + newsletter) · bottom cream (link cols + pay)' },
    { id: 6, label: 'Magazine Spread', desc: 'Image column left (workshop photo with quote) · text + link cols right · editorial' },
    { id: 7, label: 'Brutalist Type', desc: 'Massive condensed uppercase AURA LIVING · 5-col grid · monochrome · editorial brutalist' },
  ]},
  { type: 'bento', label: 'Categories', tabs: [
    { id: 0, label: 'Classic Bento', desc: '1 tall + 1 wide + 4 standard · asymmetric grid' },
    { id: 1, label: 'Hover Reveal', desc: 'Panel slides up on hover · dark theme' },
    { id: 2, label: 'Mosaic', desc: 'Varying heights · number badges · gold bar' },
    { id: 3, label: 'Split Overlay', desc: 'Gold bar slides from left · content lifts' },
  ]},
  { type: 'story', label: 'Our Story', tabs: [
    { id: 0, label: 'Split Editorial', desc: 'Clip-path image · word rotateX · floating card' },
    { id: 1, label: 'Parallax Band', desc: 'Scrub parallax · text mask · gold dust' },
    { id: 2, label: 'Stacked Cards', desc: 'Card stagger · image clip · badge pop' },
    { id: 3, label: 'Timeline', desc: 'Gold line draws · circle pop + pulse' },
    { id: 4, label: 'Quote', desc: 'Quote mark scale · word mask · bg parallax' },
  ]},
  { type: 'products', label: 'Products', tabs: [
    { id: 0, label: 'Classic Grid', desc: '4-col grid · image zoom · badge · light bg' },
    { id: 1, label: 'Dark Cards', desc: 'Dark theme · hover overlay · border cards' },
    { id: 2, label: 'Editorial', desc: 'Square images · gold divider · gradient bg' },
    { id: 3, label: 'Quick Add', desc: 'Hover quick-add button · clip-path reveal' },
    { id: 4, label: 'Compact List', desc: 'Horizontal cards · dark · minimal' },
  ]},
  { type: 'cta', label: 'CTA', tabs: [
    { id: 0, label: 'Parallax Full', desc: 'Full-screen parallax · dark overlay · centered' },
    { id: 1, label: 'Gold Band', desc: 'Full-width gold gradient · white text' },
    { id: 2, label: 'Split + Grid', desc: 'Left text + right product grid · dark' },
    { id: 3, label: '3D Words', desc: 'Word rotateX reveal · gradient bg' },
    { id: 4, label: 'Card', desc: 'Centered card · icon · dual CTA · shadow' },
  ]},
  { type: 'trust', label: 'Trust', tabs: [
    { id: 0, label: 'Minimal', desc: 'Icon circles · centered · light bg' },
    { id: 1, label: 'Dark Cards', desc: 'Dark bg · bordered cards · back ease' },
    { id: 2, label: 'List', desc: 'Horizontal list · gold line accent · cream bg' },
    { id: 3, label: 'Hover Lift', desc: 'Card grid · hover lift · gold border' },
    { id: 4, label: 'Marquee', desc: 'Infinite scroll · dark bg · gold icons' },
  ]},
  { type: 'newsletter', label: 'Newsletter', tabs: [
    { id: 0, label: 'Minimal', desc: 'Cream gradient · centered · gold accent' },
    { id: 1, label: 'Dark', desc: 'Dark bg · gold sparkle · glassmorphism input' },
    { id: 2, label: 'Card', desc: 'Floating card · icon · shadow · border' },
    { id: 3, label: 'Gold Split', desc: 'Gold bg · left text + right form · stats' },
    { id: 4, label: 'Image BG', desc: 'Dark overlay on image · centered form' },
  ]},
];

export default function BentoDemosPage() {
  const [sectionIdx, setSectionIdx] = useState(0); // Start on Nav
  const [activeTab, setActiveTab] = useState(0);
  const current = sections[sectionIdx];

  // Map section type → array of demo components.
  // IMPORTANT: we render <Demo /> as a JSX element (not call Demo() as a function)
  // so each demo gets its own React hooks context. Calling a component as a
  // function merges its hooks into THIS component's context, and switching
  // between demos with different hook counts triggers React error #300.
  const demoMap: Record<string, React.ComponentType[]> = {
    nav: [Nav1, Nav2, Nav3, Nav4, Nav5, Nav6, Nav7, Nav8],
    footer: [Footer1, Footer2, Footer3, Footer4, Footer5, Footer6, Footer7, Footer8],
    bento: [Bento1, Bento2, Bento3, Bento4],
    story: [Story1, Story2, Story3, Story4, Story5],
    products: [Products1, Products2, Products3, Products4, Products5],
    cta: [CTA1, CTA2, CTA3, CTA4, CTA5],
    trust: [Trust1, Trust2, Trust3, Trust4, Trust5],
    newsletter: [Newsletter1, Newsletter2, Newsletter3, Newsletter4, Newsletter5],
  };
  const Demo = demoMap[current.type]?.[activeTab];

  return (
    <div className="w-full">
      {/* Top demo selector — clean two-row chrome */}
      <header className="demo-chrome">
        <div className="demo-chrome-inner">
          {/* Row 1: brand + section pill row */}
          <div className="demo-chrome-row1">
            <span className="demo-chrome-brand">
              Aura<span className="demo-chrome-brand-dot">.</span>
              <span className="demo-chrome-brand-sub">Design Lab</span>
            </span>
            <div className="demo-chrome-sections">
              {sections.map((s, i) => (
                <button
                  key={s.type}
                  onClick={() => { setSectionIdx(i); setActiveTab(0); }}
                  className={`demo-chrome-section ${sectionIdx === i ? 'demo-chrome-section-active' : ''}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: variant tabs for the selected section */}
          <div className="demo-chrome-row2">
            <span className="demo-chrome-row2-label">
              {current.label} — choose a variant
            </span>
            <div className="demo-chrome-tabs">
              {current.tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`demo-chrome-tab ${activeTab === tab.id ? 'demo-chrome-tab-active' : ''}`}
                >
                  <span className="demo-chrome-tab-num">0{tab.id + 1}</span>
                  <span className="demo-chrome-tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Active demo — mounted fresh per switch (keyed).
          Rendered as <Demo /> (not Demo()) so hooks stay isolated. */}
      <div key={`${current.type}-${activeTab}`} className="demo-chrome-stage">
        {Demo ? <Demo /> : null}
      </div>

      {/* Info bar — what you're viewing + reply prompt */}
      <footer className="demo-chrome-info">
        <div className="demo-chrome-info-inner">
          <span className="demo-chrome-info-section">{current.label}</span>
          <span className="demo-chrome-info-sep">·</span>
          <span className="demo-chrome-info-variant">
            Demo {activeTab + 1} of {current.tabs.length} — {current.tabs[activeTab]?.label}
          </span>
          <p className="demo-chrome-info-desc">{current.tabs[activeTab]?.desc}</p>
          <div className="demo-chrome-info-pill">
            <span className="demo-chrome-info-pill-text">
              Reply with number {activeTab + 1} if you like this {current.label.toLowerCase()} design
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
