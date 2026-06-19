'use client';

import { useEffect, useRef } from 'react';
import {
  useGsapFadeIn,
  useGsapStagger,
  
  gsap,
  ScrollTrigger,
} from '@/hooks/useGsap';
import { GoldDivider, FloatingOrb } from '@/components/SVGDecorations';
import { Leaf, Hammer, Heart, ArrowRight, Sparkles, Package, Users, Truck, Store, Globe, Rocket, type LucideIcon } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PremiumButton from '@/components/ui/PremiumButton';


const values = [
  {
    icon: Leaf,
    title: 'Sustainability',
    description:
      'We are committed to eco-friendly packaging and sustainable sourcing practices. Every piece in our collection is thoughtfully selected to minimize environmental impact while maximizing beauty, ensuring that your home looks stunning without costing the earth.',
  },
  {
    icon: Hammer,
    title: 'Craftsmanship',
    description:
      'We proudly support local artisans across Pakistan, preserving centuries-old techniques that have been passed down through generations. Each handcrafted piece tells a story of dedication, skill, and cultural heritage that machine-made products simply cannot replicate.',
  },
  {
    icon: Heart,
    title: 'Community',
    description:
      'We are building a vibrant community of home decor enthusiasts who share our passion for creating beautiful spaces. From workshops to curated events, we bring people together to celebrate the art of making a house feel like home.',
  },
];

const statsData = [
  { number: 5000, suffix: '+', label: 'Happy Homes' },
  { number: 200, suffix: '+', label: 'Artisan Partners' },
  { number: 50, suffix: '+', label: 'Cities Delivered' },
  { number: 4.8, suffix: '', label: 'Average Rating' },
];

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
  highlight?: string; // optional stat or achievement callout
  isFuture?: boolean;
}

const timeline: TimelineEntry[] = [
  {
    year: '2020',
    title: 'The Seed is Planted',
    description:
      'Founded in a small Lahore workshop with three artisans, a borrowed kiln, and a vision to bring handcrafted Pakistani decor to every home.',
    icon: Sparkles,
    highlight: '3 artisans · 1 workshop',
  },
  {
    year: '2021',
    title: 'First Collection Launches',
    description:
      'Our debut collection of 50 handcrafted pieces goes live online. Within the first month, we fulfil 100 orders across Lahore and Karachi.',
    icon: Package,
    highlight: '50 pieces · 100 orders in 30 days',
  },
  {
    year: '2022',
    title: 'Artisan Network Grows',
    description:
      'We partner with 100+ artisans across Punjab, Sindh, and KPK, preserving centuries-old techniques and providing fair-trade income to craft communities.',
    icon: Users,
    highlight: '100+ artisan partners',
  },
  {
    year: '2023',
    title: 'Nationwide Reach',
    description:
      'Delivery expands to 50+ cities across Pakistan. We cross 2,000 homes served and launch our signature gold-rim planter that becomes a bestseller.',
    icon: Truck,
    highlight: '50+ cities · 2,000+ homes',
  },
  {
    year: '2024',
    title: 'Flagship Experience Center',
    description:
      'We open our first physical experience center in Gulberg, Lahore — a 2,000 sq ft space where customers can touch, feel, and experience every piece in person.',
    icon: Store,
    highlight: '2,000 sq ft · Gulberg, Lahore',
  },
  {
    year: '2025',
    title: 'Digital Transformation',
    description:
      'We launch our redesigned online platform with 500+ products, AI-powered search, and same-day delivery within Lahore. Mobile app goes live on iOS and Android.',
    icon: Globe,
    highlight: '500+ products · Mobile app launch',
  },
  {
    year: '2026',
    title: 'Going Global',
    description:
      'Expanding our collection with international shipping to the UAE, UK, and US. Launching the Aura Artisan Fund to support the next generation of Pakistani craftspeople.',
    icon: Rocket,
    highlight: 'International shipping · Artisan Fund',
    isFuture: true,
  },
];

/* ═══════════════════════════════════════════════════════════
   ChapterLabel — "Chapter 01" with gold accent line
   ═══════════════════════════════════════════════════════════ */
function ChapterLabel({ number }: { number: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const line = el.querySelector('.chapter-line') as HTMLElement;
    const text = el.querySelector('.chapter-text') as HTMLElement;

    gsap.set([line, text], { opacity: 0 });
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      onEnter: () => {
        gsap.to(text, { opacity: 1, duration: 0.5, ease: 'power2.out' });
        gsap.to(line, {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2,
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={ref} className="flex items-center gap-4 mb-6">
      <span
        className="chapter-text text-[#D4AF37] text-xs sm:text-sm tracking-[4px] uppercase font-medium"
        
      >
        Chapter {number}
      </span>
      <div
        className="chapter-line w-16 sm:w-24 h-px"
        style={{ backgroundColor: '#D4AF37' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AnimatedHeading — character-by-character reveal on scroll
   ═══════════════════════════════════════════════════════════ */
function AnimatedHeading({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const chars = text.split('');

    el.innerHTML = '';
    const spans: HTMLSpanElement[] = [];

    chars.forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.willChange = 'opacity, transform';
      el.appendChild(span);
      spans.push(span);
    });

    gsap.set(spans, { opacity: 0, y: 20 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      onEnter: () => {
        gsap.to(spans, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, [text]);

  return (
    <h2 ref={ref} className={className} style={style}>
      {text}
    </h2>
  );
}

/* ═══════════════════════════════════════════════════════════
   ParagraphReveal — line-by-line fade-in on scroll
   ═══════════════════════════════════════════════════════════ */
function ParagraphReveal({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    gsap.set(el, { opacity: 0, y: 20 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <p ref={ref} className={className} style={style}>
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════
   KenBurnsImage — image with slow zoom Ken Burns effect
   ═══════════════════════════════════════════════════════════ */
function KenBurnsImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current || !containerRef.current) return;
    const img = imgRef.current;
    const container = containerRef.current;

    gsap.set(img, { scale: 1 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const scale = 1 + progress * 0.08;
        gsap.set(img, { scale });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className || ''}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover will-change-transform"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DecorativeGoldLine — draws in on scroll between sections
   ═══════════════════════════════════════════════════════════ */
function DecorativeGoldLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const line = el.querySelector('.deco-line') as HTMLElement;
    const dot = el.querySelector('.deco-dot') as HTMLElement;

    gsap.set(line, { scaleX: 0, transformOrigin: 'center center' });
    gsap.set(dot, { scale: 0, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(line, { scaleX: 1, duration: 1, ease: 'power3.inOut' });
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          delay: 0.8,
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={ref} className="flex items-center justify-center gap-3 py-8 sm:py-12">
      <div className="w-8 sm:w-16 h-px bg-[#D4AF37]/40" />
      <div
        className="deco-line w-16 sm:w-32 h-px"
        style={{ backgroundColor: '#D4AF37' }}
      />
      <div
        className="deco-dot w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: '#D4AF37' }}
      />
      <div
        className="deco-line w-16 sm:w-32 h-px"
        style={{ backgroundColor: '#D4AF37' }}
      />
      <div className="w-8 sm:w-16 h-px bg-[#D4AF37]/40" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FloatingDots — decorative gold dots between sections
   ═══════════════════════════════════════════════════════════ */
function FloatingDots() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const dots = el.querySelectorAll('.float-dot');

    gsap.set(dots, { opacity: 0, y: 10 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(dots, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={ref} className="flex items-center justify-center gap-6 sm:gap-10 py-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="float-dot w-1 h-1 rounded-full"
          style={{ backgroundColor: '#D4AF37', opacity: 0.6 }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CornerOrnaments — animated corner ornaments on image frames
   ═══════════════════════════════════════════════════════════ */
function CornerOrnaments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const corners = el.querySelectorAll('.corner-el');

    gsap.set(corners, { scale: 0, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(corners, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(2)',
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      <div className="corner-el absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]/50" />
      <div className="corner-el absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]/50" />
      <div className="corner-el absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#D4AF37]/50" />
      <div className="corner-el absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37]/50" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CountUp — animates number from 0 to final value on scroll
   ═══════════════════════════════════════════════════════════ */
function CountUp({
  target,
  suffix,
  duration = 2,
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obj = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(obj, {
          val: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals) + (suffix || '');
          },
        });
      },
    });

    return () => trigger.kill();
  }, [target, suffix, duration, decimals]);

  return <span ref={ref}>0{suffix || ''}</span>;
}

/* ═══════════════════════════════════════════════════════════
   ValueCard — enhanced with gold left border and icon animation
   ═══════════════════════════════════════════════════════════ */
function ValueCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const border = borderRef.current;
    const iconWrap = iconRef.current;

    gsap.set(card, { opacity: 0, y: 30 });
    gsap.set(border, { scaleY: 0, transformOrigin: 'top center' });
    gsap.set(iconWrap, { scale: 0.8, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.15,
          ease: 'power3.out',
        });
        gsap.to(border, {
          scaleY: 1,
          duration: 0.8,
          delay: index * 0.15 + 0.3,
          ease: 'power3.out',
        });
        gsap.to(iconWrap, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.15 + 0.2,
          ease: 'back.out(2)',
        });
      },
    });

    return () => trigger.kill();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative rounded-xl p-5 sm:p-6 lg:p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(212,175,55,0.15)] overflow-hidden"
      style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
    >
      {/* Animated gold left border */}
      <div
        ref={borderRef}
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: '#D4AF37' }}
      />
      <div
        ref={iconRef}
        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}
      >
        <Icon className="w-7 h-7" style={{ color: '#D4AF37' }} />
      </div>
      <h3
        className="text-[#2C2C2C] text-xl sm:text-2xl font-semibold mb-4"
        
      >
        {title}
      </h3>
      <p
        className="text-[#5A5A5A] text-sm sm:text-base leading-relaxed"
        
      >
        {description}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TimelineItem — single milestone card
   Unified layout: connector on left, card on right (all breakpoints)
   No DOM duplication — card rendered once, CSS handles spacing
   ═══════════════════════════════════════════════════════════ */
function TimelineItem({
  item,
  index,
  isLast,
}: {
  item: TimelineEntry;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  useEffect(() => {
    if (!ref.current || !cardRef.current || !badgeRef.current) return;
    const badge = badgeRef.current;
    const card = cardRef.current;
    const line = lineRef.current;

    gsap.set([badge, card], { opacity: 0 });
    gsap.set(badge, { scale: 0 });
    gsap.set(card, { y: 30, opacity: 0 });
    if (line) gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(badge, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          delay: 0.1,
        });
        if (line) {
          gsap.to(line, {
            scaleY: 1,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.2,
          });
        }
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.3,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, [index]);

  return (
    <div ref={ref} className="relative flex items-stretch gap-4 sm:gap-6 lg:gap-8">
      {/* Center connector with icon badge */}
      <div className="flex flex-col items-center relative shrink-0">
        <div
          ref={badgeRef}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center z-10 shrink-0 transition-all duration-300 hover:scale-110"
          style={{ backgroundColor: item.isFuture ? '#FAF8F5' : '#D4AF37',
            border: item.isFuture
              ? '2px dashed #D4AF37'
              : '2px solid #D4AF37',
            boxShadow: item.isFuture
              ? 'none'
              : '0 4px 14px rgba(212,175,55,0.25)',
          }}
        >
          <Icon
            className="w-5 h-5 sm:w-6 sm:h-6"
            style={{ color: item.isFuture ? '#D4AF37' : '#FFFDF7' }}
          />
        </div>
        {!isLast && (
          <div
            ref={lineRef}
            className="w-0.5 flex-1 min-h-[40px] sm:min-h-[60px]"
            style={{ background: item.isFuture
                ? 'repeating-linear-gradient(to bottom, rgba(212,175,55,0.5) 0, rgba(212,175,55,0.5) 4px, transparent 4px, transparent 8px)'
                : 'linear-gradient(to bottom, rgba(212,175,55,0.4), rgba(212,175,55,0.12))',
            }}
          />
        )}
      </div>

      {/* Card — single instance, no duplication */}
      <div
        ref={cardRef}
        className="tl-card group flex-1 rounded-lg p-5 sm:p-6 mb-4 sm:mb-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] hover:-translate-y-1"
        style={{ backgroundColor: item.isFuture ? 'rgba(212,175,55,0.04)' : '#FFFDF7',
          border: item.isFuture
            ? '1px dashed rgba(212,175,55,0.4)'
            : '1px solid rgba(232,213,163,0.4)',
        }}
      >
        {/* Year + Upcoming badge */}
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span
            className="text-[#D4AF37] text-[28px] sm:text-[32px] lg:text-[40px] font-bold leading-none"
            
          >
            {item.year}
          </span>
          {item.isFuture && (
            <span
              className="text-[9px] uppercase tracking-[2px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(212,175,55,0.12)',
                color: '#D4AF37',
              }}
            >
              Upcoming
            </span>
          )}
        </div>

        {/* Title */}
        <h4
          className="text-[#2C2C2C] text-base sm:text-lg font-semibold mb-2"
          
        >
          {item.title}
        </h4>

        {/* Description */}
        <p
          className="text-[#5A5A5A] text-xs sm:text-sm leading-relaxed mb-3"
          
        >
          {item.description}
        </p>

        {/* Highlight stat badge */}
        {item.highlight && (
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-sm"
            style={{ backgroundColor: 'rgba(212,175,55,0.08)',
              color: '#D4AF37',
            }}
          >
            <Icon className="w-3 h-3" />
            {item.highlight}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ScrollProgressIndicator — thin gold line at top
   ═══════════════════════════════════════════════════════════ */
function ScrollProgressIndicator() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;
    const el = lineRef.current;

    gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        gsap.set(el, { scaleX: self.progress });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-40 pointer-events-none">
      <div
        ref={lineRef}
        className="h-full w-full"
        style={{ backgroundColor: '#D4AF37' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main AboutView Component
   ═══════════════════════════════════════════════════════════ */
export default function AboutView() {
  const setPage = useStore((state) => state.setPage);
  const heroBgRef = useRef<HTMLDivElement>(null);

  // Hero entrance with useGsapStagger
  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%',
  });

  // CTA section fade-in
  const ctaRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });

  // Parallax for hero background image - more dramatic
  useEffect(() => {
    if (!heroBgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(heroBgRef.current, {
        y: '25%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroBgRef.current?.parentElement,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroBgRef);
    return () => ctx.revert();
  }, []);

  // Chapter 1 - parallax image
  const chapter1ImgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chapter1ImgRef.current) return;
    const el = chapter1ImgRef.current;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: '-10%',
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Chapter 2 - parallax image (reversed)
  const chapter2ImgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chapter2ImgRef.current) return;
    const el = chapter2ImgRef.current;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: '-10%',
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Chapter 3 - parallax background
  const chapter3BgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chapter3BgRef.current) return;
    const el = chapter3BgRef.current;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: '15%',
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Chapter 1 text reveal
  const chapter1TextRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > *',
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    start: 'top 80%',
  });

  // Chapter 2 text reveal
  const chapter2TextRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > *',
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    start: 'top 80%',
  });

  // Chapter 3 text reveal
  const chapter3TextRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > *',
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    start: 'top 80%',
  });

  // Chapter 1 image slide in from left
  const chapter1ImgSlideRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chapter1ImgSlideRef.current) return;
    const el = chapter1ImgSlideRef.current;
    gsap.set(el, { opacity: 0, x: -60 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, []);

  // Chapter 2 image slide in from right
  const chapter2ImgSlideRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chapter2ImgSlideRef.current) return;
    const el = chapter2ImgSlideRef.current;
    gsap.set(el, { opacity: 0, x: 60 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div className="w-full" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
        <div
          ref={heroBgRef}
          className="absolute inset-0 -top-[10%] -bottom-[10%]"
          style={{ backgroundImage: 'url(/images/about-workshop.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background:
              'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.55) 50%, rgba(212,175,55,0.15) 100%)',
          }}
        />

        {/* Decorative floating orbs in hero */}
        <FloatingOrb size={300} top="10%" left="5%" delay={0} />
        <FloatingOrb size={200} top="60%" left="80%" delay={1.5} />

        <div
          ref={heroRef}
          className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8"
        >
          <span
            className="text-[#D4AF37] text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-4"
            
          >
            ABOUT AURA LIVING
          </span>
          <h1
            className="aura-hero-title text-white"
            
          >
            Our Story
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
          </div>
          <p
            className="text-white/80 text-sm sm:text-base mt-6 max-w-lg leading-relaxed"
            
          >
            Where heritage meets home, and every piece has a purpose.
          </p>
        </div>
      </section>

      {/* ═══════════════════ OPENING QUOTE ═══════════════════ */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative opening quote mark */}
          <div
            className="text-[#D4AF37] text-5xl sm:text-6xl md:text-7xl leading-none mb-2 sm:mb-4 select-none"
            
            aria-hidden="true"
          >
            &ldquo;
          </div>
          <blockquote
            className="text-[#2C2C2C] leading-relaxed"
            
          >
            We believe every home tells a story. Ours begins with the hands of artisans.
          </blockquote>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <GoldDivider />
          </div>
        </div>
      </section>

      <FloatingDots />

      {/* ═══════════════════ CHAPTER 1 — THE BEGINNING ═══════════════════ */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text Side */}
          <div ref={chapter1TextRef} className="flex flex-col gap-5">
            <ChapterLabel number="01" />
            <AnimatedHeading
              text="The Beginning"
              className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold leading-snug"
              
            />
            <ParagraphReveal
              className="text-[#5A5A5A] text-base leading-relaxed"
              
            >
              Aura Living was born from a deep-rooted passion for bringing
              warmth and elegance to every home in Pakistan. Founded in the
              heart of Lahore, we set out on a mission to curate a collection
              that transforms ordinary living spaces into sanctuaries of beauty
              and comfort.
            </ParagraphReveal>
            <ParagraphReveal
              className="text-[#5A5A5A] text-base leading-relaxed"
              
            >
              Our journey began with a simple belief: that every home deserves
              to reflect the personality and soul of the people who live in it.
              What started as a small dream in a modest workshop has grown into
              a movement — one that celebrates the hands that craft and the
              hearts that create.
            </ParagraphReveal>
          </div>

          {/* Image Side — slides from left */}
          <div ref={chapter1ImgSlideRef} className="relative flex items-center justify-center">
            <div
              className="absolute -inset-3 sm:-inset-4 rounded-sm"
              style={{ border: '2px solid #D4AF37', opacity: 0.4 }}
            />
            <div
              className="absolute -inset-1.5 sm:-inset-2 rounded-sm"
              style={{ border: '1px solid #D4AF37', opacity: 0.2 }}
            />
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm">
              <div ref={chapter1ImgRef} className="w-full h-full">
                <KenBurnsImage
                  src="/images/about-workshop.webp"
                  alt="Aura Living workshop where it all began"
                  className="w-full h-full"
                />
              </div>
              <CornerOrnaments />
            </div>
          </div>
        </div>
      </section>

      <DecorativeGoldLine />

      {/* ═══════════════════ CHAPTER 2 — THE ARTISANS ═══════════════════ */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image Side — slides from right (reversed layout) */}
          <div
            ref={chapter2ImgSlideRef}
            className="relative flex items-center justify-center order-2 lg:order-1"
          >
            <div
              className="absolute -inset-3 sm:-inset-4 rounded-sm"
              style={{ border: '2px solid #D4AF37', opacity: 0.4 }}
            />
            <div
              className="absolute -inset-1.5 sm:-inset-2 rounded-sm"
              style={{ border: '1px solid #D4AF37', opacity: 0.2 }}
            />
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm">
              <div ref={chapter2ImgRef} className="w-full h-full">
                <KenBurnsImage
                  src="/images/pages/lookbook-scene-1.webp"
                  alt="Artisans crafting beautiful pieces across Pakistan"
                  className="w-full h-full"
                />
              </div>
              <CornerOrnaments />
            </div>
          </div>

          {/* Text Side */}
          <div ref={chapter2TextRef} className="flex flex-col gap-5 order-1 lg:order-2">
            <ChapterLabel number="02" />
            <AnimatedHeading
              text="The Artisans"
              className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold leading-snug"
              
            />
            <ParagraphReveal
              className="text-[#5A5A5A] text-base leading-relaxed"
              
            >
              We travel across Pakistan to source the finest artisan pieces —
              from the intricate blue pottery of Multan to the delicate
              embroidery of Sindh, from the masterful woodwork of Chiniot to
              the vibrant truck art traditions of Punjab.
            </ParagraphReveal>
            <ParagraphReveal
              className="text-[#5A5A5A] text-base leading-relaxed"
              
            >
              Each item in our collection carries the fingerprints of its maker,
              a testament to the extraordinary skill and dedication of Pakistani
              craftsmen who have honed their art over generations. We don&apos;t
              just sell products — we share stories woven by hands that know no
              shortcuts.
            </ParagraphReveal>
          </div>
        </div>
      </section>

      <DecorativeGoldLine />

      {/* ═══════════════════ CHAPTER 3 — OUR PROMISE ═══════════════════ */}
      <section className="relative py-24 sm:py-32 md:py-40 overflow-hidden">
        {/* Parallax background */}
        <div
          ref={chapter3BgRef}
          className="absolute inset-0 -top-[15%] -bottom-[15%]"
          style={{ backgroundImage: 'url(/images/about-workshop.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background:
              'linear-gradient(180deg, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.75) 50%, rgba(44,44,44,0.85) 100%)',
          }}
        />

        {/* Content */}
        <div
          ref={chapter3TextRef}
          className="relative z-10 max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8"
        >
          <ChapterLabel number="03" />
          <AnimatedHeading
            text="Our Promise"
            className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-snug mb-6"
            
          />
          <ParagraphReveal
            className="text-white/80 text-base sm:text-lg leading-relaxed mb-6"
            
          >
            At Aura Living, we believe that supporting local artisans is not
            just good business — it is a responsibility. By providing fair
            wages and a platform for these talented individuals, we help
            preserve traditional Pakistani craftsmanship while empowering
            communities across the country.
          </ParagraphReveal>
          <ParagraphReveal
            className="text-white/80 text-base sm:text-lg leading-relaxed"
            
          >
            Every purchase you make directly contributes to sustaining these
            age-old crafts and the families behind them. Our curated collection
            is a harmonious blend of modern aesthetics and traditional Pakistani
            craftsmanship — a bridge between the old and the new, creating
            something truly timeless for your home.
          </ParagraphReveal>
          <div className="mt-8 flex justify-center">
            <div className="w-16 h-px bg-[#D4AF37]/60" />
            <div className="mx-3 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-16 h-px bg-[#D4AF37]/60" />
          </div>
        </div>
      </section>

      <FloatingDots />

      {/* ═══════════════════ VALUES SECTION ═══════════════════ */}
      <section
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#F5EDDA' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span
              className="text-[#D4AF37] text-xs sm:text-sm tracking-[3px] uppercase font-medium"
              
            >
              What We Stand For
            </span>
            <h2
              className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold mt-3"
              
            >
              Our Core Values
            </h2>
            <div className="mt-4 flex justify-center">
              <GoldDivider />
            </div>
          </div>

          {/* Enhanced values cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <ValueCard
                key={value.title}
                icon={value.icon}
                title={value.title}
                description={value.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS SECTION ═══════════════════ */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <GoldDivider />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {statsData.map((stat) => (
              <div key={stat.label} className="text-center py-6">
                <span
                  className="text-3xl sm:text-4xl md:text-5xl font-bold block mb-2"
                  style={{ color: '#D4AF37',
                  }}
                >
                  <CountUp
                    target={stat.number}
                    suffix={stat.suffix}
                    decimals={stat.number % 1 !== 0 ? 1 : 0}
                    duration={2}
                  />
                </span>
                <span
                  className="text-sm sm:text-base tracking-wide"
                  style={{ color: '#8A8A8A',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DecorativeGoldLine />

      {/* ═══════════════════ TIMELINE ═══════════════════ */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FAF8F5' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span
              className="text-[#D4AF37] text-xs sm:text-sm tracking-[3px] uppercase font-medium"
              
            >
              Our Journey
            </span>
            <h2
              className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold mt-3"
              
            >
              Milestones
            </h2>
            <p
              className="text-[#5A5A5A] text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed"
              
            >
              From a single workshop to a nationwide brand — every milestone
              represents a step closer to our vision.
            </p>
            <div className="mt-4 flex justify-center">
              <GoldDivider />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {timeline.map((item, index) => (
              <TimelineItem
                key={item.year}
                item={item}
                index={index}
                isLast={index === timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      <FloatingDots />

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: '#F5EDDA' }}
      >
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
          <h2
            className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            
          >
            Ready to Transform Your Space?
          </h2>
          <p
            className="text-[#5A5A5A] text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
            
          >
            Explore our curated collection of handcrafted home decor and bring
            the warmth of Aura Living into your home.
          </p>
          <PremiumButton variant="gold" onClick={() => setPage('shop')}>
            Shop Now
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </PremiumButton>
        </div>
      </section>
    </div>
  );
}
