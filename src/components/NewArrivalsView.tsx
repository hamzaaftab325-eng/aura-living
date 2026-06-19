'use client';

import { useMemo, useEffect, useRef } from 'react';
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
  Star,
  Heart,
  ShoppingCart,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { products, formatPKR } from '@/data/products';
import PremiumButton from '@/components/ui/PremiumButton';


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

/* ═══════════════════════════════════════════════════════════
   RatingStars — renders star rating
   ═══════════════════════════════════════════════════════════ */
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-3.5 h-3.5"
          style={{ color: star <= Math.round(rating) ? '#D4AF37' : '#E8D5A3',
            fill: star <= Math.round(rating) ? '#D4AF37' : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function NewArrivalsView() {
  const setPage = useStore((state) => state.setPage);
  const setSelectedProduct = useStore((state) => state.setSelectedProduct);
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  // Subscribe to wishlist array so component re-renders when wishlist changes.
  const wishlist = useStore((state) => state.wishlist);
  const isInWishlist = (id: string) => wishlist.includes(id);
  const setCartOpen = useStore((state) => state.setCartOpen);

  const heroBgRef = useRef<HTMLElement>(null);
  const heroBgDivRef = useRef<HTMLDivElement>(null);

  // Filter NEW products and sort by rating (highest first)
  const newProducts = useMemo(
    () =>
      products
        .filter((p) => p.badge === 'NEW')
        .sort((a, b) => b.rating - a.rating),
    []
  );

  // Hero entrance with useGsapStagger
  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%',
  });
  // Hero heading blur text
  const heroTitleRef = useGsapBlurText<HTMLHeadingElement>({ duration: 0.8, stagger: 0.05, start: 'top 90%' });
  // GoldDivider scale-in
  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

  // Grid stagger — enhanced y:60 stagger:0.08
  const gridRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%',
  });

  // CTA section fade-in
  const ctaRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });

  // Enhanced parallax for hero section — 0.5x speed + zoom 1→1.1
  useEffect(() => {
    if (!heroBgDivRef.current) return;
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

  const handleProductClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    setCartOpen(true);
  };

  return (
    <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero Banner */}
      <section
        ref={heroBgRef}
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
      >
        {/* Background image */}
        <div
          ref={heroBgDivRef}
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/new-arrivals-hero.webp)',
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
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: '#D4AF37' }} />
          </div>
          <h1
            ref={heroTitleRef}
            className="aura-hero-title text-white"
            
          >
            New Arrivals
          </h1>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
          </div>

          <p
            className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mt-4 leading-relaxed"
            
          >
            Discover the latest additions to our curated collection
          </p>
        </div>
      </section>
      {/* Breadcrumb strip (below hero) */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate" style={{ backgroundColor: '#F5EDDA', borderBottom: '1px solid #E8D5A3' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-sm transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
            style={{ color: '#8A8A8A', background: 'none' }}
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#B8A99A' }} />
          <span className="text-sm font-medium" style={{ color: '#B8941F' }}>
            New Arrivals
          </span>
        </div>
      </div>

      {/* Products Content */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {newProducts.length === 0 ? (
            /* ── Empty State ── */
            <AnimatedSection>
              <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                >
                  <Sparkles className="w-10 h-10" style={{ color: '#D4AF37' }} />
                </div>
                <h2
                  className="text-[#2C2C2C] text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-3"
                  
                >
                  No new arrivals yet
                </h2>
                <p
                  className="text-[#5A5A5A] text-base sm:text-lg mb-8 max-w-md text-center leading-relaxed"
                  
                >
                  We are always curating new pieces for our collection. Check back soon for exciting additions!
                </p>
                <PremiumButton variant="gold" onClick={() => setPage('shop')}>
                  <ShoppingBag className="w-4 h-4" />
                  Browse Our Collection
                </PremiumButton>
              </div>
            </AnimatedSection>
          ) : (
            /* ── Product Grid ── */
            <>
              <AnimatedSection>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2
                      className="text-[#2C2C2C] text-xl sm:text-2xl font-semibold"
                      
                    >
                      Latest Additions
                    </h2>
                    <div className="mt-2">
                      <GoldDivider />
                    </div>
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: '#8A8A8A' }}
                  >
                    {newProducts.length} item{newProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </AnimatedSection>

              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
              >
                {newProducts.map((product) => {
                  const wishlisted = isInWishlist(product.id);
                  return (
                    <div
                      key={product.id}
                      className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[#D4AF37]"
                      style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
                    >
                      {/* Product Image */}
                      <div
                        className="relative w-full aspect-square overflow-hidden cursor-pointer"
                        style={{ backgroundColor: '#F5EDDA' }}
                        onClick={() => handleProductClick(product)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleProductClick(product); } }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${product.name} details`}
                      >
                        <img loading="lazy"
        src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.08]"
                        />

                        {/* NEW Badge */}
                        <div
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-sm text-xs font-semibold tracking-wider uppercase"
                          style={{ backgroundColor: '#D4AF37',
                            color: '#FFFFFF',
                          }}
                        >
                          NEW
                        </div>

                        {/* Wishlist button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
                          style={{ backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart
                            className="w-4 h-4"
                            style={{ color: wishlisted ? '#DC2626' : '#8A8A8A',
                              fill: wishlisted ? '#DC2626' : 'none',
                            }}
                          />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 sm:p-5">
                        {/* Name */}
                        <h3
                          className="text-[#2C2C2C] text-base sm:text-lg font-semibold mb-1.5 cursor-pointer transition-colors duration-200 hover:text-[#D4AF37] leading-snug"
                          
                          onClick={() => handleProductClick(product)}
                        >
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <RatingStars rating={product.rating} />
                          <span
                            className="text-xs"
                            style={{ color: '#8A8A8A' }}
                          >
                            ({product.reviews})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="text-lg font-bold"
                            style={{ color: '#2C2C2C' }}
                          >
                            {formatPKR(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span
                              className="text-sm line-through"
                              style={{ color: '#8A8A8A' }}
                            >
                              {formatPKR(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C9A22E 50%, #B8941F 100%)',
                              color: '#FFFFFF',
                            }}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="w-11 h-11 rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer"
                            style={{ border: '1px solid #E8D5A3',
                              backgroundColor: wishlisted ? 'rgba(220, 38, 38, 0.06)' : 'transparent',
                            }}
                            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                          >
                            <Heart
                              className="w-4 h-4"
                              style={{ color: wishlisted ? '#DC2626' : '#8A8A8A',
                                fill: wishlisted ? '#DC2626' : 'none',
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Browse All CTA */}
              <AnimatedSection>
                <div className="mt-12 sm:mt-16 text-center">
                  <div className="mb-6">
                    <GoldDivider />
                  </div>
                  <p
                    className="text-[#5A5A5A] text-base mb-6"
                    
                  >
                    Explore our full collection of curated home decor
                  </p>
                  <PremiumButton variant="outline" onClick={() => setPage('shop')}>
                    <ShoppingBag className="w-4 h-4" />
                    View All Products
                  </PremiumButton>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
