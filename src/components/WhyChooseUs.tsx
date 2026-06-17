'use client';

import { useState, useEffect, useRef } from 'react';
import { useGsapStagger, useGsapBlurText, gsap, ScrollTrigger } from '@/hooks/useGsap';
import { Truck, RotateCcw, Palette, MessageCircle } from 'lucide-react';
import { GoldDivider } from '@/components/SVGDecorations';

/* ═══════════════════════════════════════════════════════════
   Feature Data
   ═══════════════════════════════════════════════════════════ */
const features = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'On all orders above PKR 2,999 across Pakistan',
    number: '01',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day hassle-free returns & exchanges',
    number: '02',
  },
  {
    icon: Palette,
    title: 'Handcrafted',
    description: 'Artisan-made with love & attention to detail',
    number: '03',
  },
  {
    icon: MessageCircle,
    title: '24/7 Support',
    description: 'WhatsApp & phone support always available',
    number: '04',
  },
];

/* ═══════════════════════════════════════════════════════════
   SVG Dot Pattern — subtle background overlay (static)
   ═══════════════════════════════════════════════════════════ */
function DotPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dot-pattern"
          x="0"
          y="0"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="0.8" fill="rgba(212, 175, 55, 0.12)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   Feature Card — Enhanced hover:
   - Pulsing gold glow effect
   - Icon rotates (5deg) and scales up on hover
   - Card lifts and adds gold shadow
   ═══════════════════════════════════════════════════════════ */
interface FeatureCardProps {
  feature: (typeof features)[number];
  offsetY: number;
}

function FeatureCard({ feature, offsetY }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const IconComponent = feature.icon;

  useEffect(() => { setMounted(true); }, []);

  // Only apply offsetY after mount to avoid hydration mismatch
  const effectiveOffset = mounted ? offsetY : 0;

  return (
    <div
      className="relative"
      style={{ marginTop: `${effectiveOffset}px` }}
    >
      {/* Floating gold number behind the card */}
      <span
        className="absolute -top-6 -right-2 sm:-top-8 sm:-right-4 select-none pointer-events-none z-0"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '4rem',
          lineHeight: 1,
          color: 'rgba(212, 175, 55, 0.12)',
        }}
      >
        {feature.number}
      </span>

      <div
        className="relative z-10 p-6 sm:p-8 rounded-xl cursor-default overflow-hidden transition-all duration-350"
        style={{
          background: 'rgba(255, 253, 247, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderLeft: '4px solid #D4AF37',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: isHovered
            ? '0 12px 40px rgba(212, 175, 55, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.3), 0 0 20px rgba(212,175,55,0.15)'
            : '0 4px 20px rgba(0,0,0,0.05)',
          animation: isHovered ? 'pulseGoldGlow 2s ease-in-out infinite' : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gold glow background on hover */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-400"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Icon in gold circle — rotates 5deg and scales up on hover */}
        <div className="relative mb-5">
          <div
            className="absolute -inset-2 rounded-full pointer-events-none transition-all duration-400"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
              opacity: isHovered ? 1 : 0.4,
              transform: isHovered ? 'scale(1.15)' : 'scale(1)',
            }}
          />
          <div
            className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-400"
            style={{
              backgroundColor: '#F5EDDA',
              transform: isHovered
                ? 'rotate(5deg) scale(1.1)'
                : 'rotate(0deg) scale(1)',
            }}
          >
            <IconComponent
              className="w-5 h-5 transition-all duration-300"
              style={{
                color: '#D4AF37',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          </div>
        </div>

        <h3
          className="text-lg sm:text-xl font-bold mb-2 transition-colors duration-300"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: isHovered ? '#D4AF37' : '#2C2C2C',
          }}
        >
          {feature.title}
        </h3>

        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main WhyChooseUs Component
   ═══════════════════════════════════════════════════════════ */
export default function WhyChooseUs() {
  // GSAP blur text for section heading
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.8, stagger: 0.06 });

  // Enhanced stagger with y:50, stagger:0.1, start:'top 85%'
  const cardsRef = useGsapStagger<HTMLDivElement>({ y: 50, stagger: 0.1, duration: 0.6, start: 'top 85%' });

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scale on scroll
  const sectionContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sectionContentRef.current;
    if (!el) return;

    gsap.set(el, { scale: 0.95 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, { scale: 1, duration: 1, ease: 'power3.out' });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const getOffsetY = (i: number): number => {
    // Staggered offsets only on desktop — FeatureCard handles hydration safety
    if (!isDesktop) return 0;
    const offsets = [0, -32, 20, -24];
    return offsets[i] ?? 0;
  };

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: '#F2EDE4' }}
    >
      <DotPattern />

      <div ref={sectionContentRef} className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
          >
            Why Choose Aura Living
          </h2>
          <div className="mt-4">
            <GoldDivider />
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              feature={feature}
              offsetY={getOffsetY(i)}
            />
          ))}
        </div>

        {/* Simple CSS wavy divider at bottom */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-2">
            <div className="w-20 h-px bg-[#D4AF37]/30" />
            <div className="w-2 h-2 rotate-45 border border-[#D4AF37]/30" />
            <div className="w-20 h-px bg-[#D4AF37]/30" />
            <div className="w-2 h-2 rotate-45 border border-[#D4AF37]/30" />
            <div className="w-20 h-px bg-[#D4AF37]/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
