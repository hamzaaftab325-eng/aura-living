'use client';

import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── Shared GPU acceleration config ───────────────────────
const GPU = { force3D: true };

/**
 * Check if user prefers reduced motion.
 * When true, animations are skipped and elements shown immediately.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─────────────────────────────────────────────────────────────
// 1. useScrollReveal — Fade + slide up on scroll into view
// ─────────────────────────────────────────────────────────────

interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
  once?: boolean;
}

/**
 * useScrollReveal — Animates element from opacity:0, y:30 to opacity:1, y:0
 * when it scrolls into view. GPU-accelerated.
 *
 * @param options - Animation configuration
 * @returns ref to attach to the target element
 *
 * @example
 * const ref = useScrollReveal<HTMLDivElement>({ duration: 0.6 });
 * return <div ref={ref}>Content</div>;
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { y = 24, duration = 0.5, delay = 0, ease = 'power3.out', start = 'top 85%', once = true } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0, ...GPU });
        return;
      }

      gsap.set(el, { opacity: 0, y, ...GPU });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start,
        once,
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration, delay, ease, ...GPU });
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: ref }
  );

  return ref;
}

// ─────────────────────────────────────────────────────────────
// 2. useTextReveal — Word-by-word blur reveal
// ─────────────────────────────────────────────────────────────

interface TextRevealOptions {
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
  splitBy?: 'words' | 'chars';
}

/**
 * useTextReveal — Splits text into words/chars and animates from
 * blurred + offset to focused + in-position. Premium heading animation.
 *
 * @param options - Animation configuration
 * @returns ref to attach to the heading element
 *
 * @example
 * const ref = useTextReveal<HTMLHeadingElement>({ stagger: 0.04 });
 * return <h1 ref={ref}>Where Comfort Meets Style</h1>;
 */
export function useTextReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: TextRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { duration = 0.6, stagger = 0.04, delay = 0, ease = 'power3.out', start = 'top 85%', splitBy = 'words' } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const text = el.textContent || '';
      let items: HTMLSpanElement[] = [];

      if (splitBy === 'chars') {
        const chars = text.split('');
        el.innerHTML = '';
        chars.forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          el.appendChild(span);
          items.push(span);
        });
      } else {
        const words = text.split(' ');
        el.innerHTML = '';
        words.forEach((word, i) => {
          const span = document.createElement('span');
          span.textContent = word;
          span.style.display = 'inline-block';
          el.appendChild(span);
          items.push(span);
          if (i < words.length - 1) {
            const space = document.createTextNode('\u00A0');
            el.appendChild(space);
          }
        });
      }

      if (!items.length) return;

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0, scaleX: 1, ...GPU });
        return;
      }

      gsap.set(items, { opacity: 0, y: 8, scaleX: 0.92, ...GPU });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          gsap.to(items, { opacity: 1, y: 0, scaleX: 1, duration, stagger, delay, ease, ...GPU });
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: ref }
  );

  return ref;
}

// ─────────────────────────────────────────────────────────────
// 3. useParallax — Background moves slower than foreground
// ─────────────────────────────────────────────────────────────

interface ParallaxOptions {
  speed?: number;
  yPercent?: number;
}

/**
 * useParallax — Creates a parallax scrolling effect on the target element.
 * The element moves at a different speed than the scroll, creating depth.
 *
 * @param options - Animation configuration
 * @returns ref to attach to the background element
 *
 * @example
 * const bgRef = useParallax<HTMLDivElement>({ speed: 1.5 });
 * return <div ref={bgRef} className="absolute inset-0">Background</div>;
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {}
) {
  const ref = useRef<T>(null);
  const { speed = 1.5, yPercent = 25 } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: speed,
        onUpdate: () => {
          gsap.to(el, { yPercent, ease: 'none', ...GPU });
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: ref }
  );

  return ref;
}

// ─────────────────────────────────────────────────────────────
// 4. useStaggerReveal — Grid items reveal one by one
// ─────────────────────────────────────────────────────────────

interface StaggerRevealOptions {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
}

/**
 * useStaggerReveal — Animates child elements (matching selector) with a
 * staggered reveal as the container scrolls into view.
 *
 * @param options - Animation configuration
 * @returns ref to attach to the container element
 *
 * @example
 * const ref = useStaggerReveal<HTMLDivElement>({ selector: ':scope > div', stagger: 0.08 });
 * return <div ref={ref}>{items.map(...)}</div>;
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  options: StaggerRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { selector = ':scope > *', y = 60, duration = 0.7, stagger = 0.08, delay = 0, ease = 'power3.out', start = 'top 80%' } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const children = el.querySelectorAll(selector);
      if (!children.length) return;

      if (prefersReducedMotion()) {
        gsap.set(children, { opacity: 1, y: 0, ...GPU });
        return;
      }

      gsap.set(children, { opacity: 0, y, ...GPU });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          gsap.to(children, { opacity: 1, y: 0, duration, stagger, delay, ease, ...GPU });
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: ref }
  );

  return ref;
}

// ─────────────────────────────────────────────────────────────
// 5. useScaleIn — Scale from 0.9 to 1 on scroll
// ─────────────────────────────────────────────────────────────

interface ScaleInOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
}

/**
 * useScaleIn — Animates element from scale 0.9 + opacity 0 to scale 1 + opacity 1.
 *
 * @param options - Animation configuration
 * @returns ref to attach to the element
 *
 * @example
 * const ref = useScaleIn<HTMLDivElement>({ delay: 0.3 });
 * return <div ref={ref}>Content</div>;
 */
export function useScaleIn<T extends HTMLElement = HTMLDivElement>(
  options: ScaleInOptions = {}
) {
  const ref = useRef<T>(null);
  const { duration = 0.6, delay = 0, ease = 'power3.out', start = 'top 85%' } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, scale: 1, ...GPU });
        return;
      }

      gsap.set(el, { opacity: 0, scale: 0.9, ...GPU });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          gsap.to(el, { opacity: 1, scale: 1, duration, delay, ease, ...GPU });
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: ref }
  );

  return ref;
}

// ─────────────────────────────────────────────────────────────
// 6. useCountUp — Number count-up animation
// ─────────────────────────────────────────────────────────────

interface CountUpOptions {
  end: number;
  duration?: number;
  delay?: number;
  start?: string;
  suffix?: string;
  prefix?: string;
}

/**
 * useCountUp — Animates a number from 0 to the target value on scroll.
 * Updates the element's textContent with the formatted number.
 *
 * @param options - Animation configuration (end is required)
 * @returns ref to attach to the number display element
 *
 * @example
 * const ref = useCountUp<HTMLSpanElement>({ end: 5000, suffix: '+' });
 * return <span ref={ref}>0</span>;
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  options: CountUpOptions
) {
  const ref = useRef<T>(null);
  const { end, duration = 2, delay = 0, start = 'top 80%', suffix = '', prefix = '' } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        el.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
        return;
      }

      const obj = { val: 0 };
      const trigger = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: end,
            duration,
            delay,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
            },
          });
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: ref }
  );

  return ref;
}

// ─────────────────────────────────────────────────────────────
// 7. useMagnetic — Button follows cursor slightly
// ─────────────────────────────────────────────────────────────

interface MagneticOptions {
  strength?: number;
}

/**
 * useMagnetic — Creates a magnetic hover effect where the element
 * follows the cursor slightly when hovered.
 *
 * @param options - Animation configuration
 * @returns ref to attach to the button element
 *
 * @example
 * const ref = useMagnetic<HTMLButtonElement>({ strength: 0.3 });
 * return <button ref={ref}>Hover me</button>;
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  options: MagneticOptions = {}
) {
  const ref = useRef<T>(null);
  const { strength = 0.3 } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3.out' });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        xTo(x);
        yTo(y);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    },
    { scope: ref }
  );

  return ref;
}
