'use client';

/**
 * CTAGoldSection — Gold background CTA, closing section of the homepage.
 *
 * Design rationale (Senior Designer notes):
 * - Replaces the newsletter section (newsletter lives in the footer).
 * - Gold background (#D4AF37) — bold, brand-forward, creates a warm closing
 *   moment after the cream/dark sections above.
 * - Left-aligned editorial copy — consistent with all other sections.
 * - Single primary CTA (dark charcoal on gold) + secondary text link.
 * - Subtle diagonal sheen animation for premium feel.
 * - Section tag: '07 — Begin' — closes the 01-07 sequence.
 *
 * All CSS-class driven (.aura-cta-gold-*). Zero inline styles.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function CTAGoldSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true },
      });

      tl.fromTo('.aura-cta-gold-eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      tl.fromTo('.aura-cta-gold-title', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3');
      tl.fromTo('.aura-cta-gold-sub', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
      tl.fromTo('.aura-cta-gold-actions', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="aura-cta-gold">
      {/* Diagonal sheen animation */}
      <div className="aura-cta-gold-sheen" aria-hidden="true" />

      <div className="aura-cta-gold-inner">
        <span className="aura-cta-gold-eyebrow">07 — Begin</span>

        <h2 className="aura-cta-gold-title">
          Your home<br />
          <span className="aura-cta-gold-title-accent">deserves this.</span>
        </h2>

        <p className="aura-cta-gold-sub">
          Forty-five handcrafted pieces. Six categories. One promise —
          everything is made by hand, signed by its maker, and built to outlive
          trends. COD across Pakistan.
        </p>

        <div className="aura-cta-gold-actions">
          <Link href="/shop" className="aura-cta-gold-btn-primary">
            <span>Shop the collection</span>
            <ArrowRight className="aura-cta-gold-btn-icon" />
          </Link>
          <Link href="/about" className="aura-cta-gold-btn-secondary">
            Our story
          </Link>
        </div>
      </div>
    </section>
  );
}
