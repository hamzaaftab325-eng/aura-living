'use client';

/**
 * TestimonialsEditorial — Single editorial quote + stat cards.
 *
 * Design rationale (Senior Designer notes):
 * - NOT a carousel of identical cards (AI tell). Instead: ONE huge quote
 *   centered, with customer name + location + product they bought.
 * - Below: 3 stat cards (4.8/5 rating · 2,000+ reviews · 5,000+ homes).
 * - Prev/next arrows to cycle quotes — minimal, not busy.
 * - Quote uses large italic Playfair — typography carries the design.
 * - Cream bg, generous whitespace, editorial feel.
 *
 * Inspired by: Aesop, The Citizenry, MR PORTER editorial
 *
 * All CSS-class driven (.aura-test-ed-*). Zero inline styles.
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TESTIMONIALS = [
  {
    quote: "The brass lamp has become the centerpiece of our drawing room. Every visitor comments on it — best decor purchase we've made in years.",
    name: "Nadia Sheikh",
    location: "Islamabad",
    product: "Brass Pendant Lamp",
  },
  {
    quote: "Every brass piece I've ordered arrives with the kind of hand-finishing you can actually feel. The artisan craftsmanship is visible in every detail.",
    name: "Omar Farooq",
    location: "Karachi",
    product: "Hammered Brass Bowl",
  },
  {
    quote: "I've been a customer for 2 years now and the quality has never dipped. Each piece feels like an heirloom.",
    name: "Amina Butt",
    location: "Lahore",
    product: "Sheesham Console",
  },
  {
    quote: "Honestly the best home decor store in Pakistan. The pieces feel curated, not mass-produced.",
    name: "Usman Tariq",
    location: "Multan",
    product: "Ceramic Vase Set",
  },
];

const STATS = [
  { num: "4.8", label: "Average rating", suffix: "/5" },
  { num: "2,000", label: "Verified reviews", suffix: "+" },
  { num: "5,000", label: "Pakistani homes", suffix: "+" },
];

export default function TestimonialsEditorial() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const next = () => setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const t = TESTIMONIALS[active];

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        '.aura-test-ed-head',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        }
      );

      gsap.fromTo(
        '.aura-test-ed-quote',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.aura-test-ed-quote', start: 'top 82%', once: true },
        }
      );

      gsap.fromTo(
        '.aura-test-ed-stat',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.aura-test-ed-stats', start: 'top 85%', once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="aura-test-ed">
      <div className="aura-test-ed-inner">
        {/* Header */}
        <div className="aura-test-ed-head">
          <span className="aura-test-ed-eyebrow">06 — Reviews</span>
          <h2 className="aura-test-ed-title">
            From real<br />
            <span className="aura-test-ed-title-accent">Pakistani homes.</span>
          </h2>
        </div>

        {/* Single huge quote */}
        <div className="aura-test-ed-quote-wrap">
          <Quote className="aura-test-ed-quote-icon" />
          <blockquote className="aura-test-ed-quote" key={active}>
            {t.quote}
          </blockquote>
          <div className="aura-test-ed-author">
            <div className="aura-test-ed-author-line" />
            <div className="aura-test-ed-author-info">
              <p className="aura-test-ed-author-name">{t.name}</p>
              <p className="aura-test-ed-author-loc">{t.location} · bought {t.product}</p>
            </div>
          </div>

          {/* Arrows + counter */}
          <div className="aura-test-ed-nav">
            <button onClick={prev} className="aura-test-ed-arrow" aria-label="Previous">
              <ChevronLeft className="aura-test-ed-arrow-icon" />
            </button>
            <span className="aura-test-ed-counter">
              0{active + 1} <span className="aura-test-ed-counter-sep">/</span> 0{TESTIMONIALS.length}
            </span>
            <button onClick={next} className="aura-test-ed-arrow" aria-label="Next">
              <ChevronRight className="aura-test-ed-arrow-icon" />
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="aura-test-ed-stats">
          {STATS.map((s) => (
            <div key={s.label} className="aura-test-ed-stat">
              <p className="aura-test-ed-stat-num">
                {s.num}<span className="aura-test-ed-stat-suffix">{s.suffix}</span>
              </p>
              <p className="aura-test-ed-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
