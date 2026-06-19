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
    title: 'Complimentary Shipping',
    description: 'Free doorstep delivery on every order above PKR 2,999, anywhere in Pakistan.',
    number: '01',
  },
  {
    icon: RotateCcw,
    title: 'Effortless Returns',
    description: 'Changed your mind? Enjoy 7-day no-questions-asked returns and exchanges.',
    number: '02',
  },
  {
    icon: Palette,
    title: 'Artisan Crafted',
    description: 'Every piece is shaped by skilled hands, carrying the soul of its maker.',
    number: '03',
  },
  {
    icon: MessageCircle,
    title: 'Always By Your Side',
    description: 'Real people, real answers — reach us on WhatsApp, phone, or email, day or night.',
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
   Feature Card — clean, modern, with subtle hover lift.
   No overlapping offsets — every card sits on the same baseline.
   ═══════════════════════════════════════════════════════════ */
interface FeatureCardProps {
  feature: (typeof features)[number];
}

function FeatureCard({ feature }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = feature.icon;

  return (
    <div
      className="group relative h-full rounded-2xl overflow-hidden transition-all duration-300 cursor-default"
      style={{
        background: '#FFFDF7',
        border: '1px solid #E8D5A3',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 16px 40px rgba(212, 175, 55, 0.18), 0 0 0 1px rgba(212, 175, 55, 0.25)'
          : '0 2px 12px rgba(0, 0, 0, 0.04)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gold top accent line that grows on hover */}
      <div
        className="absolute top-0 left-0 h-[3px] transition-all duration-500 ease-out"
        style={{
          width: isHovered ? '100%' : '0%',
          background: 'linear-gradient(90deg, #D4AF37, #E8D5A3)',
        }}
      />

      {/* Floating gold number in corner */}
      <span
        className="absolute top-4 right-5 select-none pointer-events-none z-0 transition-all duration-300"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '3.5rem',
          lineHeight: 1,
          color: isHovered ? 'rgba(212, 175, 55, 0.18)' : 'rgba(212, 175, 55, 0.08)',
        }}
      >
        {feature.number}
      </span>

      <div className="relative z-10 p-6 sm:p-7 flex flex-col h-full">
        {/* Icon in gold circle */}
        <div className="mb-5">
          <div
            className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: isHovered ? '#D4AF37' : '#F5EDDA',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              boxShadow: isHovered ? '0 8px 20px rgba(212, 175, 55, 0.35)' : 'none',
            }}
          >
            <IconComponent
              className="w-6 h-6 transition-colors duration-300"
              style={{ color: isHovered ? '#FFFFFF' : '#D4AF37' }}
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
          className="text-sm leading-relaxed flex-1"
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
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03 });

  // Enhanced stagger with y:50, stagger:0.1, start:'top 85%'
  const cardsRef = useGsapStagger<HTMLDivElement>({ y: 50, stagger: 0.1, duration: 0.6, start: 'top 85%' });

  // Scale on scroll
  const sectionContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sectionContentRef.current;
    if (!el) return;

    gsap.set(el, { scale: 0.97 });
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

  return (
    <section
      className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: '#F2EDE4' }}
    >
      <DotPattern />

      <div ref={sectionContentRef} className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14 sm:mb-16">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-px bg-[#D4AF37]/50" />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.25em]"
              style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
            >
              The Aura Promise
            </span>
            <div className="w-8 h-px bg-[#D4AF37]/50" />
          </div>

          <h2
            ref={headingRef}
            className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
          >
            Why Discerning Homes Choose Aura
          </h2>

          <p
            className="text-sm sm:text-base max-w-xl mx-auto mt-4"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
          >
            Four promises we live by, so your home can be lived in beautifully.
          </p>

          <div className="mt-6">
            <GoldDivider />
          </div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              feature={feature}
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
