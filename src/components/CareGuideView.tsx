'use client';

import { useEffect, useRef } from 'react';
import {
  useGsapFadeIn,
  useGsapStagger,
  useGsapBlurText,
  useGsapScaleIn,
  gsap,
  
} from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  Sparkles,
  Lightbulb,
  Flower2,
  CupSoda,
  Flame,
  Frame,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import PremiumButton from '@/components/ui/PremiumButton';
import Breadcrumb from '@/components/ui/Breadcrumb';


/* ═══════════════════════════════════════════════════════════
   Care category data
   ═══════════════════════════════════════════════════════════ */
interface CareCategory {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  tips: string[];
}

const careCategories: CareCategory[] = [
  {
    icon: Lightbulb,
    title: 'Lighting Care',
    subtitle: 'Keep your luminaires shining bright',
    tips: [
      'Dust regularly with a soft cloth',
      'Avoid water on brass fixtures',
      'Use a dry microfiber cloth for lamp shades',
      'Always unplug before cleaning',
    ],
  },
  {
    icon: Flower2,
    title: 'Plant Care',
    subtitle: 'Nurture your indoor greenery',
    tips: [
      'Water indoor plants once a week',
      'Keep in indirect sunlight',
      'Wipe leaves with damp cloth',
      'Ensure proper drainage',
    ],
  },
  {
    icon: CupSoda,
    title: 'Vase & Decor Care',
    subtitle: 'Preserve the beauty of your ceramics',
    tips: [
      'Hand wash ceramics with mild soap',
      'Avoid abrasive cleaners',
      'Display away from direct sunlight to prevent fading',
    ],
  },
  {
    icon: Flame,
    title: 'Candle Care',
    subtitle: 'Maximize the life of your candles',
    tips: [
      'Trim wick to 5mm before each burn',
      'First burn for 2+ hours',
      'Keep away from drafts',
      'Never leave unattended',
    ],
  },
  {
    icon: Frame,
    title: 'Wall Art & Mirror Care',
    subtitle: 'Protect your wall treasures',
    tips: [
      'Dust frames with soft brush',
      'Clean mirrors with glass cleaner',
      'Avoid hanging in humid areas',
      'Use proper wall anchors',
    ],
  },
  {
    icon: UtensilsCrossed,
    title: 'Kitchen & Dining Care',
    subtitle: 'Maintain your tableware elegance',
    tips: [
      'Hand wash recommended',
      'Not microwave safe for gold-rimmed items',
      'Dry immediately after washing',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   AnimatedSection — uses useGsapStagger for children reveal
   ═══════════════════════════════════════════════════════════ */
function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.15,
    ease: 'power3.out',
    start: 'top 80%',
  });

  return <div ref={ref} className={className}>{children}</div>;
}

export default function CareGuideView() {
  const setPage = useStore((state) => state.setPage);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroBgDivRef = useRef<HTMLDivElement>(null);

  // Hero entrance with useGsapStagger
  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%',
  });
  // Hero heading blur text
  const heroTitleRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03, start: 'top 90%' });
  // GoldDivider scale-in
  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

  // Care cards stagger — enhanced y:60 stagger:0.08
  const cardsRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%',
  });

  // CTA section fade-in
  const ctaRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });

  // Enhanced parallax for hero background — 0.5x speed + zoom 1→1.1
  // heroBgDivRef (inner div with backgroundImage) is the animation target.
  // heroBgRef (outer section) is the ScrollTrigger anchor.
  useEffect(() => {
    if (!heroBgDivRef.current || !heroBgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(heroBgDivRef.current, {
        backgroundPositionY: '50%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroBgRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
      gsap.fromTo(heroBgDivRef.current,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroBgRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, heroBgRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full page-transition" style={{ backgroundColor: 'var(--surface-page)' }}>
      {/* Hero Banner */}
      <section
        ref={heroBgRef}
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
      >
        {/* Background image — animated via heroBgDivRef */}
        <div
          ref={heroBgDivRef}
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/care-guide-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background:
              'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)',
          }}
        />

        {/* Decorative floating orbs */}
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full"
          style={{ filter: 'blur(60px)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full"
          style={{ filter: 'blur(70px)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
          }}
        />

        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: 'var(--color-gold)' }} />
          </div>
          <h1
            ref={heroTitleRef}
            className="aura-hero-title text-white"
            
          >
            Care Guide
          </h1>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>

          <p
            className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mt-4 leading-relaxed"
            
          >
            Preserve the beauty of your Aura Living pieces with our expert care instructions
          </p>
        </div>
      </section>
      {/* Breadcrumb strip (below hero) */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
          { label: 'Care Guide' },
        ]}
      />

      {/* Intro Text */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p
              className="text-[var(--color-warm-gray)] text-base sm:text-lg leading-relaxed"
              
            >
              Every piece in our collection is crafted with care and intention. To ensure your Aura Living
              treasures remain as stunning as the day you brought them home, follow our category-specific
              care guidelines below.
            </p>
            <div className="mt-6">
              <GoldDivider />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Care Category Cards */}
      <section className="pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {careCategories.map((category) => (
              <div
                key={category.title}
                className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[var(--color-gold)]"
                style={{ backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--color-gold-soft)',
                  borderLeft: '4px solid var(--color-gold)',
                }}
              >
                <div className="p-6 sm:p-8">
                  {/* Icon + Title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}
                    >
                      <category.icon className="w-5 h-5" style={{ color: 'var(--color-gold-text)' }} />
                    </div>
                    <div>
                      <h3
                        className="text-[var(--surface-dark)] text-xl sm:text-2xl font-semibold mb-1"
                        
                      >
                        {category.title}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: 'var(--color-muted-gray)' }}
                      >
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mb-5">
                    <div className="w-full h-px" style={{ backgroundColor: 'var(--color-gold-soft)' }} />
                  </div>

                  {/* Tips */}
                  <ul className="space-y-3">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                          style={{ backgroundColor: 'var(--color-gold)' }}
                        />
                        <span
                          className="text-[var(--color-warm-gray)] text-sm sm:text-base leading-relaxed"
                          
                        >
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need More Help CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-gold-pale)' }}>
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <GoldDivider />
          </div>
          <h2
            className="text-[var(--surface-dark)] text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            
          >
            Need More Help?
          </h2>
          <p
            className="text-[var(--color-warm-gray)] text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
            
          >
            Our team is always here to assist you with any questions about caring for your Aura Living
            pieces. Get in touch and we will be happy to help.
          </p>
          <PremiumButton variant="gold" onClick={() => setPage('contact')}>
            Contact Us
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </PremiumButton>
        </div>
      </section>
    </div>
  );
}
