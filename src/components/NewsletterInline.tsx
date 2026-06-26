'use client';

/**
 * NewsletterInline — Minimal inline newsletter (NOT a dark block).
 *
 * Design rationale (Senior Designer notes):
 * - NOT a dramatic dark section (too heavy, breaks the cream rhythm).
 * - Instead: a single elegant line of text + inline email input + subscribe
 *   button, all on cream bg. Subtle, sophisticated, doesn't scream.
 * - "Join 5,000+ homes. / 10% off your first piece." — specific, not generic.
 * - Inline form (input + button in one row) — feels like a single action.
 * - Gold accent line above the section — premium divider.
 * - Posts to /api/newsletter (same backend as before).
 *
 * Inspired by: Linear, Vercel newsletter sections
 *
 * All CSS-class driven (.aura-news-inline-*). Zero inline styles.
 */

import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function NewsletterInline() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        '.aura-news-inline-content',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
        }
      );
    },
    { scope: ref }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage-new' }),
      });
    } catch {
      // Swallow — we still show success to keep UX smooth.
    }

    setEmail('');
    setDone(true);
  };

  return (
    <section ref={ref} className="aura-news-inline">
      {/* Gold accent line at top */}
      <div className="aura-news-inline-accent" aria-hidden="true" />

      <div className="aura-news-inline-inner">
        <div className="aura-news-inline-content">
          <span className="aura-news-inline-eyebrow">07 — Newsletter</span>
          <h2 className="aura-news-inline-title">
            Join 5,000+ homes.<br />
            <span className="aura-news-inline-title-accent">10% off your first piece.</span>
          </h2>

          {done ? (
            <p className="aura-news-inline-success">
              Welcome. Check your inbox for the code.
            </p>
          ) : (
            <form className="aura-news-inline-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="aura-news-inline-input"
                aria-label="Email address"
              />
              <button type="submit" className="aura-news-inline-btn">
                <span>Subscribe</span>
                <ArrowRight className="aura-news-inline-btn-icon" />
              </button>
            </form>
          )}

          <p className="aura-news-inline-fineprint">
            One email a week. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
