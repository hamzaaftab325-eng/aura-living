'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// GoldDivider — elegant single-line divider with centered diamond
// Now includes GSAP draw-in animation (scaleX from 0 to 1)
export function GoldDivider() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const lines = el.querySelectorAll<HTMLDivElement>('.gold-divider-line');
    const diamond = el.querySelector<HTMLDivElement>('.gold-divider-diamond');

    gsap.set(lines, { scaleX: 0, transformOrigin: 'center center' });
    if (diamond) {
      gsap.set(diamond, { scale: 0, opacity: 0 });
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(lines, {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
        });
        if (diamond) {
          gsap.to(diamond, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            delay: 0.4,
            ease: 'back.out(2)',
          });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="gold-divider">
      <div className="gold-divider-line" />
      <div className="gold-divider-diamond" />
      <div className="gold-divider-line right" />
    </div>
  );
}

// CornerOrnament — CSS border-based corner decoration
export function CornerOrnament({ position, size = 60 }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; size?: number }) {
  return (
    <div
      className={`corner-ornament ${position}`}
      style={{ width: size, height: size }}
    />
  );
}

// FloatingOrb — CSS-only floating gold orb with blur
export function FloatingOrb({ size, top, left, delay = 0 }: { size: number; top: string; left: string; delay?: number }) {
  return (
    <div
      className="floating-orb"
      style={{ width: size,
        height: size,
        top,
        left,
        animationDelay: `${delay}s`,
        filter: 'blur(60px)',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.02) 40%, transparent 70%)',
      }}
    />
  );
}

// FloatingGoldDots — decorative gold dots that float between sections
export function FloatingGoldDots() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dots = el.querySelectorAll<HTMLDivElement>('.gold-dot');
    gsap.set(dots, { opacity: 0, y: 20 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(dots, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-6 py-6 pointer-events-none"
      aria-hidden="true"
    >
      <div className="gold-dot w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]/30" />
      <div className="gold-dot w-2 h-2 rounded-full bg-[var(--color-gold)]/40" />
      <div className="gold-dot w-1 h-1 rounded-full bg-[var(--color-gold)]/25" />
      <div className="gold-dot w-2.5 h-2.5 rounded-full bg-[var(--color-gold)]/20" style={{ animation: 'floatSlow 6s ease-in-out infinite' }} />
      <div className="gold-dot w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]/35" />
      <div className="gold-dot w-1 h-1 rounded-full bg-[var(--color-gold)]/25" style={{ animation: 'floatSlow 8s ease-in-out infinite', animationDelay: '1s' }} />
      <div className="gold-dot w-2 h-2 rounded-full bg-[var(--color-gold)]/30" />
    </div>
  );
}
