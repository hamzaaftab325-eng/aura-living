'use client';

import { useEffect, useRef } from 'react';
import { useGsapFadeIn, useGsapStagger, useGsapScaleIn, gsap } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  ChevronRight,
  Truck,
  ShieldCheck,
  Banknote,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPKR } from '@/data/products';
import PremiumButton from '@/components/ui/PremiumButton';


const paymentMethods = [
  { icon: Banknote, label: 'Cash on Delivery' },
  { icon: ShieldCheck, label: 'JazzCash' },
  { icon: CreditCard, label: 'EasyPaisa' },
];

export default function CartView() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    setPage,
    clearCart,
  } = useStore();

  const cartCount = getCartCount();
  const subtotal = getCartTotal();
  const shipping = subtotal >= 2999 ? 0 : 250;
  const estimatedTotal = subtotal + shipping;

  const heroSectionRef = useRef<HTMLElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%',
  });

  const contentRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.2 });
  // Cart items slide-from-left with stagger
  const itemsRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 25,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 88%',
  });
  // GoldDivider scale-in
  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

  // Enhanced parallax for hero background — 0.5x speed + zoom 1→1.1
  useEffect(() => {
    if (!heroBgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(heroBgRef.current, {
        backgroundPositionY: '50%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
      gsap.fromTo(heroBgRef.current,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, heroSectionRef);
    return () => ctx.revert();
  }, []);

  const handleGoToShop = () => {
    setPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = () => {
    setPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─────────────────── Empty Cart State ─────────────────── */
  if (cart.length === 0) {
    return (
      <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
        {/* Hero */}
        <section
          ref={heroSectionRef}
          className="relative w-full h-[40vh] sm:h-[50vh] overflow-hidden flex items-center justify-center"
        >
          <div
            ref={heroBgRef}
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/images/pages/cart-hero.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.6) 50%, rgba(212,175,55,0.2) 100%)' }}
          />
          <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
            <span
              className="text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
            >
              AURA LIVING
            </span>
            <h1
              className="text-white text-[32px] sm:text-[42px] md:text-[50px] font-bold leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Shopping Cart
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            </div>
          </div>
        </section>

        {/* Empty State */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
          <div ref={contentRef} className="max-w-lg mx-auto text-center">
            <div
              className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-8"
              style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
            >
              <ShoppingBag className="h-11 w-11" style={{ color: '#D4AF37' }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
            >
              Your Cart is Empty
            </h2>
            <p
              className="text-base mb-10 leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
            >
              Looks like you haven&apos;t added anything to your cart yet. Explore our curated collection of handcrafted home decor and find something you love.
            </p>
            <PremiumButton variant="gold" size="lg" onClick={handleGoToShop}>
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </PremiumButton>
          </div>
        </section>
      </div>
    );
  }

  /* ─────────────────── Cart with Items ─────────────────── */
  return (
    <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero */}
      <section
        ref={heroSectionRef}
        className="relative w-full h-[40vh] sm:h-[50vh] overflow-hidden flex items-center justify-center"
      >
        <div
          ref={heroBgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/pages/cart-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.6) 50%, rgba(212,175,55,0.2) 100%)' }}
        />
        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 mb-6 breadcrumb-animate">
            <button
              onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-sm transition-colors duration-200 hover:text-[#D4AF37]"
              style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255,255,255,0.6)' }}
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>
              Cart
            </span>
          </nav>

          <span
            className="text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
          >
            AURA LIVING
          </span>
          <h1
            className="text-white text-[32px] sm:text-[42px] md:text-[50px] font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Shopping Cart
          </h1>
          <p className="text-white/70 text-sm sm:text-base mt-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
          <div className="flex items-center gap-3 mt-5">
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* ─── Cart Items Column ─── */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl sm:text-2xl font-semibold"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
                >
                  Cart Items
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors duration-200 hover:text-red-500 cursor-pointer"
                  style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                >
                  Clear All
                </button>
              </div>
              <div ref={dividerRef} className="mb-4">
                <GoldDivider />
              </div>

              <div ref={itemsRef} className="flex flex-col">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 sm:gap-6 py-6"
                    style={{ borderBottom: '1px solid #E8D5A3' }}
                  >
                    {/* Product Image */}
                    <div
                      className="shrink-0 w-24 h-24 rounded-lg overflow-hidden"
                      style={{ border: '1px solid #E8D5A3', backgroundColor: '#FFFDF7' }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3
                            className="text-base sm:text-lg font-semibold leading-tight truncate"
                            style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
                          >
                            {item.product.name}
                          </h3>
                          <p
                            className="text-xs sm:text-sm mt-0.5 capitalize"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                          >
                            {item.product.category.replace('-', ' ')}
                          </p>
                          <p
                            className="text-sm mt-1"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}
                          >
                            {formatPKR(item.product.price)} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="shrink-0 p-2 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-400 cursor-pointer"
                          style={{ color: '#B0B0B0' }}
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity Controls & Item Total */}
                      <div className="flex items-center justify-between mt-3">
                        <div
                          className="flex items-center rounded-full"
                          style={{ border: '1px solid #E8D5A3', backgroundColor: 'rgba(245,237,218,0.3)' }}
                        >
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 hover:bg-[#F5EDDA] active:scale-[0.85] cursor-pointer"
                            style={{ color: '#5A5A5A' }}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            className="w-9 text-center text-sm font-semibold"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 hover:bg-[#F5EDDA] active:scale-[0.85] cursor-pointer"
                            style={{ color: '#5A5A5A' }}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span
                          className="text-base sm:text-lg font-bold"
                          style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                        >
                          {formatPKR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <button
                  onClick={handleGoToShop}
                  className="text-sm font-medium transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
                  style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}
                >
                  &larr; Continue Shopping
                </button>
              </div>
            </div>

            {/* ─── Order Summary Sidebar ─── */}
            <div className="lg:col-span-1">
              <div
                className="rounded-sm p-6 sm:p-8 sticky top-8"
                style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
              >
                <h2
                  className="text-xl sm:text-2xl font-semibold mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
                >
                  Order Summary
                </h2>
                <div className="mb-6">
                  <GoldDivider />
                </div>

                {/* Summary Lines */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}
                    >
                      Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                    >
                      {formatPKR(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}
                    >
                      Shipping
                    </span>
                    {shipping === 0 ? (
                      <span
                        className="text-sm font-semibold"
                        style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
                      >
                        Free
                      </span>
                    ) : (
                      <span
                        className="text-sm font-semibold"
                        style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                      >
                        {formatPKR(shipping)}
                      </span>
                    )}
                  </div>

                  {shipping > 0 && (
                    <p
                      className="text-[11px]"
                      style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                    >
                      Free shipping on orders above PKR 2,999
                    </p>
                  )}
                  {shipping === 0 && (
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
                      <p
                        className="text-[11px]"
                        style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
                      >
                        You qualify for free shipping!
                      </p>
                    </div>
                  )}
                </div>

                <div className="h-px my-5" style={{ backgroundColor: 'rgba(212,175,55,0.3)' }} />

                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                  >
                    Estimated Total
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                  >
                    {formatPKR(estimatedTotal)}
                  </span>
                </div>

                {/* Checkout Button */}
                <PremiumButton
                  variant="gold"
                  size="lg"
                  fullWidth
                  onClick={handleProceedToCheckout}
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to Checkout
                </PremiumButton>

                {/* Continue Shopping Link */}
                <button
                  onClick={handleGoToShop}
                  className="w-full text-center text-sm font-medium py-3 mt-2 transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
                  style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}
                >
                  Continue Shopping
                </button>

                {/* Payment Methods */}
                <div className="mt-6 pt-5" style={{ borderTop: '1px solid #E8D5A3' }}>
                  <p
                    className="text-xs tracking-wider uppercase mb-3 text-center"
                    style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                  >
                    Accepted Payment Methods
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.label}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                        >
                          <method.icon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                        </div>
                        <span
                          className="text-[10px] text-center leading-tight"
                          style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                        >
                          {method.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
