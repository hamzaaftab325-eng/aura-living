'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';;
import { ScrollTrigger } from 'gsap/ScrollTrigger';


export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disable Lenis on mobile/touch devices — native scroll is snappier
    // and avoids the "slow/laggy" feel users complain about on phones.
    // Only enable on screens >= 1024px (desktop).
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (isMobile) {
      // Just refresh ScrollTrigger so animations still fire on native scroll
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    const lenis = new Lenis({
      duration: 1.0, // was 1.4 — too slow, felt laggy
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0, // was 0.8 — slowing down scroll too much
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
