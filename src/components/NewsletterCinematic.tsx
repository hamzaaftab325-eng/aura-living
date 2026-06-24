'use client';

/**
 * NewsletterCinematic — Newsletter Demo 5 (chosen design).
 *
 * Dark cinematic band with a subtle parallax background image,
 * masked text reveal on the headline, and a clean inline email form.
 * All styling lives in modern.css (.aura-news-cinema-* classes).
 *
 * Submits to /api/newsletter — same backend as the existing homepage
 * newsletter section. Shows inline success state on submit.
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

      // Parallax on background image
      gsap.to('.aura-news-cinema-bg', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Masked reveal of headline lines
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });

      tl.fromTo(
        '.aura-news-cinema-mask',
        { yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.08, ease: 'power4.out' }
      );

      tl.fromTo(
        '.aura-news-cinema-fade',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
        '-=0.3'
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
        <div className="aura-news-cinema-eyebrow-row aura-news-cinema-fade">
          <span className="aura-news-cinema-eyebrow-line" />
          <span className="aura-news-cinema-eyebrow-text">Newsletter</span>
          <span className="aura-news-cinema-eyebrow-line" />
        </div>

        <h2 className="aura-news-cinema-title">
          <span className="aura-news-cinema-maskwrap">
            <span className="aura-news-cinema-mask">Stay in the</span>
          </span>
          <span className="aura-news-cinema-maskwrap">
            <span className="aura-news-cinema-mask aura-news-cinema-title-gold">Loop</span>
          </span>
        </h2>

        <p className="aura-news-cinema-sub aura-news-cinema-fade">
          Be the first to know about new arrivals, sales, and styling tips.
        </p>

        <form className="aura-news-cinema-form aura-news-cinema-fade" onSubmit={handleSubmit}>
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
