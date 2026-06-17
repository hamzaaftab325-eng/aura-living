'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPKR } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

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

  const cartCount = getCartCount();
  const subtotal = getCartTotal();
  const shipping = subtotal >= 2999 ? 0 : 250;
  const estimatedTotal = subtotal + shipping;

  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);
  const { toast } = useToast();

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
      // Opening: slide drawer in from right
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
    } else if (!cartOpen && isOpenRef.current) {
      // Closing: slide drawer out to right
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

  return (
    <>
      {/* Overlay — GSAP animated opacity */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[60] bg-black/50"
        style={{ opacity: 0, pointerEvents: 'none' }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[420px] shadow-2xl flex flex-col"
        style={{ backgroundColor: '#FFFDF7', transform: 'translateX(100%)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0" style={{ borderBottom: '1px solid #F5EDDA' }}>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-wide" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}>
              Your Cart
            </h2>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-bold text-white px-1.5" style={{ backgroundColor: '#D4AF37' }}>
                {cartCount}
              </span>
            )}
          </div>
          <button
            className="p-2 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]"
            style={{ color: '#5A5A5A' }}
            onClick={handleClose}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {cart.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center px-6 py-20 min-h-full"
              style={{ animation: 'cartFadeIn 0.4s ease forwards' }}
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}>
                <ShoppingBag className="h-9 w-9" style={{ color: '#D4AF37' }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}>
                Your cart is empty
              </h3>
              <p className="text-sm text-center mb-8 max-w-[250px]" style={{ color: '#8A8A8A', fontFamily: "'Poppins', sans-serif" }}>
                Looks like you haven&apos;t added anything to your cart yet. Start exploring our beautiful collection!
              </p>
              <button
                onClick={handleGoToShop}
                className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}
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
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  {/* Product Image */}
                  <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden" style={{ border: '1px solid #F5EDDA', backgroundColor: '#FFFDF7' }}>
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold leading-tight truncate" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>
                          {item.product.name}
                        </h4>
                        <p className="text-xs mt-0.5 capitalize" style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}>
                          {item.product.category.replace('-', ' ')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="shrink-0 p-1 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-400"
                        style={{ color: '#B0B0B0' }}
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Quantity & Item Total */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center rounded-full" style={{ border: '1px solid #E8D5A3', backgroundColor: 'rgba(245,237,218,0.3)' }}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]"
                          style={{ color: '#5A5A5A' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]"
                          style={{ color: '#5A5A5A' }}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>
                        {formatPKR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="shrink-0 px-6 pt-5 pb-6" style={{ borderTop: '1px solid #F5EDDA', backgroundColor: '#FFFDF7' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}>Subtotal</span>
              <span className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>{formatPKR(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}>Shipping</span>
              {shipping === 0 ? (
                <span className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>Free</span>
              ) : (
                <span className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>{formatPKR(shipping)}</span>
              )}
            </div>
            {shipping > 0 && (
              <p className="text-[11px] mb-3" style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}>Free shipping on orders above PKR 2,999</p>
            )}
            {shipping === 0 && (
              <p className="text-[11px] mb-3" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>Free above PKR 2,999</p>
            )}

            <div className="h-px my-3" style={{ backgroundColor: 'rgba(212,175,55,0.3)' }} />

            <div className="flex items-center justify-between mb-5">
              <span className="text-base font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>Estimated Total</span>
              <span className="text-base font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>{formatPKR(estimatedTotal)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] mb-3 cursor-pointer"
              style={{ backgroundColor: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}
            >
              <CreditCard className="h-4 w-4" />
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={handleGoToShop}
              className="w-full text-center text-sm font-medium py-2 transition-colors duration-200 hover:underline"
              style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}
            >
              Continue Shopping
            </button>

            <p className="text-center text-[11px] mt-3 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", color: '#B0B0B0' }}>
              COD &bull; JazzCash &bull; EasyPaisa
            </p>
          </div>
        )}
      </div>

        {/* Cart item animations are in globals.css */}
    </>
  );
}
