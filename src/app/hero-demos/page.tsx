'use client';

/**
 * Hero Demos v2 — 5 award-winning hero sections.
 * Each uses advanced GSAP techniques: clip-path reveals, text masks,
 * magnetic buttons, scroll velocity, particle gold dust, and more.
 *
 * Visit /hero-demos to see all 5.
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Sparkles, Play, Truck, ShieldCheck, Banknote } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const heroImages = [
  '/images/hero/hero-slide-1.webp',
  '/images/hero/hero-slide-2.webp',
  '/images/hero/hero-slide-3.webp',
  '/images/hero/hero-slide-4.webp',
  '/images/hero/hero-slide-5.webp',
];

function DemoLabel({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="py-8 px-4 text-center" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2C2C2C 100%)' }}>
      <div className="inline-flex items-center gap-3 mb-3">
        <div className="w-8 h-px" style={{ background: '#D4AF37' }} />
        <span className="text-xs uppercase tracking-[6px] font-bold" style={{ color: '#D4AF37' }}>Demo {number}</span>
        <div className="w-8 h-px" style={{ background: '#D4AF37' }} />
      </div>
      <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h2>
      <p className="text-sm text-white/40">{description}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 1: CINEMATIC SLIDER — Clip-path reveal + magnetic CTA
// ═══════════════════════════════════════════════════════════
function Hero1() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % 3), 6000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    // Clip-path reveal on load
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.h1-clip', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, stagger: 0.15, ease: 'power4.out' })
      .fromTo('.h1-fade', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.6');

    // Parallax on scroll
    gsap.to('.h1-bg', {
      yPercent: 25, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 }
    });

    // Magnetic button
    const btn = heroRef.current?.querySelector('.h1-magnetic');
    if (btn) {
      btn.addEventListener('mousemove', (e: Event) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e as MouseEvent).clientX - rect.left - rect.width / 2;
        const y = (e as MouseEvent).clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      });
    }

    // Animate on slide change
    return () => { };
  }, { scope: ref });

  // Re-animate text on slide change
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo('.h1-clip', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, stagger: 0.12, ease: 'power4.out' });
    gsap.fromTo('.h1-fade', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.3 });
  }, [active]);

  const slides = [
    { eyebrow: 'New Collection 2026', title: 'Where Comfort', titleAccent: 'Meets Style', subtitle: 'Handcrafted decor for the modern Pakistani home. Lamps, vases, plants & more.' },
    { eyebrow: 'Artisan Crafted', title: 'Made by Hand,', titleAccent: 'Made with Heart', subtitle: 'Every piece tells a story of Pakistani craftsmanship — from brass to ceramic.' },
    { eyebrow: 'Limited Edition', title: 'Bring Nature', titleAccent: 'Indoors', subtitle: 'Curated plants, planters & botanical accents that breathe life into your space.' },
  ];

  return (
    <div ref={ref} className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background slides with Ken Burns */}
      {heroImages.slice(0, 3).map((img, i) => (
        <div key={i} className="absolute inset-0 transition-all duration-[1500ms]" style={{ opacity: i === active ? 1 : 0 }}>
          <div className="h1-bg absolute inset-0" style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: i === active ? 'scale(1.12)' : 'scale(1)',
            transition: 'transform 6s ease-out'
          }} />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(28,28,28,0.8) 0%, rgba(28,28,28,0.4) 40%, rgba(212,175,55,0.1) 100%)' }} />

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 /%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 /%3E%3C/svg%3E")',
      }} />

      {/* Content */}
      <div ref={heroRef} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Eyebrow */}
        <div className="h1-clip flex items-center gap-4 mb-8">
          <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
          <span className="text-xs tracking-[6px] uppercase font-bold" style={{ color: '#D4AF37' }}>{slides[active].eyebrow}</span>
          <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
        </div>

        {/* Title with clip-path reveal */}
        <h1 className="text-white font-bold text-center mb-8" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.5rem, 9vw, 7rem)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          textShadow: '0 8px 40px rgba(0,0,0,0.4)'
        }}>
          <span className="h1-clip block">{slides[active].title}</span>
          <span className="h1-clip block italic" style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4D76E 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>{slides[active].titleAccent}</span>
        </h1>

        {/* Subtitle */}
        <p className="h1-fade text-white/65 text-lg sm:text-xl max-w-xl mb-12" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.3)' }}>
          {slides[active].subtitle}
        </p>

        {/* CTAs */}
        <div className="h1-fade flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="h1-magnetic px-10 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all flex items-center gap-2 group" style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #C9A22E 50%, #B8941F 100%)',
            boxShadow: '0 8px 32px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            willChange: 'transform'
          }}>
            Shop Collection
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/about" className="px-10 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:bg-white/10 border border-white/20 backdrop-blur-sm" style={{ willChange: 'transform' }}>
            Our Story
          </Link>
        </div>
      </div>

      {/* Slide navigation */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className="rounded-full transition-all duration-500" style={{
            width: i === active ? 40 : 10,
            height: 10,
            background: i === active ? 'linear-gradient(90deg, #D4AF37, #F4D76E)' : 'rgba(255,255,255,0.2)',
            boxShadow: i === active ? '0 0 12px rgba(212,175,55,0.4)' : 'none'
          }} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      {/* Side label */}
      <div className="absolute bottom-12 right-8 hidden lg:block z-20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[3px] text-white/30">0{active + 1}</span>
          <div className="w-8 h-px bg-white/20" />
          <span className="text-[10px] uppercase tracking-[3px] text-white/30">0{slides.length}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 2: VIDEO BG — Text mask reveal + floating stats
// ═══════════════════════════════════════════════════════════
function Hero2() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    // Text mask reveal (translateY from 100% inside overflow:hidden)
    tl.fromTo('.h2-mask-inner', { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' })
      .fromTo('.h2-fade', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.5')
      .fromTo('.h2-stat', { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.6)' }, '-=0.4');

    // Floating animation for stats
    gsap.utils.toArray<HTMLElement>('.h2-stat').forEach((stat, i) => {
      gsap.to(stat, {
        y: '+=8', duration: 2 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut',
        delay: 1.5 + i * 0.2
      });
    });

    // Scroll parallax
    gsap.to('.h2-content', {
      yPercent: -30, opacity: 0.5, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* Video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" poster="/images/hero/hero-slide-1.webp">
        <source src="https://res.cloudinary.com/diometfe9/video/upload/v1781723540/Working_on_ecommerce_store_backg__202606180012_pm2rtf.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(28,28,28,0.75) 0%, rgba(28,28,28,0.35) 50%, rgba(212,175,55,0.08) 100%)' }} />

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 /%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 /%3E%3C/svg%3E")',
      }} />

      <div className="h2-content relative z-10 text-center px-4 max-w-4xl">
        {/* Eyebrow */}
        <div className="h2-fade flex items-center justify-center gap-3 mb-6">
          <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
          <span className="text-xs tracking-[6px] uppercase font-bold" style={{ color: '#D4AF37' }}>Aura Living · Est. 2026</span>
          <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
        </div>

        {/* Masked title */}
        <h1 className="text-white font-bold mb-8" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(3rem, 10vw, 7.5rem)',
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          textShadow: '0 8px 40px rgba(0,0,0,0.5)'
        }}>
          <span className="block overflow-hidden"><span className="h2-mask-inner block">Beauty in</span></span>
          <span className="block overflow-hidden"><span className="h2-mask-inner block italic" style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4D76E 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>Every Detail</span></span>
        </h1>

        {/* Subtitle */}
        <p className="h2-fade text-white/60 text-lg sm:text-xl max-w-xl mx-auto mb-12">
          Discover handcrafted decor that transforms houses into homes.
        </p>

        {/* CTAs */}
        <div className="h2-fade flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/shop" className="px-10 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105 flex items-center justify-center gap-2 group" style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #C9A22E 50%, #B8941F 100%)',
            boxShadow: '0 8px 32px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}>
            Explore Collection
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="px-10 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2">
            <Play className="w-4 h-4" /> Watch Story
          </button>
        </div>

        {/* Floating stats */}
        <div className="h2-fade flex items-center justify-center gap-8 sm:gap-16">
          {[
            { num: '5K+', label: 'Happy Homes' },
            { num: '200+', label: 'Artisans' },
            { num: '4.8', label: 'Avg Rating', star: true },
          ].map((s) => (
            <div key={s.label} className="h2-stat text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {s.star && <Star className="w-4 h-4 fill-current" style={{ color: '#D4AF37' }} />}
                <p className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>{s.num}</p>
              </div>
              <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 3: SPLIT LAYOUT — Left text reveal + Right image clip
// ═══════════════════════════════════════════════════════════
function Hero3() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    // Left text: word-by-word reveal
    tl.fromTo('.h3-word', { opacity: 0, y: 40, rotateX: -90 }, {
      opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out'
    });

    // Right image: clip-path reveal from left
    tl.fromTo('.h3-img-clip', { clipPath: 'inset(0% 0% 0% 100%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.out'
    }, '-=0.8');

    // Floating cards
    tl.fromTo('.h3-card', { opacity: 0, y: 40, scale: 0.9 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.5)'
    }, '-=0.4');

    // Floating loop
    gsap.utils.toArray<HTMLElement>('.h3-card').forEach((card, i) => {
      gsap.to(card, { y: '+=12', duration: 2.5 + i * 0.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
    });

    // Parallax
    gsap.to('.h3-img', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }, { scope: ref });

  const words = ['Luxury', 'Living,', 'Reimagined.'];

  return (
    <div ref={ref} className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Left content */}
      <div className="relative z-10 w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-20" style={{ background: 'linear-gradient(90deg, rgba(250,248,245,0.95) 0%, rgba(250,248,245,0.8) 100%)' }}>
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-px" style={{ background: '#D4AF37' }} />
            <span className="text-xs tracking-[4px] uppercase font-bold" style={{ color: '#D4AF37' }}>Est. 2026 · Pakistan</span>
          </div>

          {/* Word-by-word title */}
          <h1 className="font-bold mb-8" style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: '#2C2C2C',
            perspective: '800px'
          }}>
            {words.map((word, i) => (
              <span key={i} className="h3-word inline-block mr-3" style={{
                background: i === 2 ? 'linear-gradient(135deg, #D4AF37, #C9A22E)' : 'none',
                WebkitBackgroundClip: i === 2 ? 'text' : 'border-box',
                WebkitTextFillColor: i === 2 ? 'transparent' : '#2C2C2C',
                backgroundClip: 'text'
              }}>{word}</span>
            ))}
          </h1>

          <p className="text-lg mb-10 max-w-md" style={{ color: '#5A5A5A' }}>
            Premium handcrafted decor for the discerning Pakistani home. Every piece, a work of art.
          </p>

          <div className="flex gap-4 mb-12">
            <Link href="/shop" className="px-8 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105 flex items-center gap-2 group" style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #C9A22E 50%, #B8941F 100%)',
              boxShadow: '0 8px 24px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}>
              Shop Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all hover:bg-[#D4AF37]/10 border flex items-center gap-2" style={{ borderColor: '#D4AF37', color: '#B8941F' }}>
              <Play className="w-4 h-4" /> Watch
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex gap-6">
            {[
              { icon: Truck, label: 'Free Shipping' },
              { icon: Banknote, label: 'COD' },
              { icon: ShieldCheck, label: '7-Day Returns' },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  <span className="text-xs font-medium" style={{ color: '#5A5A5A' }}>{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Image with clip-path reveal */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 h3-img-clip overflow-hidden">
        <div className="h3-img absolute inset-0" style={{
          backgroundImage: 'url(/images/hero/hero-slide-2.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '120%'
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(250,248,245,0.5) 0%, transparent 30%)' }} />

        {/* Floating product cards */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-10">
          {[
            { name: 'Hammered Brass Lamp', price: 'Rs. 9,999', img: '/images/products/hammered-brass-table-lamp-1.webp', badge: 'NEW' },
            { name: 'Hand-Blown Glass Vase', price: 'Rs. 4,499', img: '/images/products/handblown-glass-vase-amber-1.webp', badge: 'BESTSELLER' },
          ].map((p) => (
            <div key={p.name} className="h3-card flex items-center gap-3 p-3 rounded-xl backdrop-blur-xl" style={{
              background: 'rgba(255,253,247,0.15)',
              border: '1px solid rgba(212,175,55,0.25)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={p.img} alt={p.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide text-white" style={{ background: '#D4AF37' }}>{p.badge}</span>
                </div>
                <p className="text-xs text-white/95 font-medium mt-1">{p.name}</p>
                <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 4: DARK CINEMATIC — Animated gold rings + particle dust
// ═══════════════════════════════════════════════════════════
function Hero4() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo('.h4-mask-inner', { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' })
      .fromTo('.h4-fade', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.5');

    // Rotating rings
    gsap.to('.h4-ring-1', { rotation: 360, duration: 60, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
    gsap.to('.h4-ring-2', { rotation: -360, duration: 90, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
    gsap.to('.h4-ring-3', { rotation: 360, duration: 45, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });

    // Gold particle dust
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'h4-particle';
      particle.style.cssText = `position:absolute;width:${2 + Math.random() * 3}px;height:${2 + Math.random() * 3}px;border-radius:50%;background:rgba(212,175,55,${0.3 + Math.random() * 0.4});pointer-events:none;`;
      ref.current?.querySelector('.h4-particles')?.appendChild(particle);
      gsap.set(particle, { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
      gsap.to(particle, {
        y: `-=${100 + Math.random() * 200}`, opacity: 0,
        duration: 3 + Math.random() * 4, repeat: -1, delay: Math.random() * 5,
        ease: 'none', onRepeat: () => {
          gsap.set(particle, { y: window.innerHeight + 20, opacity: 0.6, x: Math.random() * window.innerWidth });
        }
      });
    }
  }, { scope: ref });

  return (
    <div ref={ref} className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center" style={{
      background: 'radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168,181,160,0.05) 0%, transparent 50%), #141414'
    }}>
      {/* Animated rings */}
      <div className="h4-ring-1 absolute rounded-full" style={{ width: '500px', height: '500px', border: '1px solid rgba(212,175,55,0.1)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      <div className="h4-ring-2 absolute rounded-full" style={{ width: '750px', height: '750px', border: '1px solid rgba(212,175,55,0.06)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      <div className="h4-ring-3 absolute rounded-full" style={{ width: '350px', height: '350px', border: '1px solid rgba(212,175,55,0.15)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      {/* Particles container */}
      <div className="h4-particles absolute inset-0 pointer-events-none" />

      {/* Glow */}
      <div className="absolute" style={{
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        filter: 'blur(40px)'
      }} />

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <div className="h4-fade flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-px" style={{ background: '#D4AF37' }} />
          <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
          <span className="text-xs tracking-[6px] uppercase font-bold" style={{ color: '#D4AF37' }}>Aura Living</span>
          <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
          <div className="w-8 h-px" style={{ background: '#D4AF37' }} />
        </div>

        <h1 className="text-white font-bold mb-8" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(3rem, 10vw, 7rem)',
          lineHeight: 0.95,
          letterSpacing: '-0.04em'
        }}>
          <span className="block overflow-hidden"><span className="h4-mask-inner block">Decor That</span></span>
          <span className="block overflow-hidden"><span className="h4-mask-inner block italic" style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4D76E 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>Tells a Story</span></span>
        </h1>

        <p className="h4-fade text-white/50 text-lg max-w-xl mx-auto mb-12">
          Each piece handcrafted by Pakistani artisans — warmth, character & timeless beauty.
        </p>

        <div className="h4-fade flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="px-10 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105 flex items-center justify-center gap-2 group" style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #C9A22E 50%, #B8941F 100%)',
            boxShadow: '0 0 40px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}>
            Explore Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/about" className="px-10 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:border-[#D4AF37]/50 hover:text-[#D4AF37] border border-white/15 backdrop-blur-sm">
            Our Artisans
          </Link>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 5: FULL-WIDTH IMAGE — Bottom anchored + parallax + scroll cue
// ═══════════════════════════════════════════════════════════
function Hero5() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax bg
    gsap.to('.h5-bg', {
      yPercent: 20, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 }
    });

    // Content reveal
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo('.h5-line', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.h5-mask-inner', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out' }, '-=0.5')
      .fromTo('.h5-fade', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.4');

    // Scroll cue bounce
    gsap.to('.h5-cue', { y: '+=10', duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // Top bar fade in
    gsap.fromTo('.h5-top', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }, { scope: ref });

  return (
    <div ref={ref} className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Parallax background */}
      <div className="h5-bg absolute inset-0" style={{
        backgroundImage: 'url(/images/hero/hero-slide-5.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '130%'
      }} />

      {/* Overlay — darker at bottom for text readability */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.92) 0%, rgba(28,28,28,0.3) 50%, rgba(28,28,28,0.6) 100%)' }} />

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 /%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 /%3E%3C/svg%3E")',
      }} />

      {/* Top bar */}
      <div className="h5-top absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 sm:px-12 py-6">
        <span className="text-white font-bold tracking-wider" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>AURA LIVING</span>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3 h-3 fill-current" style={{ color: '#D4AF37' }} />
          ))}
          <span className="text-xs text-white/50 ml-1">4.8 · 2,000+ reviews</span>
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-3xl">
          {/* Gold line */}
          <div className="h5-line w-20 h-0.5 mb-6 origin-left" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs tracking-[4px] uppercase font-bold" style={{ color: '#D4AF37' }}>Handcrafted in Pakistan</span>
          </div>

          {/* Masked title */}
          <h1 className="text-white font-bold mb-8" style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            textShadow: '0 8px 30px rgba(0,0,0,0.5)'
          }}>
            <span className="block overflow-hidden"><span className="h5-mask-inner block">Your Home,</span></span>
            <span className="block overflow-hidden"><span className="h5-mask-inner block italic" style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4D76E 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>Elevated.</span></span>
          </h1>

          <p className="h5-fade text-white/60 text-lg mb-10 max-w-lg">
            Premium lamps, vases, plants & decor — delivered to your door across Pakistan.
          </p>

          <div className="h5-fade flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="px-8 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105 flex items-center gap-2 group" style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #C9A22E 50%, #B8941F 100%)',
              boxShadow: '0 8px 24px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}>
              Shop Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/sale" className="px-8 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:bg-white/10 border border-white/20 backdrop-blur-sm">
              View Sale
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="h5-cue absolute bottom-6 right-8 hidden lg:flex flex-col items-center gap-2 z-20">
        <span className="text-[10px] uppercase tracking-[4px] text-white/30">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#D4AF37]/50 to-transparent" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function HeroDemosPage() {
  return (
    <div className="w-full">
      <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EDDA 100%)' }}>
        <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2C2C' }}>
          Hero Section Demos <span style={{ color: '#D4AF37' }}>v2</span>
        </h1>
        <p className="text-sm mb-2" style={{ color: '#5A5A5A' }}>5 award-winning hero designs with advanced animations</p>
        <p className="text-xs" style={{ color: '#8A8A8A' }}>Scroll down to see all 5 · Pick your favorite · Tell me the number</p>
        <div className="flex justify-center mt-6">
          <div className="w-16 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
        </div>
      </div>

      <DemoLabel number="1" title="Cinematic Slider" description="Clip-path reveal · Magnetic CTA · Ken Burns · Grain texture · Slide counter" />
      <Hero1 />
      <DemoLabel number="2" title="Video + Text Mask" description="Mask reveal (translateY 110%) · Floating stats · Grain · Parallax fade" />
      <Hero2 />
      <DemoLabel number="3" title="Split + Word Reveal" description="Word-by-word 3D rotateX · Clip-path image reveal · Floating product cards · Trust badges" />
      <Hero3 />
      <DemoLabel number="4" title="Dark + Gold Particles" description="30 animated gold dust particles · Rotating rings · Radial glow · Text mask" />
      <Hero4 />
      <DemoLabel number="5" title="Bottom + Parallax" description="Gold line grow · Text mask · Top rating bar · Scroll cue bounce · Parallax bg" />
      <Hero5 />

      <div className="py-16 px-4 text-center" style={{ background: '#141414' }}>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Which one did you like?</h2>
        <p className="text-sm text-white/40">Reply with a number (1-5) and I&apos;ll build it on the homepage.</p>
      </div>
    </div>
  );
}
