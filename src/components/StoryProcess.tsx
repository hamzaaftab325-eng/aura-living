'use client';

/**
 * StoryProcess — Craftsmanship process timeline.
 *
 * Design rationale (Senior Designer notes):
 * - NOT a quote (too static). Instead: a vertical timeline showing the
 *   craftsmanship journey — 01 Sourcing → 02 Carving → 03 Finishing → 04 Delivery.
 * - Each step has a numbered node, title, 2-line description, and a small image.
 * - Gold connector line runs vertically, nodes pulse gently.
 * - Alternating left/right layout on desktop (zigzag) — creates editorial rhythm.
 * - Stacked on mobile with line on left.
 *
 * Inspired by: Linear feature timeline, Apple process pages, Aesop story
 *
 * All CSS-class driven (.aura-story-proc-*). Zero inline styles.
 */

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    num: '01',
    title: 'Sourcing',
    desc: 'Raw sheesham from sustainable Punjab forests. Brass from Lahore foundries. Clay from Multan.',
    image: '/images/about-workshop.webp',
  },
  {
    num: '02',
    title: 'Carving',
    desc: 'Master carpenters shape each piece by hand — mortise-and-tenon joinery, no nails, no shortcuts.',
    image: '/images/hero/hero-slide-2.webp',
  },
  {
    num: '03',
    title: 'Finishing',
    desc: 'Hand-rubbed natural oils. Seven days of patient curing. Each piece signed and dated by its maker.',
    image: '/images/hero/hero-slide-4.webp',
  },
  {
    num: '04',
    title: 'Delivery',
    desc: 'White-glove delivery across Pakistan. COD available. 7-day returns, no questions asked.',
    image: '/images/hero/hero-slide-5.webp',
  },
];

export default function StoryProcess() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Header fades up
      gsap.fromTo(
        '.aura-story-proc-head',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        }
      );

      // Each step fades + slides in alternately
      gsap.utils.toArray<HTMLElement>('.aura-story-proc-step').forEach((step) => {
        const isLeft = step.classList.contains('aura-story-proc-step-left');
        gsap.fromTo(
          step,
          { opacity: 0, x: isLeft ? -40 : 40, y: 20 },
          {
            opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 82%', once: true },
          }
        );
      });

      // Connector line draws from top to bottom
      gsap.fromTo(
        '.aura-story-proc-line',
        { scaleY: 0 },
        {
          scaleY: 1, duration: 1.6, ease: 'power2.out', transformOrigin: 'top',
          scrollTrigger: { trigger: '.aura-story-proc-timeline', start: 'top 75%', once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="aura-story-proc">
      <div className="aura-story-proc-inner">
        {/* Header — left-aligned, editorial */}
        <div className="aura-story-proc-head">
          <span className="aura-story-proc-eyebrow">03 — The Craft</span>
          <h2 className="aura-story-proc-title">
            Four steps,<br />
            <span className="aura-story-proc-title-accent">forty hours.</span>
          </h2>
          <p className="aura-story-proc-sub">
            Every Aura Living piece passes through four hands before it reaches yours.
          </p>
        </div>

        {/* Timeline */}
        <div className="aura-story-proc-timeline">
          {/* Vertical connector line */}
          <div className="aura-story-proc-line" aria-hidden="true" />

          {STEPS.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={step.num}
                className={`aura-story-proc-step ${isLeft ? 'aura-story-proc-step-left' : 'aura-story-proc-step-right'}`}
              >
                {/* Node (numbered circle on the line) */}
                <div className="aura-story-proc-node">
                  <span className="aura-story-proc-node-num">{step.num}</span>
                </div>

                {/* Content card */}
                <div className="aura-story-proc-card">
                  <div className="aura-story-proc-card-img-wrap">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="aura-story-proc-card-img"
                      sizes="(max-width: 768px) 80px, 120px"
                    />
                  </div>
                  <div className="aura-story-proc-card-text">
                    <h3 className="aura-story-proc-card-title">{step.title}</h3>
                    <p className="aura-story-proc-card-desc">{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
