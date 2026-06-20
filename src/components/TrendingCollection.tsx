'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { GoldDivider } from '@/components/SVGDecorations';
import { useGsapFadeIn, useGsapBlurText } from '@/hooks/useGsap';
import PremiumButton from '@/components/ui/PremiumButton';

export default function TrendingCollection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03 });
  const tagRef = useGsapFadeIn<HTMLSpanElement>({ y: 20, duration: 0.5, delay: 0 });
  const dividerWrapperRef = useGsapFadeIn<HTMLDivElement>({ y: 0, duration: 0.4, delay: 0.2 });
  const descRef = useGsapFadeIn<HTMLParagraphElement>({ y: 20, duration: 0.5, delay: 0.3 });
  const btnWrapperRef = useGsapFadeIn<HTMLDivElement>({ y: 20, duration: 0.5, delay: 0.4 });
  const imageRef = useGsapFadeIn<HTMLDivElement>({ y: 40, duration: 0.6, delay: 0.1 });

  // Scale-in on scroll
  useEffect(() => {
    if (!contentRef.current) return;

    gsap.set(contentRef.current, { scale: 0.97 });
    const trigger = ScrollTrigger.create({
      trigger: contentRef.current,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(contentRef.current, { scale: 1, duration: 0.8, ease: 'power3.out' });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full aura-section"
    >
      <div ref={contentRef} className="aura-container relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          {/* ═══ Left — Image with elegant gold frame ═══ */}
          <div ref={imageRef} className="w-full lg:w-1/2 relative">
            <div className="relative overflow-hidden rounded-lg">
              {/* Image */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]">
                <Image
                  src="/images/categories/lighting-category.webp"
                  alt="The Artisan Collection — handcrafted lighting"
                  fill
                  className="w-full h-full object-cover rounded-lg"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>

              {/* Subtle dark gradient at bottom for label readability */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent rounded-b-lg" />

              {/* Label on image */}
              <div className="absolute bottom-5 left-5">
                <span className="aura-eyebrow text-white/90">
                  Trending Now
                </span>
              </div>

              {/* Gold corner accents */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold/40 rounded-tl-md pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-gold/40 rounded-br-md pointer-events-none" />
            </div>
          </div>

          {/* ═══ Right — Content ═══ */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span ref={tagRef} className="aura-eyebrow mb-4">
              Trending Now
            </span>

            <h2 ref={headingRef} className="aura-h2 text-charcoal mb-4">
              The Artisan Collection
            </h2>

            <div ref={dividerWrapperRef} className="mb-5">
              <GoldDivider />
            </div>

            <p ref={descRef} className="aura-body text-warm-gray mb-8 max-w-lg">
              Discover our curated collection of handcrafted lighting, where each piece
              is shaped by skilled artisans using time-honoured techniques. From sculptural
              brass pendants to hand-blown glass table lamps — every fixture tells a story
              of craftsmanship and elegance.
            </p>

            <div ref={btnWrapperRef}>
              <PremiumButton variant="gold" href="/shop">
                Shop This Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </PremiumButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
