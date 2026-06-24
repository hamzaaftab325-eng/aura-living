'use client';

/**
 * Hero Demos — 5 different full-width hero designs.
 * Visit /hero-demos to see all 5 and pick your favorite.
 * Each section is separated by a label banner.
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Play, Star } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const heroImages = [
  '/images/hero/hero-slide-1.webp',
  '/images/hero/hero-slide-2.webp',
  '/images/hero/hero-slide-3.webp',
];

function DemoLabel({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="py-6 px-4 bg-[var(--surface-dark)] text-center">
      <p className="text-xs uppercase tracking-[4px] aura-text-gold mb-2">Demo {number}</p>
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      <p className="text-sm text-white/50">{description}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 1: Cinematic Slider with Ken Burns + Text Reveal
// ═══════════════════════════════════════════════════════════
function Hero1() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('.hero1-text').forEach((el: HTMLElement) => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {heroImages.map((img, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-[1200ms]" style={{ opacity: i === active ? 1 : 0 }}>
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: i === active ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 5s ease-out'
          }} />
        </div>
      ))}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.75) 0%, rgba(44,44,44,0.4) 50%, rgba(212,175,55,0.15) 100%)' }} />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="hero1-text flex items-center gap-3 mb-6">
          <div className="w-12 h-px bg-[var(--color-gold)]/60" />
          <Sparkles className="w-5 h-5 text-[var(--color-gold)]" />
          <span className="text-xs tracking-[4px] uppercase text-white/80">New Collection 2026</span>
          <div className="w-12 h-px bg-[var(--color-gold)]/60" />
        </div>

        <h1 className="hero1-text text-white font-bold text-center mb-6" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          textShadow: '0 4px 30px rgba(0,0,0,0.5)'
        }}>
          Where Comfort<br />Meets <span style={{ color: '#D4AF37' }}>Style</span>
        </h1>

        <p className="hero1-text text-white/70 text-lg max-w-xl mb-10" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          Handcrafted home decor for the modern Pakistani home. Premium quality, delivered nationwide.
        </p>

        <div className="hero1-text flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="px-8 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105 hover:shadow-2xl" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>
            Shop Collection
          </Link>
          <Link href="/about" className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold uppercase tracking-wider text-sm transition-all hover:border-white/60 hover:bg-white/5">
            Our Story
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className="rounded-full transition-all duration-400" style={{
            width: i === active ? 32 : 8,
            height: 8,
            background: i === active ? '#D4AF37' : 'rgba(255,255,255,0.3)'
          }} />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 2: Video Background with Overlay + Scroll Reveal
// ═══════════════════════════════════════════════════════════
function Hero2() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.hero2-element', { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.3
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/images/hero/hero-slide-1.webp"
      >
        <source src="https://res.cloudinary.com/diometfe9/video/upload/v1781723540/Working_on_ecommerce_store_backg__202606180012_pm2rtf.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.7) 0%, rgba(44,44,44,0.4) 50%, rgba(212,175,55,0.1) 100%)' }} />

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <div className="hero2-element flex items-center justify-center gap-2 mb-6">
          <span className="text-xs tracking-[4px] uppercase text-[var(--color-gold)] font-bold">Aura Living</span>
        </div>

        <h1 className="hero2-element text-white font-bold mb-6" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          lineHeight: 1.05,
          textShadow: '0 4px 30px rgba(0,0,0,0.6)'
        }}>
          Beauty in Every<br /><span style={{ color: '#D4AF37' }}>Detail</span>
        </h1>

        <p className="hero2-element text-white/70 text-lg max-w-xl mx-auto mb-10">
          Discover handcrafted decor that transforms houses into homes.
        </p>

        <div className="hero2-element flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="px-8 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', boxShadow: '0 8px 32px rgba(212,175,55,0.4)' }}>
            Explore Collection
          </Link>
        </div>

        <div className="hero2-element mt-12 flex items-center justify-center gap-8">
          {[
            { num: '5K+', label: 'Happy Homes' },
            { num: '200+', label: 'Artisans' },
            { num: '4.8★', label: 'Rating' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[var(--color-gold)]" style={{ fontFamily: 'Playfair Display, serif' }}>{s.num}</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 3: Full-width Image with Side Text + Floating Cards
// ═══════════════════════════════════════════════════════════
function Hero3() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.hero3-text', { opacity: 0, x: -50 }, {
      opacity: 1, x: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2
    });
    gsap.fromTo('.hero3-card', { opacity: 0, y: 30, scale: 0.9 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.4)', delay: 0.6
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="relative w-full min-h-screen overflow-hidden flex items-center">
      {/* Full-width bg */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'url(/images/hero/hero-slide-2.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right'
      }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.5) 50%, transparent 100%)' }} />

      {/* Left content */}
      <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-20 py-20">
        <div className="hero3-text flex items-center gap-3 mb-6">
          <div className="w-12 h-px bg-[var(--color-gold)]" />
          <span className="text-xs tracking-[4px] uppercase text-[var(--color-gold)] font-bold">Est. 2026</span>
        </div>

        <h1 className="hero3-text text-white font-bold mb-6" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(3rem, 7vw, 5.5rem)',
          lineHeight: 1,
          letterSpacing: '-0.03em'
        }}>
          Luxury Living,<br /><span style={{ color: '#D4AF37' }}>Reimagined.</span>
        </h1>

        <p className="hero3-text text-white/70 text-lg mb-8 max-w-md">
          Premium handcrafted decor for the discerning Pakistani home. Every piece, a work of art.
        </p>

        <div className="hero3-text flex gap-4 mb-12">
          <Link href="/shop" className="px-8 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>
            Shop Now
          </Link>
          <button className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold uppercase tracking-wider text-sm transition-all hover:border-white/60 flex items-center gap-2">
            <Play className="w-4 h-4" /> Watch
          </button>
        </div>

        {/* Floating product cards */}
        <div className="flex gap-4">
          {[
            { name: 'Brass Lamp', price: 'Rs. 9,999', img: '/images/products/hammered-brass-table-lamp-1.webp' },
            { name: 'Glass Vase', price: 'Rs. 4,499', img: '/images/products/handblown-glass-vase-amber-1.webp' },
            { name: 'Planter', price: 'Rs. 3,999', img: '/images/products/concrete-geometric-planter-1.webp' },
          ].map((p) => (
            <div key={p.name} className="hero3-card p-3 rounded-xl backdrop-blur-md flex items-center gap-3" style={{ background: 'rgba(255,253,247,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={p.img} alt={p.name} width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-white/90 font-medium">{p.name}</p>
                <p className="text-sm text-[var(--color-gold)] font-bold">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 4: Gradient Mesh + Centered Text + Animated Rings
// ═══════════════════════════════════════════════════════════
function Hero4() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.hero4-element', { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.3
    });
    gsap.to('.hero4-ring', {
      rotation: 360, duration: 60, repeat: -1, ease: 'none',
      transformOrigin: '50% 50%'
    });
    gsap.to('.hero4-ring-2', {
      rotation: -360, duration: 80, repeat: -1, ease: 'none',
      transformOrigin: '50% 50%'
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168,181,160,0.06) 0%, transparent 50%), #1a1a1a' }}>
      {/* Animated rings */}
      <div className="hero4-ring absolute w-[600px] h-[600px] rounded-full border border-[var(--color-gold)]/10" />
      <div className="hero4-ring-2 absolute w-[800px] h-[800px] rounded-full border border-[var(--color-gold)]/5" />
      <div className="hero4-ring absolute w-[400px] h-[400px] rounded-full border border-[var(--color-gold)]/15" />

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <div className="hero4-element flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-px bg-[var(--color-gold)]" />
          <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
          <span className="text-xs tracking-[4px] uppercase text-[var(--color-gold)] font-bold">Aura Living</span>
          <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
          <div className="w-8 h-px bg-[var(--color-gold)]" />
        </div>

        <h1 className="hero4-element text-white font-bold mb-6" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(3rem, 10vw, 7rem)',
          lineHeight: 1,
          letterSpacing: '-0.04em'
        }}>
          Decor That<br /><span style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C547, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Tells a Story</span>
        </h1>

        <p className="hero4-element text-white/60 text-lg max-w-xl mx-auto mb-10">
          Each piece is handcrafted by Pakistani artisans, bringing warmth, character, and timeless beauty to your home.
        </p>

        <div className="hero4-element flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop" className="px-8 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', boxShadow: '0 0 40px rgba(212,175,55,0.3)' }}>
            Explore Collection
          </Link>
          <Link href="/about" className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold uppercase tracking-wider text-sm transition-all hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]">
            Our Artisans
          </Link>
        </div>

        {/* Scroll cue */}
        <div className="hero4-element mt-16 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[3px] text-white/30">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[var(--color-gold)]/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEMO 5: Full-width Image with Bottom Content + Parallax
// ═══════════════════════════════════════════════════════════
function Hero5() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo('.hero5-bg', { yPercent: 0 }, {
      yPercent: 20, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.fromTo('.hero5-content', { opacity: 0, y: 80 }, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Parallax bg */}
      <div className="hero5-bg absolute inset-0" style={{
        backgroundImage: 'url(/images/hero/hero-slide-5.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '120%'
      }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(44,44,44,0.9) 0%, rgba(44,44,44,0.3) 50%, rgba(44,44,44,0.5) 100%)' }} />

      {/* Top nav-style bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 sm:px-12 py-6">
        <span className="text-white font-bold tracking-wider" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem' }}>AURA LIVING</span>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3 h-3 fill-[var(--color-gold)] text-[var(--color-gold)]" />
          ))}
          <span className="text-xs text-white/60 ml-1">4.8 (2,000+ reviews)</span>
        </div>
      </div>

      {/* Bottom content */}
      <div className="hero5-content absolute bottom-0 left-0 right-0 z-10 pb-16 px-6 sm:px-12 lg:px-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-px bg-[var(--color-gold)]" />
            <span className="text-xs tracking-[4px] uppercase text-[var(--color-gold)] font-bold">Handcrafted in Pakistan</span>
          </div>

          <h1 className="text-white font-bold mb-6" style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}>
            Your Home,<br /><span style={{ color: '#D4AF37' }}>Elevated.</span>
          </h1>

          <p className="text-white/70 text-lg mb-8 max-w-lg">
            Premium lamps, vases, plants, and decor — delivered to your door across Pakistan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="px-8 py-4 rounded-full text-white font-semibold uppercase tracking-wider text-sm transition-all hover:scale-105 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8941F)', boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}>
              Shop Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/sale" className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold uppercase tracking-wider text-sm transition-all hover:bg-white/15">
              View Sale Items
            </Link>
          </div>
        </div>
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
      {/* Intro banner */}
      <div className="py-12 px-4 text-center bg-[var(--surface-page)]">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Hero Section Demos
        </h1>
        <p className="text-sm aura-text-secondary">
          Scroll down to see 5 different hero designs. Pick your favorite and tell me which one.
        </p>
        <div className="flex justify-center mt-4">
          <div className="w-12 h-px bg-[var(--color-gold)]" />
        </div>
      </div>

      <DemoLabel number="1" title="Cinematic Slider" description="Auto-rotating slides with Ken Burns zoom + centered text" />
      <Hero1 />

      <DemoLabel number="2" title="Video Background" description="Cloudinary video + centered text + inline stats" />
      <Hero2 />

      <DemoLabel number="3" title="Side Text + Floating Cards" description="Left-aligned text with floating product cards" />
      <Hero3 />

      <DemoLabel number="4" title="Gradient Mesh + Rings" description="Dark bg with animated gold rings + gradient text" />
      <Hero4 />

      <DemoLabel number="5" title="Bottom Content + Parallax" description="Full-width image, content at bottom, parallax scroll" />
      <Hero5 />

      {/* Footer */}
      <div className="py-12 px-4 text-center bg-[var(--surface-dark)]">
        <h2 className="text-xl font-bold text-white mb-2">Which one did you like?</h2>
        <p className="text-sm text-white/50">Tell me the number (1-5) and I&apos;ll build it perfectly on the homepage.</p>
      </div>
    </div>
  );
}
