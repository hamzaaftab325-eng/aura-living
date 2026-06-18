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
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import PremiumButton from '@/components/ui/PremiumButton';


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
    <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero Banner */}
      <section
        ref={heroBgRef}
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
      >
        {/* Background image — animated via heroBgDivRef */}
        <div
          ref={heroBgDivRef}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/pages/care-guide-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)',
          }}
        />

        {/* Decorative floating orbs */}
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full"
          style={{
            filter: 'blur(60px)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full"
          style={{
            filter: 'blur(70px)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
          }}
        />

        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: '#D4AF37' }} />
          </div>
          <h1
            ref={heroTitleRef}
            className="text-white text-[36px] sm:text-[44px] md:text-[52px] font-bold leading-[1.15] pt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Care Guide
          </h1>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
          </div>

          <p
            className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mt-4 leading-relaxed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Preserve the beauty of your Aura Living pieces with our expert care instructions
          </p>
        </div>
      </section>
      {/* Breadcrumb strip (below hero) */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate" style={{ backgroundColor: '#F5EDDA', borderBottom: '1px solid #E8D5A3' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-sm transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A', background: 'none', border: 'none' }}
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#B8A99A' }} />
          <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>
            Care Guide
          </span>
        </div>
      </div>

      {/* Intro Text */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p
              className="text-[#5A5A5A] text-base sm:text-lg leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif" }}
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
                className="rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]"
                style={{
                  backgroundColor: '#FFFDF7',
                  border: '1px solid #E8D5A3',
                  borderLeft: '4px solid #D4AF37',
                }}
              >
                <div className="p-6 sm:p-8">
                  {/* Icon + Title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}
                    >
                      <category.icon className="w-5 h-5" style={{ color: '#D4AF37' }} />
                    </div>
                    <div>
                      <h3
                        className="text-[#2C2C2C] text-xl sm:text-2xl font-semibold mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {category.title}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                      >
                        {category.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mb-5">
                    <div className="w-full h-px" style={{ backgroundColor: '#E8D5A3' }} />
                  </div>

                  {/* Tips */}
                  <ul className="space-y-3">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                          style={{ backgroundColor: '#D4AF37' }}
                        />
                        <span
                          className="text-[#5A5A5A] text-sm sm:text-base leading-relaxed"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
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
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5EDDA' }}>
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <GoldDivider />
          </div>
          <h2
            className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Need More Help?
          </h2>
          <p
            className="text-[#5A5A5A] text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Poppins', sans-serif" }}
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
