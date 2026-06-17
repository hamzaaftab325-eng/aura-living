'use client';

import { useRef, useEffect } from 'react';
import { useGsapBlurText, gsap, ScrollTrigger } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';

export default function TestimonialsSection() {
  // GSAP blur text for section heading
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.8, stagger: 0.06 });

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
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      className="relative w-full py-16 md:py-28 overflow-hidden"
      style={{ backgroundColor: '#FAF8F5' }}
    >
      <div ref={sectionContentRef} className="relative z-10">
        {/* Title */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            ref={headingRef}
            className="text-[#2C2C2C] text-2xl sm:text-[34px] md:text-[40px] font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
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
