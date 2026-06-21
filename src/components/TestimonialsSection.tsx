'use client';

import { useRef, useEffect } from 'react';
import { useTextReveal } from '@/hooks/useAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';;
import { GoldDivider } from '@/components/SVGDecorations';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  // GSAP blur text for section heading
  const headingRef = useTextReveal<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03 });

  // Scale on scroll
  const sectionContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sectionContentRef.current;
    if (!el) return;

    gsap.set(el, { scale: 0.95 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, { scale: 1, duration: 1, ease: 'power3.out' });
      } });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      className="relative w-full py-16 md:py-28 overflow-hidden"
      
    >
      <div ref={sectionContentRef} className="relative z-10">
        {/* Title */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            ref={headingRef}
            className="aura-text-primary text-2xl sm:text-[34px] md:text-[40px] font-bold leading-tight"
            
          >
            What Our Customers Say
          </h2>
          <div className="mt-5">
            <GoldDivider />
          </div>
        </div>

        {/* Stagger Testimonials */}
        <StaggerTestimonials />
      </div>
    </section>
  );
}
