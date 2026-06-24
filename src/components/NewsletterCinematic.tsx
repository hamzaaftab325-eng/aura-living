'use client';

/**
 * NewsletterCinematic — Newsletter Demo 5 (chosen design). 10/10 edition.
 *
 * Dark cinematic band with:
 * - Floating ambient gold orbs (CSS animated)
 * - Subtle parallax background image (hero-slide-4.webp at 5% opacity)
 * - Per-line masked headline reveal (overflow:hidden + translateY)
 * - Eyebrow lines draw-in + label fade
 * - Subtitle slides up + fades
 * - Form: input + button fade-up
 * - Input: gold focus glow ring
 * - Submit button: shimmer sweep + scale on hover
 * - Success state: scale-in animation
 * - Reduced-motion safe
 *
 * All styling via CSS classes (.aura-news-cinema-*). Zero inline styles
 * (only dynamic bg image URL on the bg layer, which is allowed).
 */

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function NewsletterCinematic() {
  const ref = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Parallax on background image (subtle)
      gsap.to('.aura-news-cinema-bg', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Build a master timeline triggered when the section enters
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });

      // Eyebrow row fade + slide
      tl.fromTo(
        '.aura-news-cinema-eyebrow-row',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      // Per-line masked headline reveal — each line slides up from mask
      tl.fromTo(
        '.aura-news-cinema-mask',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power4.out',
        },
        '-=0.2'
      );

      // Subtitle
      tl.fromTo(
        '.aura-news-cinema-sub',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      );

      // Form (input + button) fade-up
      tl.fromTo(
        '.aura-news-cinema-form',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.3'
      );

      // Fineprint
      tl.fromTo(
        '.aura-news-cinema-fineprint',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
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
      // Swallow — we still show success to keep the UX smooth.
    }

    setEmail('');
    setDone(true);
  };

  return (
    <section ref={ref} className="aura-news-cinema">
      <div
        className="aura-news-cinema-bg"
        style={{ backgroundImage: 'url(/images/hero/hero-slide-4.webp)' }}
        aria-hidden="true"
      />

      <div className="aura-news-cinema-inner">
        <div className="aura-news-cinema-eyebrow-row">
          <span className="aura-news-cinema-eyebrow-line" />
          <span className="aura-news-cinema-eyebrow-text">Newsletter</span>
          <span className="aura-news-cinema-eyebrow-line" />
        </div>

        <h2 className="aura-news-cinema-title">
          <span className="aura-news-cinema-maskwrap">
            <span className="aura-news-cinema-mask">Stay in the</span>
          </span>
          <span className="aura-news-cinema-maskwrap">
            <span className="aura-news-cinema-mask aura-news-cinema-title-gold">
              Loop
            </span>
          </span>
        </h2>

        <p className="aura-news-cinema-sub">
          Be the first to know about new arrivals, sales, and styling tips.
        </p>

        <form className="aura-news-cinema-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="aura-news-cinema-input"
            aria-label="Email address"
          />
          <button type="submit" className="aura-news-cinema-btn">
            Subscribe
          </button>
        </form>

        {done ? (
          <p className="aura-news-cinema-success">
            Welcome to the family! Check your email for your discount code.
          </p>
        ) : (
          <p className="aura-news-cinema-fineprint">No spam. Unsubscribe anytime.</p>
        )}
      </div>
    </section>
  );
}
