'use client';

import { useRef, useState, useEffect } from 'react';
import { useGsapStagger, useGsapBlurText, gsap, ScrollTrigger } from '@/hooks/useGsap';
import { categories } from '@/data/products';
import { useStore } from '@/store/useStore';
import { GoldDivider } from '@/components/SVGDecorations';

/* ═══════════════════════════════════════════════════════════
   Category Card — Enhanced hover effects:
   - Gold bottom border slides in from left
   - Brighter overlay on hover
   - Card text shifts to gold on hover
   - Parallax image effect
   ═══════════════════════════════════════════════════════════ */
type TextPosition = 'bottom-left' | 'center' | 'top-right';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    image: string;
    description: string;
  };
  aspectClass: string;
  textPosition: TextPosition;
  onClick: () => void;
}

function CategoryCard({
  category,
  aspectClass,
  textPosition,
  onClick,
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Parallax effect on category image
  useEffect(() => {
    const img = imageRef.current;
    const card = cardRef.current;
    if (!img || !card) return;

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(img, { y: (progress - 0.5) * -40 });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const positionClasses: Record<TextPosition, string> = {
    'bottom-left': 'items-start justify-end pb-8 pl-6',
    center: 'items-center justify-center',
    'top-right': 'items-end justify-start pt-8 pr-6',
  };

  return (
    <div
      ref={cardRef}
      className={`group relative cursor-pointer overflow-hidden rounded-xl ${aspectClass}`}
      style={{ border: isHovered ? '2px solid #D4AF37' : '1px solid rgba(232, 213, 163, 0.2)',
        transition: 'border-color 0.4s ease',
      }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Browse ${category.name} category`}
    >
      {/* Image with parallax */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ willChange: 'transform' }}
        loading="lazy" />
      </div>

      {/* Dark gradient overlay — brighter on hover */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ background: isHovered
            ? 'linear-gradient(to top, rgba(44,44,44,0.65) 0%, rgba(44,44,44,0.15) 50%, rgba(212,175,55,0.08) 100%)'
            : 'linear-gradient(to top, rgba(44,44,44,0.78) 0%, rgba(44,44,44,0.25) 50%, rgba(44,44,44,0.08) 100%)',
        }}
      />

      {/* Category Name — shifts to gold on hover */}
      <div
        className={`absolute inset-0 flex flex-col ${positionClasses[textPosition]} z-10`}
      >
        <h3
          className="text-xl sm:text-2xl lg:text-3xl font-bold transition-all duration-500"
          style={{ color: isHovered ? '#D4AF37' : '#FFFFFF',
            textShadow: isHovered
              ? '0 0 20px rgba(212, 175, 55, 0.6), 0 0 40px rgba(212, 175, 55, 0.3)'
              : '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {category.name}
        </h3>
        {/* Description — appears on hover */}
        <p
          className="text-white/70 text-sm mt-1 max-w-[200px] sm:max-w-[180px] transition-all duration-300"
          style={{ opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          {category.description}
        </p>
      </div>

      {/* Gold bottom border that slides in from left on hover */}
      <div
        className="absolute bottom-0 left-0 h-[3px] z-20"
        style={{ width: isHovered ? '100%' : '0%',
          background: 'linear-gradient(90deg, #D4AF37, #E8D5A3, #D4AF37)',
          transition: 'width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: isHovered ? '0 0 10px rgba(212,175,55,0.4)' : 'none',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main CategoriesSection Component
   ═══════════════════════════════════════════════════════════ */
export default function CategoriesSection() {
  const { setSelectedCategory, setPage } = useStore();

  // GSAP blur text for section heading
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03 });

  // Enhanced stagger with y:50, stagger:0.1, start:'top 85%'
  const row1Ref = useGsapStagger<HTMLDivElement>({ y: 50, stagger: 0.1, duration: 0.6, start: 'top 85%' });
  const row2Ref = useGsapStagger<HTMLDivElement>({ y: 50, stagger: 0.1, duration: 0.6, delay: 0.2, start: 'top 85%' });
  const row3Ref = useGsapStagger<HTMLDivElement>({ y: 50, stagger: 0.1, duration: 0.6, delay: 0.4, start: 'top 85%' });

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

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage('shop');
  };

  const textPositions: TextPosition[] = [
    'bottom-left',
    'top-right',
    'center',
    'bottom-left',
    'top-right',
    'center',
  ];

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ backgroundColor: '#FAF8F5' }}
    >
      <div ref={sectionContentRef} className="max-w-7xl mx-auto relative z-10">
        {/* ── Section Title ── */}
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold mb-2"
            style={{ color: '#2C2C2C',
            }}
          >
            Shop by Category
          </h2>
          <div className="mt-4">
            <GoldDivider />
          </div>
        </div>

        {/* ── Row 1: 2 cards with staggered heights ── */}
        <div ref={row1Ref} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {categories.slice(0, 2).map((cat, i) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              aspectClass={i === 0 ? 'aspect-[4/5]' : 'aspect-[3/4]'}
              textPosition={textPositions[i]}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>

        {/* ── Row 2: 3 equal-square cards ── */}
        <div ref={row2Ref} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.slice(2, 5).map((cat, i) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              aspectClass="aspect-square"
              textPosition={textPositions[i + 2]}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>

        {/* ── 6th card — full-width featured category ── */}
        {categories.length >= 6 && (
          <div ref={row3Ref} className="mt-5">
            <CategoryCard
              category={categories[5]}
              aspectClass="aspect-[21/9]"
              textPosition="center"
              onClick={() => handleCategoryClick(categories[5].id)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
