'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPKR } from '@/data/products';
import { trapFocus, focusFirst } from '@/lib/focusTrap';

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

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);

  const handleClose = useCallback(() => setCartOpen(false), [setCartOpen]);

  const handleCheckout = () => {
    handleClose();
    setPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCart = () => {
    handleClose();
    setPage('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToShop = useCallback(() => {
    handleClose();
    setPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleClose, setPage]);

  // Animate modal open/close
  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    if (!overlay || !modal) return;

    if (cartOpen && !isOpenRef.current) {
      isOpenRef.current = true;
      document.body.style.overflow = 'hidden';
      // Overlay fade in
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      // Modal scale + slide up
      gsap.fromTo(modal,
        { opacity: 0, scale: 0.92, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    } else if (!cartOpen && isOpenRef.current) {
      isOpenRef.current = false;
      gsap.to(modal, {
        opacity: 0, scale: 0.95, y: 20, duration: 0.2, ease: 'power2.in',
        onComplete: () => { document.body.style.overflow = ''; },
      });
      gsap.to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' });
    }

    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  // Escape + focus trap + restore focus
  useEffect(() => {
    if (!cartOpen) return;

    // Save currently focused element to restore later
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setCartOpen(false); return; }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Move focus into modal once it's mounted
    const t = setTimeout(() => focusFirst(modalRef.current), 100);

    // Install focus trap
    const releaseTrap = trapFocus(modalRef.current);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(t);
      releaseTrap();
      // Restore focus
      previouslyFocused?.focus?.();
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[2px]"
        style={{ opacity: 0 }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal — centered popup */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          className="relative w-full max-w-lg max-h-[85vh] rounded-2xl flex flex-col overflow-hidden pointer-events-auto"
          style={{
            backgroundColor: 'var(--surface-card)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            border: '1px solid var(--color-gold-soft)',
            opacity: 0,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
        >
          {/* Gold top accent */}
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-gold to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid var(--color-gold-soft)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}>
                <ShoppingBag className="w-4 h-4 text-gold-text" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--surface-dark)' }}>
                  Your Cart
                </h2>
                {cartCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-bold text-white px-1.5 bg-gold">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gold/10"
              style={{ color: 'var(--color-warm-gray)' }}
              onClick={handleClose}
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free shipping progress */}
          {cart.length > 0 && (
            <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--color-gold-soft)', backgroundColor: 'rgba(245,237,218,0.3)' }}>
              {amountToFreeShipping > 0 ? (
                <p className="text-xs mb-2 text-center" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-warm-gray)' }}>
                  Add <span className="font-semibold text-gold-text">{formatPKR(amountToFreeShipping)}</span> more for{' '}
                  <span className="font-semibold text-gold-text">FREE shipping</span>
                </p>
              ) : (
                <p className="text-xs mb-2 text-center flex items-center justify-center gap-1.5" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-success)' }}>
                  <Truck className="w-3.5 h-3.5" />
                  <span className="font-semibold">FREE shipping unlocked!</span>
                </p>
              )}
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-gold-pale)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${freeShippingProgress}%`,
                    background: freeShippingProgress >= 100
                      ? 'linear-gradient(90deg, var(--color-success), #16A34A)'
                      : 'linear-gradient(90deg, var(--color-gold), var(--color-gold-soft))',
                  }}
                />
              </div>
            </div>
          )}

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 min-h-full">
                <div className="flex items-center justify-center w-20 h-20 rounded-full mb-5" style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}>
                  <ShoppingBag className="h-10 w-10 text-gold-text" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--surface-dark)' }}>
                  Your cart is empty
                </h3>
                <p className="text-sm text-center mb-6 max-w-[260px]" style={{ color: 'var(--color-muted-gray)', fontFamily: "'Poppins', sans-serif" }}>
                  Start exploring our handcrafted collection and find pieces you&apos;ll love.
                </p>
                <button
                  onClick={handleGoToShop}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                  style={{ backgroundColor: 'var(--color-gold)', fontFamily: "'Poppins', sans-serif" }}
                >
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="px-6 py-3">
                {cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="cart-item flex gap-4 py-4"
                    style={{ borderBottom: '1px solid var(--color-gold-soft)' }}
                  >
                    <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden relative" style={{ border: '1px solid var(--color-gold-soft)', backgroundColor: 'var(--surface-card)' }}>
                      <Image src={item.product.image} alt={item.product.name} fill className="w-full h-full object-contain" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold leading-tight" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--surface-dark)' }}>
                            {item.product.name}
                          </h4>
                          <p className="text-xs mt-0.5 capitalize" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-muted-gray)' }}>
                            {item.product.category.replace('-', ' ')}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-500"
                          style={{ color: '#B0B0B0' }}
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 gap-3">
                        <div className="flex items-center rounded-full" style={{ border: '1.5px solid var(--color-gold-soft)', backgroundColor: 'var(--surface-card)' }}>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-gold/10"
                            style={{ color: 'var(--color-warm-gray)' }}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={99}
                            value={item.quantity}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              if (Number.isFinite(v)) {
                                updateQuantity(item.product.id, Math.max(1, Math.min(99, v)));
                              }
                            }}
                            onBlur={(e) => {
                              const v = parseInt(e.target.value, 10);
                              if (!Number.isFinite(v) || v < 1) {
                                updateQuantity(item.product.id, 1);
                              }
                            }}
                            className="w-12 text-center text-sm font-bold bg-transparent focus:outline-none"
                            style={{ color: 'var(--surface-dark)' }}
                            aria-label={`Quantity for ${item.product.name}`}
                          />
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-gold/10"
                            style={{ color: 'var(--color-warm-gray)' }}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--surface-dark)' }}>
                          {formatPKR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="shrink-0 px-6 pt-4 pb-5" style={{ borderTop: '2px solid var(--color-gold)', backgroundColor: 'var(--surface-card)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-warm-gray)' }}>
                  Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})
                </span>
                <span className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--surface-dark)' }}>
                  {formatPKR(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm flex items-center gap-1.5" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-warm-gray)' }}>
                  <Truck className="w-3.5 h-3.5" />
                  Shipping
                </span>
                {shipping === 0 ? (
                  <span className="text-sm font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-success)' }}>FREE</span>
                ) : (
                  <span className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--surface-dark)' }}>
                    {formatPKR(shipping)}
                  </span>
                )}
              </div>
              <div className="h-px my-3" style={{ backgroundColor: 'var(--color-gold-soft)' }} />
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--surface-dark)' }}>
                  Estimated Total
                </span>
                <span className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--surface-dark)' }}>
                  {formatPKR(estimatedTotal)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] active:scale-[0.99] mb-2 cursor-pointer"
                style={{ backgroundColor: 'var(--color-gold)', fontFamily: "'Poppins', sans-serif" }}
              >
                <CreditCard className="h-4 w-4" />
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleViewCart}
                className="w-full text-center text-sm font-medium py-2 transition-colors hover:underline cursor-pointer"
                style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-warm-gray)' }}
              >
                View Full Cart
              </button>

              <div className="mt-3 pt-3 flex items-center justify-center gap-4" style={{ borderTop: '1px solid var(--color-gold-soft)' }}>
                <span className="inline-flex items-center gap-1 text-[11px]" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-muted-gray)' }}>
                  <Shield className="w-3.5 h-3.5 text-gold-text" />
                  Secure
                </span>
                <span className="text-[11px] font-semibold tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--color-muted-gray)' }}>
                  COD · JazzCash · EasyPaisa
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
