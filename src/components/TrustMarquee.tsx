'use client';

/**
 * TrustMarquee — Trust Demo 5 (chosen design). 10/10 animations edition.
 *
 * Dark band with an infinitely scrolling marquee of trust badges.
 * Features:
 * - Solid #141414 background that bleeds full-width (no white corners)
 * - Top + bottom gold accent borders (1px gradient)
 * - GSAP-driven 3D entrance: items fly in with rotateY + scale + blur
 * - Scroll-velocity skew: track skews based on scroll speed for premium feel
 * - Per-item glow pulse: each icon has a staggered breathing animation
 * - Hover: 3D lift + 360° icon spin + label glow + drop shadow
 * - Track pauses on hover
 * - Reduced-motion safe
 *
 * Pure CSS classes — zero inline styles.
 */

import { useRef } from 'react';
import {
  Truck,
  Banknote,
  ShieldCheck,
  Star,
  Hammer,
  Leaf,
  Sparkles,
  Award,
} from 'lucide-react';
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
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1) Infinite horizontal scroll
      if (!reduce && trackRef.current) {
        gsap.to(trackRef.current, {
          x: '-50%',
          duration: 28,
          repeat: -1,
          ease: 'none',
        });
      }

      // 2) Dramatic 3D entrance — items fly in from below with rotation + blur
      if (!reduce) {
        gsap.set('.aura-trust-marquee-item', {
          opacity: 0,
          y: 40,
          rotateX: -65,
          scale: 0.7,
          filter: 'blur(8px)',
        });

        gsap.to('.aura-trust-marquee-item', {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.06,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            once: true,
          },
        });
      }

      // 3) Scroll-velocity skew — track skews based on how fast user scrolls
      if (!reduce) {
        let lastY = window.scrollY;
        let skewTimeout: ReturnType<typeof setTimeout>;
        const onScroll = () => {
          const currentY = window.scrollY;
          const velocity = (currentY - lastY) * 0.35;
          const clamped = Math.max(-8, Math.min(8, velocity));
          if (trackRef.current) {
            gsap.to(trackRef.current, {
              skewY: clamped * 0.4,
              duration: 0.15,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
          lastY = currentY;
          clearTimeout(skewTimeout);
          skewTimeout = setTimeout(() => {
            if (trackRef.current) {
              gsap.to(trackRef.current, {
                skewY: 0,
                duration: 0.4,
                ease: 'power3.out',
              });
            }
          }, 140);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
      }
    },
    { scope: ref }
  );

  // Render the badge list 3x so the track is long enough for seamless looping
  const items = [...BADGES, ...BADGES, ...BADGES];

  return (
    <section
      ref={ref}
      className="aura-trust-marquee"
      aria-label="Why shop with Aura Living"
    >
      <div ref={trackRef} className="aura-trust-marquee-track">
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
