'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard,
  Truck, Shield, CheckCircle, Tag, Lock, Sparkles, ShoppingBagIcon,
} from 'lucide-react';
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
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    cartOpen,
    setCartOpen,
  } = useStore();
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
  };

  const handleViewCart = () => {
    handleClose();
    router.push('/cart');
  };

  const handleGoToShop = useCallback(() => {
    handleClose();
    router.push('/shop');
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
        drawer.style.transition = 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease-out';
        drawer.style.transform = 'translateX(0)';
        drawer.style.opacity = '1';
      });
    } else if (!cartOpen && isOpenRef.current) {
      isOpenRef.current = false;
      drawer.style.transition = 'transform 250ms cubic-bezier(0.65, 0, 0.35, 1), opacity 200ms ease-in';
      drawer.style.transform = 'translateX(100%)';
      drawer.style.opacity = '0';
      overlay.style.transition = 'opacity 200ms ease-in';
      overlay.style.opacity = '0';
      const t = setTimeout(() => {
        document.body.style.overflow = '';
      }, 270);
      return () => clearTimeout(t);
    }

    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  // Escape + focus trap + restore focus
  useEffect(() => {
    if (!cartOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setCartOpen(false); return; }
    };
    document.addEventListener('keydown', handleKeyDown);

    const t = setTimeout(() => focusFirst(drawerRef.current), 120);
    const releaseTrap = trapFocus(drawerRef.current);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(t);
      releaseTrap();
      previouslyFocused?.focus?.();
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <>
      {/* Overlay — premium gradient + blur */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[70]"
        style={{
          background: 'linear-gradient(135deg, rgba(44,44,44,0.6) 0%, rgba(28,28,28,0.5) 100%)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: 0 }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer — right slide-in, premium design */}
      <div className="fixed inset-0 z-[80] flex justify-end pointer-events-none" role="presentation">
        <aside
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          className="relative h-full w-full max-w-[440px] flex flex-col pointer-events-auto"
          style={{
            background: 'linear-gradient(180deg, var(--surface-card) 0%, var(--surface-page) 100%)',
            boxShadow: '-20px 0 60px rgba(0,0,0,0.15), -1px 0 0 rgba(212,175,55,0.1)',
            transform: 'translateX(100%)',
            opacity: 0 }}
        >
          {/* ═══ Premium gold top accent with gradient ═══ */}
          <div
            className="h-[4px] w-full shrink-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, var(--color-gold) 20%, #E0BD4A 50%, var(--color-gold) 80%, transparent 100%)' }}
          />

          {/* ═══ Header — premium with icon + badge ═══ */}
          <div
            className="flex items-center justify-between px-6 py-5 shrink-0"
            style={{ background: 'linear-gradient(180deg, rgba(255,253,247,1) 0%, rgba(245,237,218,0.3) 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
                  border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <ShoppingBag className="w-5 h-5" style={{ color: 'var(--color-gold-text)' }} />
              </div>
              <div>
                <h2
                  id="cart-drawer-title"
                  className="text-lg font-bold leading-tight"
                  
                >
                  Your Cart
                </h2>
                <p
                  className="text-[11px]"
                  
                >
                  {cartCount === 0 ? 'No items yet' : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} ready`}
                </p>
              </div>
            </div>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-black/5"
              
              onClick={handleClose}
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ═══ Free shipping progress — premium animated bar ═══ */}
          {cart.length > 0 && (
            <div
              className="px-6 py-4 shrink-0"
              style={{ background: 'linear-gradient(180deg, rgba(245,237,218,0.4) 0%, rgba(245,237,218,0.1) 100%)' }}
            >
              {amountToFreeShipping > 0 ? (
                <div className="flex items-center gap-2 mb-2.5">
                  <Truck className="w-4 h-4 shrink-0" style={{ color: 'var(--color-gold-text)' }} />
                  <p className="text-xs" >
                    Add{' '}
                    <span className="font-bold" style={{ color: 'var(--color-gold-text)' }}>
                      {formatPKR(amountToFreeShipping)}
                    </span>
                    {' '}more for{' '}
                    <span className="font-bold" style={{ color: 'var(--color-gold-text)' }}>
                      FREE shipping
                    </span>
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                  <p
                    className="text-xs font-bold"
                    style={{ color: 'var(--color-success)' }}
                  >
                    FREE shipping unlocked!
                  </p>
                </div>
              )}
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(232, 213, 163, 0.4)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out relative"
                  style={{
                    width: `${freeShippingProgress}%`,
                    background:
                      freeShippingProgress >= 100
                        ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                        : 'linear-gradient(90deg, var(--color-gold) 0%, #E0BD4A 50%, var(--color-gold) 100%)',
                    boxShadow: freeShippingProgress >= 100
                      ? '0 0 12px rgba(34,197,94,0.4)'
                      : '0 0 12px rgba(212,175,55,0.3)' }}
                >
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      animation: 'shimmer 2s infinite' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══ Cart Content — scrollable ═══ */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ scrollbarWidth: 'thin' }}
          >
            {cart.length === 0 ? (
              /* ═══ Empty State — premium illustration ═══ */
              <div className="flex flex-col items-center justify-center px-6 py-16 min-h-full">
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)',
                    border: '2px dashed rgba(212,175,55,0.3)' }}
                >
                  <ShoppingBag className="h-10 w-10" style={{ color: 'var(--color-gold-text)' }} />
                  <Sparkles
                    className="w-5 h-5 absolute -top-1 -right-1"
                    style={{ color: 'var(--color-gold)' }}
                  />
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  
                >
                  Your cart is empty
                </h3>
                <p
                  className="text-sm text-center mb-7 max-w-[280px]"
                  
                >
                  Discover handcrafted decor pieces that bring warmth and character to your home.
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
              /* ═══ Cart Items — premium cards ═══ */
              <div className="px-6 py-3">
                {cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex gap-4 py-4 group"
                    
                  >
                    {/* Product image */}
                    <div
                      className="shrink-0 w-20 h-20 rounded-xl overflow-hidden relative transition-transform duration-300 group-hover:scale-105"
                      style={{
                        border: '1px solid rgba(232, 213, 163, 0.6)',
                        background: 'linear-gradient(135deg, var(--surface-card) 0%, var(--surface-page) 100%)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    >
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="w-full h-full object-contain p-1"
                        sizes="80px"
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4
                            className="text-sm font-semibold leading-tight line-clamp-2"
                            
                          >
                            {item.product.name}
                          </h4>
                          <p
                            className="text-[11px] mt-0.5 capitalize"
                            
                          >
                            {item.product.category.replace('-', ' ')}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.product.id);
                            toast({
                              title: 'Removed',
                              description: `${item.product.name} removed from cart.`,
                            });
                          }}
                          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-red-50"
                          
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Quantity + Price */}
                      <div className="flex items-center justify-between mt-3 gap-3">
                        <div
                          className="flex items-center rounded-full"
                          style={{
                            border: '1.5px solid rgba(232, 213, 163, 0.8)' }}
                        >
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/5"
                            
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
                            
                            aria-label={`Quantity for ${item.product.name}`}
                          />
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/5"
                            
                            aria-label={`Increase quantity of ${item.product.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-sm font-bold block"
                            
                          >
                            {formatPKR(item.product.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span
                              className="text-[10px]"
                              
                            >
                              {formatPKR(item.product.price)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ═══ Coupon Code Section ═══ */}
                <div className="py-4">
                  {appliedCoupon ? (
                    <div
                      className="flex items-center justify-between p-3.5 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.04) 100%)',
                        border: '1px solid rgba(34,197,94,0.25)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}
                        >
                          <Tag className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                        </div>
                        <div>
                          <p
                            className="text-xs font-bold"
                            style={{ color: 'var(--color-success)' }}
                          >
                            {appliedCoupon} Applied
                          </p>
                          <p
                            className="text-[10px]"
                            
                          >
                            {VALID_COUPONS[appliedCoupon].label} · You saved {formatPKR(discount)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs font-medium underline cursor-pointer"
                        
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="cart-coupon-input"
                        className="text-[11px] font-semibold uppercase tracking-wider block mb-2"
                        
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
                          className="flex-1 px-3.5 py-2.5 text-xs rounded-lg focus:outline-none focus:ring-2"
                          style={{ border: '1px solid rgba(232, 213, 163, 0.8)' }}
                          aria-label="Enter coupon code"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim()}
                          className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: 'var(--surface-dark)' }}
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

          {/* ═══ Footer — premium order summary ═══ */}
          {cart.length > 0 && (
            <div
              className="shrink-0 px-6 pt-5 pb-6"
              style={{
                borderTop: '2px solid var(--color-gold)',
                background: 'linear-gradient(180deg, rgba(255,253,247,1) 0%, rgba(245,237,218,0.3) 100%)',
                boxShadow: '0 -8px 30px rgba(0,0,0,0.06)' }}
            >
              {/* Summary rows */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm"
                  
                >
                  Subtotal ({cartCount} {cartCount !== 1 ? 'items' : 'item'})
                </span>
                <span
                  className="text-sm font-semibold"
                  
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
                    
                  >
                    {formatPKR(shipping)}
                  </span>
                )}
              </div>

              <div
                className="h-px my-3"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(232,213,163,0.8), transparent)' }}
              />

              {/* Total */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span
                    className="text-base font-bold block"
                    
                  >
                    Estimated Total
                  </span>
                  <span
                    className="text-[10px]"
                    
                  >
                    Taxes calculated at checkout
                  </span>
                </div>
                <span
                  className="text-2xl font-bold"
                  
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
                className="mt-4 pt-4 flex items-center justify-center gap-5 flex-wrap"
                style={{ borderTop: '1px solid rgba(232, 213, 163, 0.5)' }}
              >
                <span
                  className="inline-flex items-center gap-1.5 text-[11px]"
                  
                >
                  <Lock className="w-3.5 h-3.5" style={{ color: 'var(--color-gold-text)' }} />
                  Secure Checkout
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-[11px]"
                  
                >
                  <Shield className="w-3.5 h-3.5" style={{ color: 'var(--color-gold-text)' }} />
                  Free Returns
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold"
                  
                >
                  COD · JazzCash · EasyPaisa
                </span>
              </div>
            </div>
          )}

          {/* Shimmer keyframe animation */}
          <style jsx>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </aside>
      </div>
    </>
  );
}
