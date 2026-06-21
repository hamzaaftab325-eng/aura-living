'use client';

import { useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useScrollReveal, useStaggerReveal, useTextReveal, useScaleIn } from '@/hooks/useAnimations';
import gsap from 'gsap';;
import { GoldDivider } from '@/components/SVGDecorations';
import { Heart, ShoppingCart, Star, ShoppingBag } from 'lucide-react';
import { useStore, badgeColors } from '@/store/useStore';
import { useCartActions } from '@/hooks/useCartActions';
import { products, formatPKR } from '@/data/products';
import Link from 'next/link';
import PremiumButton from '@/components/ui/PremiumButton';
import Breadcrumb from '@/components/ui/Breadcrumb';


/* ═══════════════════════════════════════════════════════════
   AnimatedSection — uses useStaggerReveal for children reveal
   ═══════════════════════════════════════════════════════════ */
function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useStaggerReveal<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.15,
    ease: 'power3.out',
    start: 'top 80%' });

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
          style={{ color: star <= Math.round(rating) ? 'var(--color-gold)' : 'var(--color-gold-soft)',
            fill: star <= Math.round(rating) ? 'var(--color-gold)' : 'none' }}
        />
      ))}
    </div>
  );
}

export default function WishlistView() {
  const wishlist = useStore((state) => state.wishlist);
  const { handleToggleWishlist: toggleWishlist, handleAddToCart: addToCart } = useCartActions();

  const headerSectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  // Filter products to only wishlist items
  const wishlistProducts = useMemo(
    () => products.filter((p) => wishlist.includes(p.id)),
    [wishlist]
  );

  // GSAP fade-in for header
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });
  // Hero heading blur text
  const heroTitleRef = useTextReveal<HTMLHeadingElement>({ duration: 0.5, stagger: 0.03, start: 'top 90%' });
  // GoldDivider scale-in
  const dividerRef = useScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

  // Grid stagger — enhanced y:60 stagger:0.08
  const gridRef = useStaggerReveal<HTMLDivElement>({
    selector: ':scope > div',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%' });

  // Enhanced parallax for hero section — 0.5x speed + zoom 1→1.1
  useEffect(() => {
    if (!heroBgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(heroBgRef.current, {
        backgroundPositionY: '50%',
        ease: 'none',
        scrollTrigger: {
          trigger: headerSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5 } });
      gsap.fromTo(heroBgRef.current,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: headerSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true } }
      );
    }, headerSectionRef);
    return () => ctx.revert();
  }, []);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, { openCart: true });
  };

  return (
    <div className="w-full page-transition" >
      {/* Hero Banner */}
      <section
        ref={headerSectionRef}
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center"
      >
        {/* Background Image */}
        <div
          ref={heroBgRef}
          className="absolute inset-0"
          style={{ backgroundImage: "url('/images/pages/wishlist-hero.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat' }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background:
              'linear-gradient(135deg, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.6) 50%, rgba(212,175,55,0.2) 100%)' }}
        />

        {/* Decorative floating orbs */}
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
        />

        <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">

          <h1
            ref={heroTitleRef}
            className="aura-hero-title text-white"
            
          >
            Your Wishlist
          </h1>

          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>

          <p
            className="text-white/70 text-base sm:text-lg max-w-md mx-auto mt-4 leading-relaxed"
            
          >
            {wishlistProducts.length > 0
              ? `${wishlistProducts.length} item${wishlistProducts.length !== 1 ? 's' : ''} you love`
              : 'Save the pieces that speak to you'}
          </p>
        </div>
      </section>
      {/* Breadcrumb strip (below hero) */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Wishlist' },
        ]}
      />

      {/* Wishlist Content */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            /* ── Empty State ── */
            <AnimatedSection>
              <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  
                >
                  <Heart className="w-10 h-10"  />
                </div>
                <h2
                  className="aura-text-primary aura-h2 mb-3"
                  
                >
                  Your wishlist is empty
                </h2>
                <p
                  className="aura-text-secondary text-base sm:text-lg mb-8 max-w-md text-center leading-relaxed"
                  
                >
                  Start adding items you love by tapping the heart icon on any product. Your favorite pieces will appear here.
                </p>
                <PremiumButton variant="primary" href="/shop">
                  <ShoppingBag className="w-4 h-4" />
                  Explore Our Collection
                </PremiumButton>
              </div>
            </AnimatedSection>
          ) : (
            /* ── Wishlist Grid ── */
            <>
              <AnimatedSection>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2
                      className="aura-text-primary text-xl sm:text-2xl font-semibold"
                      
                    >
                      Saved Items
                    </h2>
                    <div className="mt-2">
                      <GoldDivider />
                    </div>
                  </div>
                  <span
                    className="text-sm"
                    
                  >
                    {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </AnimatedSection>

              <div
                ref={gridRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[var(--color-gold)]"
                    
                  >
                    {/* Product Image */}
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative w-full aspect-[3/4] overflow-hidden block"
                      onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      aria-label={`View ${product.name} details`}
                    >
                      <Image
        src={product.image}
                        alt={product.name}
                        fill
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <div
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-sm text-xs font-semibold tracking-wider uppercase"
                          style={{ backgroundColor: badgeColors[product.badge]?.bg,
                            color: badgeColors[product.badge]?.text }}
                        >
                          {product.badge}
                        </div>
                      )}

                      {/* Remove from wishlist button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          toggleWishlist(product.id, product.name);
                        }}
                        className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer animate-heartbeat"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        aria-label="Remove from wishlist"
                      >
                        <Heart className="w-4.5 h-4.5" style={{ fill: 'var(--color-danger)' }} />
                      </button>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4 sm:p-5">
                      {/* Name */}
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="aura-text-primary text-base sm:text-lg font-semibold mb-1.5 transition-colors duration-200 hover:aura-text-gold leading-snug block"
                      >
                        {product.name}
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <RatingStars rating={product.rating} />
                        <span
                          className="text-xs"
                          
                        >
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className="text-lg font-bold"
                          
                        >
                          {formatPKR(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span
                            className="text-sm line-through"
                            
                          >
                            {formatPKR(product.originalPrice)}
                          </span>
                        )}
                        {product.originalPrice && (
                          <span
                            className="text-xs font-semibold px-1.5 py-0.5 rounded-sm"
                          >
                            {product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0}% OFF
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="premium-btn btn-primary btn-sm flex-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(product.id, product.name)}
                          className="w-11 h-11 rounded-sm flex items-center justify-center transition-all duration-200 hover:bg-red-50 cursor-pointer"
                          
                          aria-label="Remove from wishlist"
                        >
                          <Heart className="w-4 h-4" style={{ fill: 'var(--color-danger)' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping CTA */}
              <AnimatedSection>
                <div className="mt-12 sm:mt-16 text-center">
                  <div className="mb-6">
                    <GoldDivider />
                  </div>
                  <p
                    className="aura-text-secondary text-base mb-6"
                    
                  >
                    Discover more pieces to add to your wishlist
                  </p>
                  <PremiumButton variant="secondary" href="/shop">
                    <ShoppingBag className="w-4 h-4" />
                    Continue Shopping
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
