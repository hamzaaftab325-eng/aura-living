'use client';

/**
 * BrandStory — Brand story section with parallax image + animated counters.
 *
 * Features:
 * - Two-column layout (image left, text right)
 * - Parallax background image (fixed attachment)
 * - Animated number counters (5000+, 200+, 4.8, 25+)
 * - Scroll-triggered reveal via GSAP
 */

import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hammer, Heart, Award, Leaf } from 'lucide-react';
import { GoldDivider } from '@/components/SVGDecorations';
import { useScrollReveal } from '@/hooks/useAnimations';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Stat {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

const stats: Stat[] = [
  { value: 5000, suffix: '+', label: 'Happy Homes' },
  { value: 200, suffix: '+', label: 'Artisan Partners' },
  { value: 4.8, suffix: '', label: 'Average Rating', decimals: 1 },
  { value: 25, suffix: '+', label: 'Cities Served' },
];

const values = [
  { icon: Hammer, title: 'Handcrafted', description: 'Every piece made by skilled Pakistani artisans' },
  { icon: Leaf, title: 'Sustainable', description: 'Ethically sourced materials, eco-friendly practices' },
  { icon: Award, title: 'Premium Quality', description: 'Rigorous quality checks on every product' },
  { icon: Heart, title: 'Made with Love', description: 'Designed in-house, crafted with passion' },
];

export default function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);
  const contentRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.8 });

  // Animate counters when they come into view
  useGSAP(
    () => {
      if (!countersRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const counters = countersRef.current.querySelectorAll('.aura-counter-value');

      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0');

        gsap.to(counter, {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: decimals === 0 ? 1 : 0.1 },
          onUpdate: function () {
            const value = parseFloat(counter.textContent || '0');
            counter.textContent = decimals > 0
              ? value.toFixed(decimals)
              : Math.round(value).toLocaleString('en-PK');
          },
          scrollTrigger: {
            trigger: countersRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-column: Image + Text */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Image with parallax */}
          <div className="relative">
            <div
              className="aura-parallax-img h-[400px] sm:h-[500px] lg:h-[600px] w-full"
              style={{ backgroundImage: 'url(/images/about-workshop.webp)' }}
            />
            {/* Gold accent border */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[var(--color-gold)]/30 rounded-tl-xl" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[var(--color-gold)]/30 rounded-br-xl" />
          </div>

          {/* Text content */}
          <div>
            <span className="text-xs tracking-[4px] uppercase font-semibold aura-text-gold mb-4 block">
              Our Story
            </span>
            <h2 className="aura-h2 mb-6">
              Crafted in Pakistan,<br />Loved Worldwide
            </h2>
            <div className="flex justify-start mb-6">
              <GoldDivider />
            </div>
            <p className="text-base leading-relaxed aura-text-secondary mb-4">
              Aura Living was born from a simple belief: that every home deserves pieces
              with soul. We work directly with artisans across Pakistan — from brass-workers
              in Lahore to ceramicists in Sindh — to bring you decor that tells a story.
            </p>
            <p className="text-base leading-relaxed aura-text-secondary mb-8">
              Each lamp, vase, and planter in our collection is handcrafted using traditional
              techniques passed down through generations. No mass production. No compromises.
              Just beautiful, lasting pieces made with pride.
            </p>

            {/* Values grid */}
            <div className="grid grid-cols-2 gap-4">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 aura-bg-gold-tint">
                      <Icon className="w-5 h-5 aura-text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5">{value.title}</p>
                      <p className="text-xs aura-text-secondary">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Animated counters */}
        <div ref={countersRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-[var(--color-gold-soft)]/30">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="aura-counter mb-2">
                <span
                  className="aura-counter-value"
                  data-target={stat.value}
                  data-decimals={stat.decimals || 0}
                >
                  0
                </span>
                <span>{stat.suffix}</span>
              </div>
              <p className="text-xs sm:text-sm uppercase tracking-wider aura-text-secondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
