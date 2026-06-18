'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import {
  useGsapFadeIn,
  useGsapStagger,
  useGsapScaleIn,
  gsap,
  
} from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  Tag,
  Star,
  Heart,
  ShoppingCart,
  ChevronRight,
  ShoppingBag,
  Clock,
  AlertTriangle,
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
          style={{
            color: star <= Math.round(rating) ? '#D4AF37' : '#E8D5A3',
            fill: star <= Math.round(rating) ? '#D4AF37' : 'none',
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SaleCountdown — mock countdown timer
   ═══════════════════════════════════════════════════════════ */
function SaleCountdown() {
  // Mock: end date is 5 days, 14 hours from now (persisted via localStorage)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const STORAGE_KEY = 'aura_sale_end';
    let endTime: number;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      endTime = parseInt(stored, 10);
      if (endTime < Date.now()) {
        endTime = Date.now() + 5 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, endTime.toString());
      }
    } else {
      endTime = Date.now() + 5 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, endTime.toString());
    }

    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <span
              className={`text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums ${unit.label === 'Secs' ? 'animate-countdown-pulse' : ''}`}
              style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF' }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span
              className="text-[10px] sm:text-xs uppercase tracking-widest mt-1"
              style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255,255,255,0.6)' }}
            >
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span
              className="text-2xl sm:text-3xl font-bold -mt-4"
              style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SaleView() {
  const setPage = useStore((state) => state.setPage);
  const setSelectedProduct = useStore((state) => state.setSelectedProduct);
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  // Subscribe to wishlist array so component re-renders when wishlist changes.
  // (isInWishlist is a stable function reference and won't trigger re-render on its own.)
  const wishlist = useStore((state) => state.wishlist);
  const isInWishlist = (id: string) => wishlist.includes(id);
  const setCartOpen = useStore((state) => state.setCartOpen);

  const heroBgRef = useRef<HTMLElement>(null);
  const heroBgDivRef = useRef<HTMLDivElement>(null);

  // Filter SALE products
  const saleProducts = useMemo(
    () => products.filter((p) => p.badge === 'SALE'),
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

  // Grid stagger — enhanced y:60 stagger:0.08
  const gridRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%',
  });

  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

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
      {/* Urgency Banner */}
      <div
        className="w-full py-2.5 px-4 flex items-center justify-center gap-2 animate-urgency-pulse"
        style={{ backgroundColor: '#DC2626' }}
      >
        <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
        <span
          className="text-white text-xs sm:text-sm font-semibold tracking-wide uppercase"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Hurry, limited stock!
        </span>
      </div>

      {/* Hero Banner — cleaner overlay so busy background doesn't fight the text */}
      <section
        ref={heroBgRef}
        className="relative w-full min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] overflow-hidden flex items-center justify-center py-16 sm:py-20"
      >
        {/* Background image */}
        <div
          ref={heroBgDivRef}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/pages/sale-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Stronger dark gradient overlay so text always reads clearly */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.75) 50%, rgba(20,20,20,0.9) 100%)',
          }}
        />
        {/* Subtle gold tint to make it feel premium */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Decorative floating orbs */}
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full"
          style={{
            filter: 'blur(60px)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full"
          style={{
            filter: 'blur(70px)',
            background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)',
          }}
        />

        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 breadcrumb-animate">
            <button
              onClick={() => setPage('home')}
              className="text-sm transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
              style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255,255,255,0.7)' }}
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
            <span
              className="text-sm font-medium"
              style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
            >
              Sale
            </span>
          </nav>

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
            <Tag className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[2.5px]" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>
              Limited Time Event
            </span>
          </div>

          <h1
            className="text-white text-[44px] sm:text-[56px] md:text-[72px] font-bold leading-[1.05] mb-4"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 30px rgba(0,0,0,0.4)' }}
          >
            The Aura Sale
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <div className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>

          <p
            className="text-white/85 text-base sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Up to <span style={{ color: '#D4AF37', fontWeight: 600 }}>40% off</span> handcrafted lamps, ceramics, textiles, and greenery. Premium home decor, made affordable.
          </p>

          {/* Countdown Timer — wrapped in a card for clearer separation */}
          <div className="w-full max-w-xl rounded-2xl p-5 sm:p-6 backdrop-blur-sm" style={{ backgroundColor: 'rgba(20,20,20,0.6)', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span
                className="text-[11px] sm:text-xs uppercase tracking-[3px] font-semibold"
                style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
              >
                Sale Ends In
              </span>
            </div>
            <SaleCountdown />
          </div>
        </div>
      </section>

      {/* Products Content */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {saleProducts.length === 0 ? (
            /* ── Empty State ── */
            <AnimatedSection>
              <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                >
                  <Tag className="w-10 h-10" style={{ color: '#D4AF37' }} />
                </div>
                <h2
                  className="text-[#2C2C2C] text-2xl sm:text-3xl font-bold mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  No sale items right now
                </h2>
                <p
                  className="text-[#5A5A5A] text-base sm:text-lg mb-8 max-w-md text-center leading-relaxed"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Our sales are always changing. Check back soon for amazing deals on premium home decor!
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
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Sale Items
                    </h2>
                    <div className="mt-2">
                      <GoldDivider />
                    </div>
                  </div>
                  <span
                    className="text-sm"
                    style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                  >
                    {saleProducts.length} item{saleProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </AnimatedSection>

              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
              >
                {saleProducts.map((product) => {
                  const wishlisted = isInWishlist(product.id);
                  const savingsPercent = product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;
                  return (
                    <div
                      key={product.id}
                      className="group rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]"
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
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.08] p-4"
                        />

                        {/* SALE Badge */}
                        <div
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-sm text-xs font-semibold tracking-wider uppercase"
                          style={{
                            backgroundColor: '#E85D4A',
                            color: '#FFFFFF',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          SALE
                        </div>

                        {/* Savings Badge — positioned bottom-left to avoid overlap with SALE (top-left) and wishlist heart (top-right) */}
                        {product.originalPrice && (
                          <div
                            className="absolute bottom-3 left-3 px-2 py-1 rounded-sm text-xs font-bold"
                            style={{
                              backgroundColor: '#D4AF37',
                              color: '#FFFFFF',
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            -{savingsPercent}%
                          </div>
                        )}

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
                            style={{
                              color: wishlisted ? '#DC2626' : '#8A8A8A',
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
                          style={{ fontFamily: "'Playfair Display', serif" }}
                          onClick={() => handleProductClick(product)}
                        >
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <RatingStars rating={product.rating} />
                          <span
                            className="text-xs"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                          >
                            ({product.reviews})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="text-lg font-bold"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#E85D4A' }}
                          >
                            {formatPKR(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span
                              className="text-sm line-through"
                              style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                            >
                              {formatPKR(product.originalPrice)}
                            </span>
                          )}
                          {product.originalPrice && (
                            <span
                              className="text-xs font-semibold px-1.5 py-0.5 rounded-sm"
                              style={{
                                backgroundColor: 'rgba(232, 93, 74, 0.1)',
                                color: '#E85D4A',
                                fontFamily: "'Poppins', sans-serif",
                              }}
                            >
                              Save {formatPKR(product.originalPrice - product.price)}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer"
                            style={{
                              background: 'linear-gradient(135deg, #D4AF37 0%, #C9A22E 50%, #B8941F 100%)',
                              color: '#FFFFFF',
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="w-11 h-11 rounded-sm flex items-center justify-center transition-all duration-200 cursor-pointer"
                            style={{
                              border: '1px solid #E8D5A3',
                              backgroundColor: wishlisted ? 'rgba(220, 38, 38, 0.06)' : 'transparent',
                            }}
                            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                          >
                            <Heart
                              className="w-4 h-4"
                              style={{
                                color: wishlisted ? '#DC2626' : '#8A8A8A',
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
                <div ref={ctaRef} className="mt-12 sm:mt-16 text-center">
                  <div className="mb-6">
                    <GoldDivider />
                  </div>
                  <p
                    className="text-[#5A5A5A] text-base mb-6"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
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
