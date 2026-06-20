'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard, Truck, Shield, CheckCircle, Tag, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPKR } from '@/data/products';
import { trapFocus, focusFirst } from '@/lib/focusTrap';
import { useToast } from '@/hooks/use-toast';
import PremiumButton from '@/components/ui/PremiumButton';

type CouponCode = 'AURA15' | 'WELCOME10';
const VALID_COUPONS: Record<CouponCode, { discount: number; label: string }> = {
  AURA15: { discount: 0.15, label: '15% off' },
  WELCOME10: { discount: 0.10, label: '10% off (welcome)' },
};

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, cartOpen, setCartOpen } = useStore();
  const router = useRouter();
  const { toast } = useToast();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  const cartCount = hydrated ? getCartCount() : 0;
  const subtotal = hydrated ? getCartTotal() : 0;

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);

  const FREE_SHIPPING_THRESHOLD = 2999;
  const discount = appliedCoupon ? Math.round(subtotal * VALID_COUPONS[appliedCoupon].discount) : 0;
  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const estimatedTotal = discountedSubtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const freeShippingProgress = Math.min(100, (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);

  const handleClose = useCallback(() => setCartOpen(false), [setCartOpen]);

  const handleCheckout = () => {
    handleClose();
    router.push('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCart = () => {
    handleClose();
    router.push('/cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToShop = useCallback(() => {
    handleClose();
    router.push('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleClose, router]);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase() as CouponCode;
    if (code in VALID_COUPONS) {
      setAppliedCoupon(code);
      toast({
        title: 'Coupon applied!',
        description: `${VALID_COUPONS[code].label} discount applied to your order.`,
      });
      setCouponInput('');
    } else {
      toast({
        title: 'Invalid coupon',
        description: 'This coupon code is not valid. Try AURA15 or WELCOME10.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast({ title: 'Coupon removed' });
  };

  // Slide-in animation (right-side drawer)
  useEffect(() => {
    const overlay = overlayRef.current;
    const drawer = drawerRef.current;
    if (!overlay || !drawer) return;

    if (cartOpen && !isOpenRef.current) {
      isOpenRef.current = true;
      document.body.style.overflow = 'hidden';
      // Overlay fade in
      overlay.style.opacity = '0';
      requestAnimationFrame(() => {
        overlay.style.transition = 'opacity 250ms ease-out';
        overlay.style.opacity = '1';
      });
      // Drawer slide in from right
      drawer.style.transform = 'translateX(100%)';
      drawer.style.opacity = '0';
      requestAnimationFrame(() => {
        drawer.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease-out';
        drawer.style.transform = 'translateX(0)';
        drawer.style.opacity = '1';
      });
    } else if (!cartOpen && isOpenRef.current) {
      isOpenRef.current = false;
      drawer.style.transition = 'transform 200ms cubic-bezier(0.65, 0, 0.35, 1), opacity 200ms ease-in';
      drawer.style.transform = 'translateX(100%)';
      drawer.style.opacity = '0';
      overlay.style.transition = 'opacity 200ms ease-in';
      overlay.style.opacity = '0';
      const t = setTimeout(() => {
        document.body.style.overflow = '';
      }, 220);
      return () => clearTimeout(t);
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

    // Move focus into drawer once it's mounted
    const t = setTimeout(() => focusFirst(drawerRef.current), 120);

    // Install focus trap
    const releaseTrap = trapFocus(drawerRef.current);

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
        className="fixed inset-0 z-[70]"
        style={{
          backgroundColor: 'rgba(44, 44, 44, 0.5)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: 0,
        }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer — right slide-in */}
      <div
        className="fixed inset-0 z-[80] flex justify-end pointer-events-none"
        role="presentation"
      >
        <aside
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          className="relative h-full w-full max-w-[420px] flex flex-col pointer-events-auto shadow-2xl"
          style={{
            backgroundColor: 'var(--surface-card)',
            transform: 'translateX(100%)',
            opacity: 0,
          }}
        >
          {/* Gold top accent */}
          <div className="h-[3px] w-full shrink-0" style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid var(--color-gold-soft)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
              >
                <ShoppingBag className="w-4 h-4 text-gold-text" />
              </div>
              <div className="flex items-center gap-2">
                <h2
                  id="cart-drawer-title"
                  className="text-lg font-bold"
                  style={{ color: 'var(--surface-dark)' }}
                >
                  Your Cart
                </h2>
                {cartCount > 0 && (
                  <span
                    className="flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-bold text-white px-1.5"
                    style={{ backgroundColor: 'var(--color-gold)' }}
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
              style={{ color: 'var(--color-warm-gray)' }}
              onClick={handleClose}
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free shipping progress */}
          {cart.length > 0 && (
            <div
              className="px-5 py-3 shrink-0"
              style={{ borderBottom: '1px solid var(--color-gold-soft)', backgroundColor: 'rgba(245,237,218,0.3)' }}
            >
              {amountToFreeShipping > 0 ? (
                <p className="text-xs mb-2 text-center" style={{ color: 'var(--color-warm-gray)' }}>
                  Add <span className="font-semibold text-gold-text">{formatPKR(amountToFreeShipping)}</span> more for{' '}
                  <span className="font-semibold text-gold-text">FREE shipping</span>
                </p>
              ) : (
                <p
                  className="text-xs mb-2 text-center flex items-center justify-center gap-1.5 font-semibold"
                  style={{ color: 'var(--color-success)' }}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  FREE shipping unlocked!
                </p>
              )}
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-gold-pale)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${freeShippingProgress}%`,
                    background:
                      freeShippingProgress >= 100
                        ? 'linear-gradient(90deg, var(--color-success), #16A34A)'
                        : 'linear-gradient(90deg, var(--color-gold), var(--color-gold-soft))',
                  }}
                />
              </div>
            </div>
          )}

          {/* Cart Content — scrollable */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 min-h-full">
                <div
                  className="flex items-center justify-center w-20 h-20 rounded-full mb-5"
                  style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                >
                  <ShoppingBag className="h-10 w-10 text-gold-text" />
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: 'var(--surface-dark)' }}
                >
                  Your cart is empty
                </h3>
                <p
                  className="text-sm text-center mb-6 max-w-[260px]"
                  style={{ color: 'var(--color-muted-gray)' }}
                >
                  Start exploring our handcrafted collection and find pieces you&apos;ll love.
                </p>
                <PremiumButton
                  variant="primary"
                  onClick={handleGoToShop}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Start Shopping
                </PremiumButton>
              </div>
            ) : (
              <div className="px-5 py-2">
                {cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex gap-3 py-4"
                    style={{ borderBottom: '1px solid var(--color-gold-soft)' }}
                  >
                    <div
                      className="shrink-0 w-16 h-16 rounded-lg overflow-hidden relative"
                      style={{ border: '1px solid var(--color-gold-soft)', backgroundColor: 'var(--surface-card)' }}
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="w-full h-full object-contain"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4
                            className="text-sm font-semibold leading-tight line-clamp-2"
                            style={{ color: 'var(--surface-dark)' }}
                          >
                            {item.product.name}
                          </h4>
                          <p
                            className="text-xs mt-0.5 capitalize"
                            style={{ color: 'var(--color-muted-gray)' }}
                          >
                            {item.product.category.replace('-', ' ')}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.product.id);
                            toast({ title: 'Removed', description: `${item.product.name} removed from cart.` });
                          }}
                          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-500"
                          style={{ color: 'var(--color-muted-gray)' }}
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 gap-3">
                        <div
                          className="flex items-center rounded-full"
                          style={{ border: '1.5px solid var(--color-gold-soft)', backgroundColor: 'var(--surface-card)' }}
                        >
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/5"
                            style={{ color: 'var(--color-warm-gray)' }}
                            aria-label={`Decrease quantity of ${item.product.name}`}
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
                            className="w-12 text-center text-sm font-bold bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{ color: 'var(--surface-dark)' }}
                            aria-label={`Quantity for ${item.product.name}`}
                          />
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/5"
                            style={{ color: 'var(--color-warm-gray)' }}
                            aria-label={`Increase quantity of ${item.product.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-sm font-bold block"
                            style={{ color: 'var(--surface-dark)' }}
                          >
                            {formatPKR(item.product.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span
                              className="text-[10px]"
                              style={{ color: 'var(--color-muted-gray)' }}
                            >
                              {formatPKR(item.product.price)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon code input */}
                <div className="py-4">
                  {appliedCoupon ? (
                    <div
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.08)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                        <div>
                          <p
                            className="text-xs font-bold"
                            style={{ color: 'var(--color-success)' }}
                          >
                            {appliedCoupon}
                          </p>
                          <p
                            className="text-[10px]"
                            style={{ color: 'var(--color-warm-gray)' }}
                          >
                            {VALID_COUPONS[appliedCoupon].label} · −{formatPKR(discount)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs font-medium underline cursor-pointer"
                        style={{ color: 'var(--color-warm-gray)' }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="cart-coupon-input"
                        className="text-xs font-medium block mb-1.5"
                        style={{ color: 'var(--color-warm-gray)' }}
                      >
                        Have a coupon code?
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="cart-coupon-input"
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyCoupon();
                            }
                          }}
                          placeholder="e.g. AURA15"
                          className="flex-1 px-3 py-2 text-xs rounded-md focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: 'var(--surface-page)',
                            border: '1px solid var(--color-gold-soft)',
                            color: 'var(--surface-dark)',
                          }}
                          aria-label="Enter coupon code"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim()}
                          className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: 'var(--surface-dark)',
                            color: 'var(--text-on-dark)',
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div
              className="shrink-0 px-5 pt-4 pb-5"
              style={{
                borderTop: '2px solid var(--color-gold)',
                backgroundColor: 'var(--surface-card)',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.04)',
              }}
            >
              {/* Summary rows */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm"
                  style={{ color: 'var(--color-warm-gray)' }}
                >
                  Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: 'var(--surface-dark)' }}
                >
                  {formatPKR(subtotal)}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-sm flex items-center gap-1.5"
                    style={{ color: 'var(--color-success)' }}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    Discount ({appliedCoupon})
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--color-success)' }}
                  >
                    −{formatPKR(discount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-sm flex items-center gap-1.5"
                  style={{ color: 'var(--color-warm-gray)' }}
                >
                  <Truck className="w-3.5 h-3.5" />
                  Shipping
                </span>
                {shipping === 0 ? (
                  <span
                    className="text-sm font-bold"
                    style={{ color: 'var(--color-success)' }}
                  >
                    FREE
                  </span>
                ) : (
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--surface-dark)' }}
                  >
                    {formatPKR(shipping)}
                  </span>
                )}
              </div>

              <div
                className="h-px my-3"
                style={{ backgroundColor: 'var(--color-gold-soft)' }}
              />

              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-base font-bold"
                  style={{ color: 'var(--surface-dark)' }}
                >
                  Estimated Total
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: 'var(--surface-dark)' }}
                >
                  {formatPKR(estimatedTotal)}
                </span>
              </div>

              {/* CTAs */}
              <PremiumButton
                variant="primary"
                fullWidth
                onClick={handleCheckout}
                leftIcon={<CreditCard className="h-4 w-4" />}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="mb-2"
              >
                Proceed to Checkout
              </PremiumButton>

              <PremiumButton
                variant="secondary"
                fullWidth
                onClick={handleViewCart}
              >
                View Full Cart
              </PremiumButton>

              {/* Trust badges */}
              <div
                className="mt-3 pt-3 flex items-center justify-center gap-4 flex-wrap"
                style={{ borderTop: '1px solid var(--color-gold-soft)' }}
              >
                <span
                  className="inline-flex items-center gap-1 text-[11px]"
                  style={{ color: 'var(--color-muted-gray)' }}
                >
                  <Lock className="w-3.5 h-3.5 text-gold-text" />
                  Secure Checkout
                </span>
                <span
                  className="inline-flex items-center gap-1 text-[11px]"
                  style={{ color: 'var(--color-muted-gray)' }}
                >
                  <Shield className="w-3.5 h-3.5 text-gold-text" />
                  Free Returns
                </span>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide"
                  style={{ color: 'var(--color-muted-gray)' }}
                >
                  COD · JazzCash · EasyPaisa
                </span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
