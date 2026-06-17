'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from '@/hooks/useGsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Connect Lenis → GSAP ScrollTrigger (official recommended method)
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker to drive Lenis — single rAF loop for both
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);

    // lagSmoothing(0) causes jank when returning from a background tab.
    // A small threshold (33ms ≈ 2 frames at 60fps) is much smoother.
    gsap.ticker.lagSmoothing(33);

    // Refresh ScrollTrigger after Lenis is ready
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
