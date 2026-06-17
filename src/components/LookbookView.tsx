'use client';

import { useEffect, useRef } from 'react';
import { useGsapFadeIn, useGsapStagger, useGsapScaleIn, gsap, ScrollTrigger } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import { Camera, ArrowRight, Sun, UtensilsCrossed, Moon, Flower2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PremiumButton from '@/components/ui/PremiumButton';

gsap.registerPlugin(ScrollTrigger);

const scenes = [
  {
    number: '01',
    title: 'The Golden Hour Living Room',
    description:
      'Warm brass lighting, cream textures, and gold accents create a sanctuary of warmth. Style this space with layered cushions in ivory and champagne, drape a cashmere throw over an accent chair, and let the soft glow of a gold-finished table lamp cast dancing shadows across handwoven rugs. Complete the look with our signature brass candleholders and a curated stack of art books.',
    image: '/images/pages/lookbook-scene-1.webp',
    icon: Sun,
    accentColor: 'rgba(212,175,55,0.18)',
  },
  {
    number: '02',
    title: "The Artisan's Dining",
    description:
      'Handcrafted ceramics, gold-rimmed glassware, and linen runners set the stage for memorable gatherings. Lay a natural linen runner down the centre of your table, arrange our hand-thrown ceramic serving bowls alongside gold-rimmed crystal glasses, and finish with a woven placemat at each setting. A statement centrepiece of dried pampas grass in a hand-painted vase completes this effortlessly elegant table.',
    image: '/images/pages/lookbook-scene-2.webp',
    icon: UtensilsCrossed,
    accentColor: 'rgba(212,175,55,0.14)',
  },
  {
    number: '03',
    title: 'The Serene Bedroom',
    description:
      'Soft candlelight, delicate vases, and warm textiles transform your bedroom into a peaceful retreat. Layer crisp white sheets with a warm cream quilt, place a cluster of our hand-poured soy candles on the nightstand, and add a single stem in a porcelain bud vase. A textured throw at the foot of the bed and soft gold-framed artwork above create a space that invites rest and reflection.',
    image: '/images/pages/lookbook-scene-3.webp',
    icon: Moon,
    accentColor: 'rgba(212,175,55,0.12)',
  },
  {
    number: '04',
    title: 'The Botanical Corner',
    description:
      'Lush greenery in gold-rimmed planters brings life and freshness to any corner of your home. Pair our gold-rimmed ceramic planters with trailing pothos and structural snake plants, add a brass watering can as a sculptural accent, and place a natural jute mat beneath. A floating shelf displaying air plants in geometric terrariums adds height and visual interest to this living vignette.',
    image: '/images/pages/lookbook-scene-4.webp',
    icon: Flower2,
    accentColor: 'rgba(212,175,55,0.16)',
  },
];

export default function LookbookView() {
  const setPage = useStore((state) => state.setPage);
  const containerRef = useRef<HTMLDivElement>(null);

  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%',
  });

  const scenesRef = useGsapStagger<HTMLDivElement>({
    selector: '.lookbook-scene',
    y: 60,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    start: 'top 85%',
  });

  const ctaRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.2 });
  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

  // Independent parallax for each lookbook scene image (scoped to container)
  useEffect(() => {
    if (!containerRef.current) return;
    const sceneImages = containerRef.current.querySelectorAll('.lookbook-scene-image');
    const ctx = gsap.context(() => {
      sceneImages.forEach((img) => {
        gsap.fromTo(img,
          { y: '-5%' },
          {
            y: '5%',
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.lookbook-scene'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero */}
      <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-[55vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/pages/lookbook-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.78) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.18) 100%)' }}
        />

        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}>
            <Camera className="w-8 h-8" style={{ color: '#D4AF37' }} />
          </div>
          <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            AURA LIVING
          </span>
          <h1 className="text-white text-[32px] sm:text-[42px] md:text-[52px] font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Lookbook
          </h1>
          <p className="text-[#E8D5A3] text-sm sm:text-base mt-4 max-w-md leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Curated spaces, inspired living
          </p>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate" style={{ backgroundColor: '#F5EDDA' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={() => setPage('home')}
            className="text-sm transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A', background: 'none', border: 'none' }}
          >
            Home
          </button>
          <span className="text-sm" style={{ color: '#8A8A8A' }}>/</span>
          <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>Lookbook</span>
        </div>
      </div>

      {/* Intro */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[3px] uppercase font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Editorial Spaces
          </span>
          <h2 className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Styled for Living
          </h2>
          <GoldDivider />
          <p className="text-[#5A5A5A] text-base sm:text-lg leading-relaxed mt-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Each scene is a carefully composed vision — a mood board brought to life. Discover how our pieces come together to create spaces that tell your story.
          </p>
        </div>
      </section>

      {/* Scenes */}
      <div ref={scenesRef} className="flex flex-col">
        {scenes.map((scene, index) => {
          const isLeft = index % 2 === 0;
          const SceneIcon = scene.icon;

          return (
            <div key={scene.number} className="lookbook-scene">
              {/* Gold divider between scenes */}
              {index > 0 && (
                <div className="py-6 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto flex justify-center">
                    <div className="w-full max-w-xs h-px" style={{ backgroundColor: '#D4AF37' }} />
                  </div>
                </div>
              )}

              <section
                className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
                style={{ backgroundColor: index % 2 === 0 ? '#FAF8F5' : '#F5EDDA' }}
              >
                <div className="max-w-7xl mx-auto">
                  <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}>
                    {/* Scene image */}
                    <div className="w-full lg:w-1/2">
                      <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden img-zoom">
                        <img src={scene.image} alt={scene.title} className="w-full h-full object-cover lookbook-scene-image" />
                        {/* Decorative corner accents */}
                        <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#D4AF37]/40" />
                        <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#D4AF37]/40" />

                        {/* Scene number watermark */}
                        <div
                          className="absolute bottom-6 right-6 text-[60px] sm:text-[80px] lg:text-[96px] font-bold leading-none select-none"
                          style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(212,175,55,0.12)' }}
                        >
                          {scene.number}
                        </div>
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-5">
                      <span
                        className="text-[#D4AF37] text-sm sm:text-base font-bold tracking-wider"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Scene {scene.number}
                      </span>
                      <h3
                        className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold leading-snug"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {scene.title}
                      </h3>
                      <GoldDivider />
                      <p
                        className="text-[#5A5A5A] text-base sm:text-lg leading-relaxed"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {scene.description}
                      </p>
                      <div className="mt-2">
                        <PremiumButton
                          variant="outline"
                          onClick={() => setPage('shop')}
                        >
                          Shop This Look
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </PremiumButton>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
            <Camera className="w-8 h-8" style={{ color: '#D4AF37' }} />
          </div>
          <h2 className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Create Your Own Story
          </h2>
          <div className="flex justify-center mb-4">
            <GoldDivider />
          </div>
          <p className="text-[#5A5A5A] text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Every home has a story waiting to be told. Explore our full collection and bring your vision to life with pieces that speak to you.
          </p>
          <PremiumButton variant="gold" onClick={() => setPage('shop')}>
            Shop the Collection
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </PremiumButton>
        </div>
      </section>
    </div>
  );
}
