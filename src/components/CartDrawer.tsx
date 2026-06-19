'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard, Truck, Shield } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPKR } from '@/data/products';

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    cartOpen,
    setCartOpen,
    setPage,
  } = useStore();

  // Avoid hydration mismatch from persisted cart state
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  const cartCount = hydrated ? getCartCount() : 0;
  const subtotal = hydrated ? getCartTotal() : 0;
  const FREE_SHIPPING_THRESHOLD = 2999;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const estimatedTotal = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isOpenRef = useRef(false);

  const handleClose = useCallback(() => setCartOpen(false), [setCartOpen]);

  const handleCheckout = () => {
    handleClose();
    setPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToShop = useCallback(() => {
    handleClose();
    setPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleClose, setPage]);

  // Animate drawer open/close with GSAP
  useEffect(() => {
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;
    if (!drawer || !overlay) return;

    if (cartOpen && !isOpenRef.current) {
      isOpenRef.current = true;
      document.body.style.overflow = 'hidden';
      gsap.fromTo(
        drawer,
        { x: '100%' },
        { x: 0, duration: 0.4, ease: 'power3.out' }
      );
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      overlay.style.pointerEvents = 'auto';
      setTimeout(() => closeBtnRef.current?.focus(), 100);
    } else if (!cartOpen && isOpenRef.current) {
      isOpenRef.current = false;
      gsap.to(drawer, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          document.body.style.overflow = '';
        },
      });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          overlay.style.pointerEvents = 'none';
        },
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  // Escape-to-close + focus trap when drawer is open
  useEffect(() => {
    if (!cartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setCartOpen(false);
        return;
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [cartOpen, setCartOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
        style={{ opacity: 0, pointerEvents: 'none' }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer Panel — redesigned with more breathing room */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[440px] sm:max-w-[94vw] shadow-2xl flex flex-col"
        style={{ backgroundColor: '#FFFDF7', transform: 'translateX(100%)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header — with subtle gold accent bar */}
        <div className="relative shrink-0">
          <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }} />
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #F5EDDA' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}>
                <ShoppingBag className="w-4 h-4" style={{ color: '#D4AF37' }} />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-wide" style={{ color: '#2C2C2C' }}>
                  Your Cart
                </h2>
                {cartCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-bold text-white px-1.5" style={{ backgroundColor: '#D4AF37' }}>
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
            <button
              ref={closeBtnRef}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-[#F5EDDA]"
              style={{ color: '#5A5A5A' }}
              onClick={handleClose}
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Free shipping progress bar (only when items in cart) */}
        {cart.length > 0 && (
          <div className="shrink-0 px-6 py-4" style={{ borderBottom: '1px solid #F5EDDA', backgroundColor: 'rgba(245, 237, 218, 0.3)' }}>
            {amountToFreeShipping > 0 ? (
              <p className="text-xs sm:text-sm mb-2 text-center" style={{ color: '#5A5A5A' }}>
                Add <span className="font-semibold" style={{ color: '#D4AF37' }}>{formatPKR(amountToFreeShipping)}</span> more for <span className="font-semibold" style={{ color: '#D4AF37' }}>FREE shipping</span>
              </p>
            ) : (
              <p className="text-xs sm:text-sm mb-2 text-center flex items-center justify-center gap-1.5" style={{ color: '#22C55E' }}>
                <Truck className="w-3.5 h-3.5" />
                <span className="font-semibold">Yay! You&apos;ve unlocked FREE shipping</span>
              </p>
            )}
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F5EDDA' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%`,
                  background: freeShippingProgress >= 100
                    ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                    : 'linear-gradient(90deg, #D4AF37, #E8D5A3)',
                }}
              />
            </div>
          </div>
        )}

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {cart.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center px-6 py-20 min-h-full"
              style={{ animation: 'cartFadeIn 0.4s ease forwards' }}
            >
              <div className="flex items-center justify-center w-24 h-24 rounded-full mb-6" style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}>
                <ShoppingBag className="h-11 w-11" style={{ color: '#D4AF37' }} />
              </div>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: '#2C2C2C' }}>
                Your cart is empty
              </h3>
              <p className="text-sm text-center mb-8 max-w-[280px] leading-relaxed" style={{ color: '#8A8A8A' }}>
                Looks like you haven&apos;t added anything yet. Start exploring our handcrafted collection and find pieces you&apos;ll love.
              </p>
              <button
                onClick={handleGoToShop}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: '#D4AF37' }}
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="px-6 py-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="cart-item flex gap-4 py-5"
                  style={{ animationDelay: `${index * 0.06}s`, borderBottom: '1px solid #F5EDDA' }}
                >
                  {/* Product Image */}
                  <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden" style={{ border: '1px solid #F5EDDA', backgroundColor: '#FFFDF7' }}>
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold leading-tight" style={{ color: '#2C2C2C' }}>
                          {item.product.name}
                        </h4>
                        <p className="text-xs mt-0.5 capitalize" style={{ color: '#8A8A8A' }}>
                          {item.product.category.replace('-', ' ')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                        style={{ color: '#B0B0B0' }}
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Quantity & Item Total */}
                    <div className="flex items-center justify-between mt-4 gap-3">
                      <div className="flex items-center rounded-full" style={{ border: '1.5px solid #E8D5A3', backgroundColor: '#FFFDF7' }}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]"
                          style={{ color: '#5A5A5A' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold" style={{ color: '#2C2C2C' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]"
                          style={{ color: '#5A5A5A' }}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold block" style={{ color: '#2C2C2C' }}>
                          {formatPKR(item.product.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[11px]" style={{ color: '#8A8A8A' }}>
                            {formatPKR(item.product.price)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary — cleaner layout */}
        {cart.length > 0 && (
          <div className="shrink-0 px-6 pt-5 pb-6" style={{ borderTop: '2px solid #D4AF37', backgroundColor: '#FFFDF7' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: '#5A5A5A' }}>Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
              <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{formatPKR(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm flex items-center gap-1.5" style={{ color: '#5A5A5A' }}>
                <Truck className="w-3.5 h-3.5" />
                Shipping
              </span>
              {shipping === 0 ? (
                <span className="text-sm font-bold" style={{ color: '#22C55E' }}>FREE</span>
              ) : (
                <span className="text-sm font-semibold" style={{ color: '#2C2C2C' }}>{formatPKR(shipping)}</span>
              )}
            </div>

            <div className="h-px my-3" style={{ backgroundColor: '#E8D5A3' }} />

            <div className="flex items-center justify-between mb-5">
              <span className="text-base font-semibold" style={{ color: '#2C2C2C' }}>Estimated Total</span>
              <span className="text-xl font-bold" style={{ color: '#2C2C2C' }}>{formatPKR(estimatedTotal)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="group w-full flex items-center justify-center gap-2 py-4 rounded-full text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] active:scale-[0.99] mb-3 cursor-pointer"
              style={{ backgroundColor: '#D4AF37' }}
            >
              <CreditCard className="h-4 w-4" />
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleGoToShop}
              className="w-full text-center text-sm font-medium py-2 transition-colors duration-200 hover:underline cursor-pointer"
              style={{ color: '#5A5A5A' }}
            >
              Continue Shopping
            </button>

            {/* Trust signals */}
            <div className="mt-4 pt-4 flex items-center justify-center gap-4 flex-wrap" style={{ borderTop: '1px solid #F5EDDA' }}>
              <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: '#8A8A8A' }}>
                <Shield className="w-3 h-3" style={{ color: '#D4AF37' }} />
                Secure Checkout
              </span>
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: '#8A8A8A' }}>
                COD · JazzCash · EasyPaisa
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cart item animations are in globals.css */}
    </>
  );
}
