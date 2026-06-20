'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Shared defaults for buttery animations ───────────────
// force3D: true promotes elements to their own GPU layer
// so transforms don't trigger layout/paint on the CPU.
const GPU = { force3D: true };

/**
 * Check if user prefers reduced motion.
 * When true, GSAP animations should be skipped (elements shown immediately).
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * useGsapFadeIn — animates elements from opacity:0, y:30 to opacity:1, y:0
 * when they scroll into view. GPU-accelerated.
 */
export function useGsapFadeIn<T extends HTMLElement = HTMLDivElement>(
  options: {
    y?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const ref = useRef<T>(null);
  const { y = 24, duration = 0.5, delay = 0, ease = 'power3.out', start = 'top 85%' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion — show element immediately without animation
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, ...GPU });
      return;
    }

    gsap.set(el, { opacity: 0, y, ...GPU });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration, delay, ease, ...GPU });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [y, duration, delay, ease, start]);

  return ref;
}

/**
 * useGsapStagger — animates children of the container ref with stagger.
 * GPU-accelerated with force3D.
 */
export function useGsapStagger<T extends HTMLElement = HTMLDivElement>(
  options: {
    selector?: string;
    y?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const ref = useRef<T>(null);
  const {
    selector = ':scope > *',
    y = 24,
    duration = 0.5,
    stagger = 0.06,
    delay = 0,
    ease = 'power3.out',
    start = 'top 80%',
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll(selector);
    if (!children.length) return;

    // Respect reduced motion — show elements immediately
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
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          delay,
          ease,
          ...GPU,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [selector, y, duration, stagger, delay, ease, start]);

  return ref;
}

/**
 * useGsapBlurText — Splits text into words and animates each from
 * blurred to clear with stagger.
 *
 * PERFORMANCE FIX: Instead of animating CSS filter:blur() (which causes
 * expensive repaints every frame), we use opacity + y + scaleX which are
 * all GPU-composited properties. The visual effect is similar but runs
 * at a smooth 60fps even on mobile devices.
 */
export function useGsapBlurText<T extends HTMLElement = HTMLDivElement>(
  options: {
    duration?: number;
    stagger?: number;
    delay?: number;
    blur?: number; // kept for API compat, but mapped to opacity/scale
    ease?: string;
    start?: string;
    splitBy?: 'words' | 'chars';
  } = {}
) {
  const ref = useRef<T>(null);
  const {
    duration = 0.5,
    stagger = 0.03,
    delay = 0,
    ease = 'power3.out',
    start = 'top 85%',
    splitBy = 'words',
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Get the text content and split
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
        // Add space between words
        if (i < words.length - 1) {
          const space = document.createTextNode('\u00A0');
          el.appendChild(space);
        }
      });
    }

    if (!items.length) return;

    // Respect reduced motion — show text immediately
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0, scaleX: 1, ...GPU });
      return;
    }

    // Use opacity + y + slight scaleX instead of filter:blur()
    // This is 100% GPU-composited = buttery smooth on all devices
    gsap.set(items, { opacity: 0, y: 8, scaleX: 0.92, ...GPU });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          scaleX: 1,
          duration,
          stagger,
          delay,
          ease,
          ...GPU,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [duration, stagger, delay, ease, start, splitBy]);

  return ref;
}

/**
 * useGsapScaleIn — animates elements from scale:0, opacity:0 to scale:1, opacity:1
 * GPU-accelerated with force3D.
 */
export function useGsapScaleIn<T extends HTMLElement = HTMLDivElement>(
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const ref = useRef<T>(null);
  const { duration = 0.4, delay = 0, ease = 'back.out(1.7)', start = 'top 85%' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { scale: 0, opacity: 0, ...GPU });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(el, { scale: 1, opacity: 1, duration, delay, ease, ...GPU });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [duration, delay, ease, start]);

  return ref;
}

/**
 * useGsapCountUp — counts up a number from 0 when entering viewport.
 * No GPU optimization needed (just updating textContent).
 */
export function useGsapCountUp<T extends HTMLElement = HTMLSpanElement>(
  options: {
    endValue?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    start?: string;
  } = {}
) {
  const ref = useRef<T>(null);
  const { endValue = 0, duration = 1.0, delay = 0, ease = 'power2.out', start = 'top 85%' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const counter = { value: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: endValue,
          duration,
          delay,
          ease,
          onUpdate: () => {
            el.textContent = Math.round(counter.value).toString();
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [endValue, duration, delay, ease, start]);

  return ref;
}

export { gsap, ScrollTrigger };
