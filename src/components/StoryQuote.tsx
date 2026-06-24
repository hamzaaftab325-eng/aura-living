'use client';

/**
 * StoryQuote — Chosen brand story design (Demo 5).
 *
 * Features:
 * - Big decorative quote mark (scales + rotates in)
 * - Word-by-word text mask reveal (overflow hidden + translateY)
 * - Founder avatar + name
 * - 4 values grid (2 cols mobile, 4 cols desktop)
 * - Subtle bg parallax
 * - GSAP scroll-triggered staggered animations
 *
 * ALL styling via CSS classes (modern.css). Zero inline styles.
 */

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Hammer, Heart, Award, Leaf } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const values = [
  { icon: Hammer, title: 'Handcrafted' },
  { icon: Leaf, title: 'Sustainable' },
  { icon: Award, title: 'Premium Quality' },
  { icon: Heart, title: 'Made with Love' },
];

const quoteWords = [
  'We', "don't", 'just', 'sell', 'decor.', 'We', 'share', 'the',
  'soul', 'of', 'Pakistani', 'craftsmanship', '—', 'one', 'handcrafted',
  'piece', 'at', 'a', 'time.'
];

export default function StoryQuote() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 65%' },
    });

    // Quote mark scales + rotates in
    tl.fromTo(
      '.aura-story-quote-mark',
      { scale: 0, rotation: -45, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 0.2, duration: 0.8, ease: 'back.out(1.5)' }
    );

    // Word-by-word text mask reveal
    tl.fromTo(
      '.aura-story-quote-word',
      { yPercent: 110 },
      { yPercent: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out' },
      '-=0.3'
    );

    // Author info fades in
    tl.fromTo(
      '.aura-story-author',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    );

    // Values pop in
    tl.fromTo(
      '.aura-story-value',
      { opacity: 0, scale: 0.7, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)' },
      '-=0.2'
    );

    // CTA
    tl.fromTo(
      '.aura-story-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.2'
    );

    // Subtle bg parallax
    gsap.to('.aura-story-quote-bg', {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="aura-story-quote-section">
      {/* Background */}
      <div
        className="aura-story-quote-bg"
        style={{ backgroundImage: 'url(/images/about-workshop.webp)' }}
      />

      <div className="aura-story-quote-inner">
        {/* Quote mark */}
        <div className="aura-story-quote-mark">"</div>

        {/* Blockquote with word mask reveal */}
        <blockquote className="aura-story-blockquote">
          {quoteWords.map((word, i) => (
            <span key={i} className="aura-story-quote-word-wrap">
              <span
                className={`aura-story-quote-word ${word === 'soul' ? 'aura-story-quote-accent' : ''}`}
              >
                {word}
              </span>
            </span>
          ))}
        </blockquote>

        {/* Author */}
        <div className="aura-story-author">
          <div className="aura-story-author-avatar">
            <Image
              src="/images/about-workshop.webp"
              alt="Aura Living Team"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <p className="aura-story-author-name">Aura Living Team</p>
            <p className="aura-story-author-location">Lahore, Pakistan</p>
          </div>
        </div>

        {/* Values grid */}
        <div className="aura-story-values">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="aura-story-value">
                <div className="aura-story-value-icon">
                  <Icon />
                </div>
                <p className="aura-story-value-title">{v.title}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Link href="/about" className="aura-story-cta">
          Discover More
          <ArrowRight className="aura-story-cta-icon" />
        </Link>
      </div>
    </section>
  );
}
