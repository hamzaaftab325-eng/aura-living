'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Eye, Heart, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { products, formatPKR } from '@/data/products';
import { useStore, badgeColors } from '@/store/useStore';
import type { Product } from '@/store/useStore';
import { useCartActions } from '@/hooks/useCartActions';
import { GoldDivider } from '@/components/SVGDecorations';
import { useGsapFadeIn, useGsapStagger, useGsapBlurText, gsap, ScrollTrigger } from '@/hooks/useGsap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PremiumButton from '@/components/ui/PremiumButton';

/* ═══════════════════════════════════════════════════════════════
   Badge palette
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   ProductCard — Enhanced CSS hover transforms with gold glow,
   dramatic image zoom (1.12), more lift (-8px), gold border fade
   ═══════════════════════════════════════════════════════════════ */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const { isInWishlist } = useStore();
  const router = useRouter();
  const { handleAddToCart, handleToggleWishlist } = useCartActions();
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

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleAddToCart(product);
  };

  const handleToggleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleToggleWishlist(product.id, product.name);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      className="relative flex flex-col transition-all duration-500"
      style={{ transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative rounded-xl overflow-hidden block group"
        style={{ aspectRatio: '3/4',
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
        aria-label={`View ${product.name} details`}
      >
        {/* Image with parallax + enhanced CSS zoom on hover */}
        <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: 'var(--surface-card)' }}>
          <Image
            ref={imageRef}
            src={product.image}
            alt={product.name}
            fill
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            style={{ transform: isHovered ? 'scale(1.12)' : 'scale(1)',
            }}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-30">
            <span
              className="inline-block px-2.5 py-1 rounded-sm text-[10px] font-bold tracking-wider uppercase"
              style={{ backgroundColor: badgeColors[product.badge]?.bg,
                color: badgeColors[product.badge]?.text,
              }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick action buttons — appear on hover (visible on touch devices via .touch-visible) */}
        <div className="touch-visible absolute top-3 right-3 z-30 flex flex-col gap-2">
          {[
            { icon: <Eye className="w-5 h-5" strokeWidth={2} />, onClick: handleQuickView, label: 'Quick view', title: 'Preview' },
            { icon: <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} strokeWidth={2} />, onClick: handleToggleWishlistClick, label: 'Toggle wishlist', active: wishlisted, title: 'Wishlist' },
            { icon: <ShoppingCart className="w-5 h-5" strokeWidth={2} />, onClick: handleAddToCartClick, label: 'Add to cart', title: 'Add to Cart' },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              title={btn.title}
              className="touch-visible w-11 h-11 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: isHovered
                  ? (wishlisted && btn.active ? 'var(--color-gold)' : 'var(--surface-card)')
                  : 'transparent',
                color: wishlisted && btn.active ? 'var(--text-on-dark)' : 'var(--surface-dark)',
                border: wishlisted && btn.active
                  ? '2px solid var(--color-gold)'
                  : (isHovered ? '2px solid rgba(212,175,55,0.3)' : '2px solid transparent'),
                boxShadow: isHovered ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0)' : 'translateX(12px)',
                transition: 'all 0.3s ease',
                transitionDelay: isHovered ? `${0.05 + i * 0.07}s` : '0s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-gold)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-on-dark)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gold)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(212,175,55,0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = wishlisted && btn.active ? 'var(--color-gold)' : 'var(--surface-card)';
                (e.currentTarget as HTMLElement).style.color = wishlisted && btn.active ? 'var(--text-on-dark)' : 'var(--surface-dark)';
                (e.currentTarget as HTMLElement).style.borderColor = wishlisted && btn.active ? 'var(--color-gold)' : 'rgba(212,175,55,0.3)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
              aria-label={btn.label}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Add to Cart bar — CSS transition from bottom (visible on touch via .touch-visible-translate) */}
        <div
          className="touch-visible-translate absolute bottom-0 left-0 right-0 z-30 px-4 pb-4"
          style={{ opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.35s ease',
            transitionDelay: isHovered ? '0.1s' : '0s',
          }}
        >
          <button
            onClick={handleAddToCartClick}
            className="premium-btn btn-primary btn-sm w-full"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* ─── Product Info below card ─── */}
      <div className="mt-4 flex flex-col gap-1.5 px-1">
        <Link
          href={`/product/${product.slug}`}
          className="text-[15px] font-semibold leading-snug transition-colors duration-300 line-clamp-1 hover:text-[var(--color-gold)]"
          style={{ color: 'var(--surface-dark)' }}
        >
          {product.name}
        </Link>

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
                      ? 'text-[var(--color-gold)] fill-[var(--color-gold)]'
                      : half
                      ? 'text-[var(--color-gold)] fill-[var(--color-gold)]/40'
                      : 'text-[var(--color-gold-soft)]/50'
                  }`}
                />
              );
            })}
          </div>
          <span
            className="text-[11px]"
            style={{ color: 'var(--color-muted-gray)' }}
          >
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className="text-base font-bold"
            style={{ color: 'var(--color-gold)' }}
          >
            {formatPKR(product.price)}
          </span>
          {product.originalPrice && (
            <span
              className="text-xs line-through"
              style={{ color: 'var(--color-taupe)' }}
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
  // GSAP blur text for section heading
  const headingRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03 });

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
      style={{ backgroundColor: 'var(--surface-page)' }}
    >
      {/* Ambient decorative blobs — hidden on mobile to save paint */}
      <div
        className="hidden sm:block absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="hidden sm:block absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(168,181,160,0.1) 0%, transparent 70%)',
          transform: 'translate(20%, 30%)',
        }}
      />

      <div ref={sectionContentRef} className="max-w-7xl mx-auto relative z-10">
        {/* ─── Section Header ─── */}
        <div className="text-center mb-16">
          {/* Decorative top accent */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-[var(--color-gold)]/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]/60" />
            <div className="w-8 h-px bg-[var(--color-gold)]/30" />
          </div>

          <h2
            ref={headingRef}
            className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold tracking-tight"
            style={{ color: 'var(--surface-dark)' }}
          >
            Curated for You
          </h2>

          <div className="mt-5">
            <GoldDivider />
          </div>

          <p
            ref={subRef}
            className="text-sm sm:text-base max-w-md mx-auto mt-5"
            style={{ color: 'var(--color-muted-gray)' }}
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
          <PremiumButton variant="secondary" href="/shop">
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </PremiumButton>
        </div>
      </div>
    </section>
  );
}
