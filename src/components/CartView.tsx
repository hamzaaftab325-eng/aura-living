'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useScrollReveal, useStaggerReveal } from '@/hooks/useAnimations';
import gsap from 'gsap';;
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
  ShoppingBag as BagIcon,
  ArrowLeft,
  Tag } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatRupees as formatPKR } from '@/lib/currency-display';
import PremiumButton from '@/components/ui/PremiumButton';
import { useToast } from '@/hooks/use-toast';

const paymentMethods = [
  { icon: Banknote, label: 'Cash on Delivery', desc: 'Pay when you receive' },
  { icon: ShieldCheck, label: 'JazzCash', desc: 'Instant mobile payment' },
  { icon: CreditCard, label: 'EasyPaisa', desc: 'Digital wallet' },
];

export default function CartView() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useStore();
  const { toast } = useToast();

  const cartCount = getCartCount();
  const subtotal = getCartTotal();
  const FREE_SHIPPING_THRESHOLD = 10000; // Rs. 10,000 (matches server-side lib/shipping.ts)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const estimatedTotal = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Hydration guard
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  const safeCart = hydrated ? cart : [];
  const safeCount = hydrated ? cartCount : 0;
  const safeSubtotal = hydrated ? subtotal : 0;

  // GSAP
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.5 });
  const itemsRef = useStaggerReveal<HTMLDivElement>({
    selector: ':scope > div',
    y: 30,
    duration: 0.4,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%' });
  const summaryRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.5, delay: 0.2 });

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'AURA15') {
      setDiscount(Math.round(safeSubtotal * 0.15));
      toast({ title: 'Coupon applied!', description: '15% discount applied to your order.' });
    } else if (couponCode.trim().toUpperCase() === 'WELCOME10') {
      setDiscount(Math.round(safeSubtotal * 0.10));
      toast({ title: 'Coupon applied!', description: '10% discount applied to your order.' });
    } else {
      toast({ title: 'Invalid coupon', description: 'This coupon code is not valid.', variant: 'destructive' });
    }
  };

  const finalTotal = estimatedTotal - discount;

  const handleCheckout = () => {
    router.push('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearCart = () => {
    clearCart();
    setDiscount(0);
    setCouponCode('');
    toast({ title: 'Cart cleared', description: 'All items have been removed.' });
  };

  // Empty cart state
  if (hydrated && safeCart.length === 0) {
    return (
      <div className="w-full pt-28 sm:pt-32 min-h-screen" >
        <div className="max-w-md mx-auto text-center px-4 py-16">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" >
            <BagIcon className="w-12 h-12 text-gold-text" />
          </div>
          <h1 className="aura-h2 aura-text-primary mb-3">Your Cart is Empty</h1>
          <p className="aura-body text-muted-gray mb-8 max-w-sm mx-auto">
            Looks like you haven&apos;t added anything yet. Explore our handcrafted collection
            and find pieces you&apos;ll love for your home.
          </p>
          <PremiumButton variant="primary" href="/shop" leftIcon={<ShoppingBag className="w-4 h-4" />}>
            Start Shopping
          </PremiumButton>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-28 sm:pt-32 pb-16" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { router.push('/shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-gold/10 cursor-pointer"
              aria-label="Back to shop"
            >
              <ArrowLeft className="w-5 h-5 text-gold-text" />
            </button>
            <div>
              <h2 className="aura-h2 aura-text-primary">Shopping Cart</h2>
              <p className="aura-body-small text-muted-gray">{safeCount} item{safeCount !== 1 ? 's' : ''} in your cart</p>
            </div>
          </div>
          {safeCart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm font-medium transition-colors hover:text-red-500 cursor-pointer text-muted-gray"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Free shipping progress */}
        {safeSubtotal > 0 && (
          <div className="mb-8 rounded-lg p-4" >
            {amountToFreeShipping > 0 ? (
              <p className="text-sm mb-2 text-center" >
                Add <span className="font-semibold text-gold-text">{formatPKR(amountToFreeShipping)}</span> more for{' '}
                <span className="font-semibold text-gold-text">FREE shipping</span>
              </p>
            ) : (
              <p className="text-sm mb-2 text-center flex items-center justify-center gap-1.5" >
                <Truck className="w-4 h-4" />
                <span className="font-semibold">You&apos;ve unlocked FREE shipping!</span>
              </p>
            )}
            <div className="w-full h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${freeShippingProgress}%`,
                  background: freeShippingProgress >= 100
                    ? 'linear-gradient(90deg, var(--color-success), #16A34A)'
                    : 'linear-gradient(90deg, var(--color-gold), var(--color-gold-soft))' }}
              />
            </div>
          </div>
        )}

        {/* Two-column layout: items + summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ═══ Cart Items (2/3 width) ═══ */}
          <div ref={itemsRef} className="lg:col-span-2 flex flex-col gap-4">
            {safeCart.map((item, index) => (
              <div
                key={`${item.product.id}-${index}`}
                className="rounded-lg p-4 sm:p-5 flex gap-4 sm:gap-6 transition-all duration-300"
                
              >
                {/* Image */}
                <Link
                  href={`/product/${item.product.slug}`}
                  className="shrink-0 relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden"
                  
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="w-full h-full object-contain"
                    sizes="112px"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="text-sm sm:text-base font-semibold truncate hover:text-gold-text transition-colors"
                        
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs mt-0.5 capitalize" >
                        {item.product.category.replace('-', ' ')}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.product.id);
                        toast({ title: 'Removed', description: `${item.product.name} removed from cart.` });
                      }}
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
                      style={{ color: '#B0B0B0' }}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity + Price */}
                  <div className="flex items-end justify-between mt-auto pt-3 gap-3">
                    <div className="flex items-center rounded-full">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-gold/10"
                        
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
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
                        
                        aria-label={`Quantity for ${item.product.name}`}
                      />
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-gold/10"
                        
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-bold block" >
                        {formatPKR(item.product.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[11px]" >
                          {formatPKR(item.product.price)} each
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <PremiumButton
              variant="secondary"
              size="sm"
              href="/shop"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="mt-2"
            >
              Continue Shopping
            </PremiumButton>
          </div>

          {/* ═══ Order Summary (1/3 width, sticky) ═══ */}
          <div ref={summaryRef} className="lg:col-span-1">
            <div
              className="rounded-lg p-6 lg:sticky lg:top-28"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
            >
              <h2 className="text-xl font-bold mb-4 aura-text-primary" >
                Order Summary
              </h2>
              <div className="mb-4"><GoldDivider /></div>

              {/* Coupon */}
              <div className="mb-5">
                <label className="text-xs font-medium tracking-wide uppercase block mb-2" >
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2.5 rounded-md text-sm outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all hover:bg-gold/80 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[11px] mt-1.5">
                  Try: AURA15 or WELCOME10
                </p>
              </div>

              {/* Summary lines */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm" >
                    Subtotal ({safeCount} item{safeCount !== 1 ? 's' : ''})
                  </span>
                  <span className="text-sm font-semibold" >
                    {formatPKR(safeSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-1.5" >
                    <Truck className="w-3.5 h-3.5" />
                    Shipping
                  </span>
                  {shipping === 0 ? (
                    <span className="text-sm font-bold" >FREE</span>
                  ) : (
                    <span className="text-sm font-semibold" >
                      {formatPKR(shipping)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1.5" >
                      <Tag className="w-3.5 h-3.5" />
                      Discount
                    </span>
                    <span className="text-sm font-bold" >
                      -{formatPKR(discount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px my-3" />

              {/* Total */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-base font-semibold" >
                  Total
                </span>
                <span className="text-2xl font-bold" >
                  {formatPKR(finalTotal)}
                </span>
              </div>

              {/* Checkout button */}
              <PremiumButton
                variant="primary"
                fullWidth
                onClick={handleCheckout}
                leftIcon={<CreditCard className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Checkout
              </PremiumButton>

              {/* Payment methods */}
              <div className="mt-5 pt-5" >
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" >
                  We Accept
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {paymentMethods.map((method) => (
                    <div key={method.label} className="flex flex-col items-center gap-1">
                      <method.icon className="w-5 h-5 text-gold-text" />
                      <span className="text-[10px]" >
                        {method.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-4 pt-4 flex items-center justify-center gap-4" >
                <span className="inline-flex items-center gap-1 text-[11px]" >
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-text" />
                  Secure Checkout
                </span>
                <span className="inline-flex items-center gap-1 text-[11px]" >
                  <Truck className="w-3.5 h-3.5 text-gold-text" />
                  Fast Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
