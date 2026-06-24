'use client';

/**
 * TrustMarquee — Trust Demo 5 (chosen design).
 *
 * Dark band with an infinitely scrolling marquee of trust badges
 * (icon + label). Pure CSS class-driven — no inline styles.
 *
 * Two duplicate tracks side-by-side so the loop is seamless.
 */

import { useRef } from 'react';
import { Truck, Banknote, ShieldCheck, Star, Hammer, Leaf, Sparkles, Award } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Badge {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

const BADGES: Badge[] = [
  { icon: Truck, title: 'Free Shipping' },
  { icon: Banknote, title: 'Cash on Delivery' },
  { icon: ShieldCheck, title: '7-Day Returns' },
  { icon: Star, title: '4.8/5 Rating' },
  { icon: Hammer, title: 'Handcrafted' },
  { icon: Leaf, title: 'Sustainable' },
  { icon: Award, title: 'Premium Quality' },
  { icon: Sparkles, title: 'Made in Pakistan' },
];

export default function TrustMarquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Infinite horizontal scroll for the marquee track
      const track = ref.current?.querySelector('.aura-trust-marquee-track');
      if (track) {
        gsap.to(track, {
          x: '-50%',
          duration: 25,
          repeat: -1,
          ease: 'none',
        });
      }

      // Stagger fade-in on first reveal
      gsap.fromTo(
        '.aura-trust-marquee-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        }
      );
    },
    { scope: ref }
  );

  // Render the badge list 3x so the track is long enough for seamless looping
  const items = [...BADGES, ...BADGES, ...BADGES];

  return (
    <section ref={ref} className="aura-trust-marquee" aria-label="Why shop with Aura Living">
      <div className="aura-trust-marquee-track">
        {items.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="aura-trust-marquee-item">
              <Icon className="aura-trust-marquee-icon" />
              <span className="aura-trust-marquee-label">{b.title}</span>
              <span className="aura-trust-marquee-dot" aria-hidden="true">
                ·
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
