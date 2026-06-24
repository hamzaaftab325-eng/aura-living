'use client';

/**
 * CTAGoldBanner — CTA Demo 2 (chosen design).
 *
 * Full-width gold gradient banner with masked word reveal animation.
 * White heading "Your Dream Home Starts Here" + white pill button.
 *
 * All styling lives in modern.css (.aura-cta-gold-* classes).
 * Zero inline styles — fully CSS-driven.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WORDS = ['Your', 'Dream', 'Home', 'Starts', 'Here'];

export default function CTAGoldBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
      });

      tl.fromTo(
        '.aura-cta-gold-word',
        { opacity: 0, y: 50, rotateX: -80 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );

      tl.fromTo(
        '.aura-cta-gold-fade',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
        '-=0.3'
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="aura-cta-gold">
      <div className="aura-cta-gold-inner">
        <h2 className="aura-cta-gold-title">
          {WORDS.map((w, i) => (
            <span key={i} className="aura-cta-gold-word">
              {w}
            </span>
          ))}
        </h2>
        <p className="aura-cta-gold-sub aura-cta-gold-fade">
          Explore our full collection of handcrafted decor, delivered to your door.
        </p>
        <Link
          href="/shop"
          className="aura-cta-gold-btn aura-cta-gold-fade"
          aria-label="Browse the Aura Living collection"
        >
          Browse Collection
          <ArrowRight className="aura-cta-gold-btn-icon" />
        </Link>
      </div>
    </section>
  );
}
