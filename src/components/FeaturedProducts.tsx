'use client';

import { useState, useRef, useEffect } from 'react';
import { Eye, Heart, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { products, formatPKR } from '@/data/products';
import { useStore } from '@/store/useStore';
import { GoldDivider } from '@/components/SVGDecorations';
import { useGsapFadeIn, useGsapStagger, useGsapBlurText, gsap, ScrollTrigger } from '@/hooks/useGsap';
import PremiumButton from '@/components/ui/PremiumButton';
import type { Product } from '@/store/useStore';

/* ═══════════════════════════════════════════════════════════════
   Badge palette
   ═══════════════════════════════════════════════════════════════ */
const badgeStyles: Record<string, { bg: string; text: string; border: string }> = {
  NEW: { bg: 'rgba(168,181,160,0.92)', text: '#2C2C2C', border: 'rgba(168,181,160,0.5)' },
  SALE: { bg: 'rgba(232,206,193,0.92)', text: '#2C2C2C', border: 'rgba(232,206,193,0.5)' },
  BESTSELLER: { bg: 'rgba(212,175,55,0.92)', text: '#FFFFFF', border: 'rgba(212,175,55,0.6)' },
};

/* ═══════════════════════════════════════════════════════════════
   ProductCard — Enhanced CSS hover transforms with gold glow,
   dramatic image zoom (1.12), more lift (-8px), gold border fade
   ═══════════════════════════════════════════════════════════════ */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct, setPage } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const wishlisted = isInWishlist(product.id);
  const imageRef = useRef<HTMLImageElement>(null);

  // Parallax effect on product image
  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const trigger = ScrollTrigger.create({
      trigger: img,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(img, { y: (progress - 0.5) * -30 });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const handleProductClick = () => {
    setSelectedProduct(product);
    setPage('product');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setPage('product');
  };

  return (
    <div
      className="relative flex flex-col transition-all duration-500"
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer group"
        style={{
          aspectRatio: '4/5',
          border: isHovered
            ? '1.5px solid rgba(212,175,55,0.7)'
            : '1px solid rgba(232,213,163,0.3)',
          boxShadow: isHovered
            ? '0 0 20px rgba(212,175,55,0.2), 0 8px 32px rgba(0,0,0,0.08)'
            : '0 2px 12px rgba(0,0,0,0.04)',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleProductClick}
      >
        {/* Image with parallax + enhanced CSS zoom on hover */}
        <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#FFFDF7' }}>
          <img
            ref={imageRef}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            style={{
              transform: isHovered ? 'scale(1.12)' : 'scale(1)',
            }}
          />
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-30">
            <span
              className="inline-block px-3 py-1 rounded-md text-[10px] font-bold tracking-[0.15em] uppercase"
              style={{
                backgroundColor: badgeStyles[product.badge].bg,
                color: badgeStyles[product.badge].text,
                border: `1px solid ${badgeStyles[product.badge].border}`,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick action buttons — appear on hover */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
          {[
            { icon: <Eye className="w-5 h-5" strokeWidth={2} />, onClick: handleQuickView, label: 'Quick view', title: 'Preview' },
            { icon: <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} strokeWidth={2} />, onClick: handleToggleWishlist, label: 'Toggle wishlist', active: wishlisted, title: 'Wishlist' },
            { icon: <ShoppingCart className="w-5 h-5" strokeWidth={2} />, onClick: handleAddToCart, label: 'Add to cart', title: 'Add to Cart' },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              title={btn.title}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: isHovered
                  ? (wishlisted && btn.active ? '#D4AF37' : '#FFFDF7')
                  : 'transparent',
                color: wishlisted && btn.active ? '#FFFFFF' : '#2C2C2C',
                border: wishlisted && btn.active
                  ? '2px solid #D4AF37'
                  : (isHovered ? '2px solid rgba(212,175,55,0.3)' : '2px solid transparent'),
                boxShadow: isHovered ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0)' : 'translateX(12px)',
                transition: 'all 0.3s ease',
                transitionDelay: isHovered ? `${0.05 + i * 0.07}s` : '0s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#D4AF37';
                (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                (e.currentTarget as HTMLElement).style.borderColor = '#D4AF37';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(212,175,55,0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = wishlisted && btn.active ? '#D4AF37' : '#FFFDF7';
                (e.currentTarget as HTMLElement).style.color = wishlisted && btn.active ? '#FFFFFF' : '#2C2C2C';
                (e.currentTarget as HTMLElement).style.borderColor = wishlisted && btn.active ? '#D4AF37' : 'rgba(212,175,55,0.3)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
              aria-label={btn.label}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Add to Cart bar — CSS transition from bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-4"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.35s ease',
            transitionDelay: isHovered ? '0.1s' : '0s',
          }}
        >
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 rounded-lg text-xs font-semibold tracking-[0.12em] uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-[#C9A22E]"
            style={{
              backgroundColor: 'rgba(212,175,55,0.9)',
              color: '#FFFFFF',
              fontFamily: "'Poppins', sans-serif",
              border: '1px solid rgba(212,175,55,0.6)',
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* ─── Product Info below card ─── */}
      <div className="mt-4 flex flex-col gap-1.5 px-1">
        <h3
          className="text-[15px] font-semibold leading-snug cursor-pointer transition-colors duration-300 line-clamp-1 hover:text-[#D4AF37]"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#2C2C2C',
          }}
          onClick={handleProductClick}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < Math.floor(product.rating);
              const half = !filled && i < product.rating;
              return (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    filled
                      ? 'text-[#D4AF37] fill-[#D4AF37]'
                      : half
                      ? 'text-[#D4AF37] fill-[#D4AF37]/40'
                      : 'text-[#E8D5A3]/50'
                  }`}
                />
              );
            })}
          </div>
          <span
            className="text-[11px]"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
          >
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className="text-base font-bold"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
          >
            {formatPKR(product.price)}
          </span>
          {product.originalPrice && (
            <span
              className="text-xs line-through"
              style={{ fontFamily: "'Poppins', sans-serif", color: '#B8A99A' }}
            >
              {formatPKR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FeaturedProducts — main section with enhanced animations
   ═══════════════════════════════════════════════════════════════ */
export default function FeaturedProducts() {
  const setPage = useStore((state) => state.setPage);

  // GSAP blur text for section heading
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.8, stagger: 0.06 });

  // GSAP fade-in for subheading/description
  const subRef = useGsapFadeIn<HTMLParagraphElement>({ y: 20, duration: 0.7, delay: 0.4 });

  // GSAP stagger for product grid — enhanced y:50, stagger:0.1, start:'top 85%'
  const gridRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 50,
    duration: 0.7,
    stagger: 0.1,
    start: 'top 85%',
  });

  // Scale on scroll effect for the whole section content
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

  // Pick 4 featured
  const featuredProducts = [...products]
    .sort((a, b) => {
      const aScore = a.badge ? (a.badge === 'BESTSELLER' ? 3 : a.badge === 'SALE' ? 2 : 1) : 0;
      const bScore = b.badge ? (b.badge === 'BESTSELLER' ? 3 : b.badge === 'SALE' ? 2 : 1) : 0;
      if (bScore !== aScore) return bScore - aScore;
      return b.rating - a.rating;
    })
    .slice(0, 4);

  return (
    <section
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: '#FAF8F5' }}
    >
      {/* Ambient decorative blobs */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(168,181,160,0.1) 0%, transparent 70%)',
          transform: 'translate(20%, 30%)',
        }}
      />

      <div ref={sectionContentRef} className="max-w-7xl mx-auto relative z-10">
        {/* ─── Section Header ─── */}
        <div className="text-center mb-16">
          {/* Decorative top accent */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" />
            <div className="w-8 h-px bg-[#D4AF37]/30" />
          </div>

          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
          >
            Curated for You
          </h2>

          <div className="mt-5">
            <GoldDivider />
          </div>

          <p
            ref={subRef}
            className="text-sm sm:text-base max-w-md mx-auto mt-5"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
          >
            Handpicked treasures that embody the Aura Living spirit
          </p>
        </div>

        {/* ─── Product Grid with GSAP stagger ─── */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* ─── View All Products ─── */}
        <div className="mt-16 text-center">
          <PremiumButton variant="outline" onClick={() => setPage('shop')}>
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </PremiumButton>
        </div>
      </div>
    </section>
  );
}
