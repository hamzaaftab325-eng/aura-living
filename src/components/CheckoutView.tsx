'use client';

import { useState, useEffect, useRef } from 'react';
import { useGsapFadeIn, useGsapStagger, useGsapScaleIn, gsap } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  ChevronRight,
  CreditCard,
  Banknote,
  ShieldCheck,
  
  
  
  CheckCircle2,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPKR } from '@/data/products';
import PremiumButton from '@/components/ui/PremiumButton';
import { useToast } from '@/hooks/use-toast';


/* ─── Form Data Types ─── */
interface CheckoutForm {
  email: string;
  phone: string;
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  paymentMethod: 'cod' | 'jazzcash' | 'easypaisa';
  orderNotes: string;
}

interface FormErrors {
  [key: string]: boolean;
}

const paymentOptions = [
  { id: 'cod' as const, icon: Banknote, label: 'Cash on Delivery', description: 'Pay when your order arrives at your doorstep' },
  { id: 'jazzcash' as const, icon: ShieldCheck, label: 'JazzCash', description: 'Pay securely via JazzCash mobile wallet' },
  { id: 'easypaisa' as const, icon: CreditCard, label: 'EasyPaisa', description: 'Pay securely via EasyPaisa mobile wallet' },
];

const requiredFields: (keyof CheckoutForm)[] = ['email', 'phone', 'fullName', 'address1', 'city', 'province', 'postalCode'];

const initialForm: CheckoutForm = {
  email: '',
  phone: '',
  fullName: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  postalCode: '',
  paymentMethod: 'cod',
  orderNotes: '',
};

/* ─── Input Field Component ─── */
function FormInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error = false,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium transition-all duration-200"
        style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
      >
        {label}
        {required && <span style={{ color: '#D4AF37' }}> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-200 input-gold-glow ${error ? 'animate-error-shake' : ''}`}
        style={{
          fontFamily: "'Poppins', sans-serif",
          backgroundColor: '#FFFDF7',
          border: error ? '1.5px solid #E53E3E' : '1px solid #E8D5A3',
          color: '#2C2C2C',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#D4AF37';
          e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.2)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#E53E3E' : '#E8D5A3';
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <span className="text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#E53E3E' }}>
          {label} is required
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CheckoutView
   ═══════════════════════════════════════════════════════════ */
export default function CheckoutView() {
  const {
    cart,
    getCartTotal,
    getCartCount,
    clearCart,
    setPage,
  } = useStore();

  const { toast } = useToast();

  const cartCount = getCartCount();
  const subtotal = getCartTotal();
  const shipping = subtotal >= 2999 ? 0 : 250;
  const estimatedTotal = subtotal + shipping;

  const [formData, setFormData] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      const timer = setTimeout(() => {
        setPage('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cart.length, setPage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = true;
      }
    });
    // Basic email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate order processing
    setTimeout(() => {
      setIsSubmitting(false);
      clearCart();
      toast({
        title: 'Order Placed Successfully!',
        description: 'Thank you for your order. You will receive a confirmation email shortly.',
        duration: 5000,
      });
      setPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  /* ─────────────── Empty Cart Redirect State ─────────────── */
  if (cart.length === 0) {
    return (
      <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
        {/* Hero */}
        <section
          ref={heroSectionRef}
          className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden flex items-center justify-center"
        >
          {/* Background Image */}
          <div
            ref={heroBgRef}
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/pages/checkout-hero.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.6) 50%, rgba(212,175,55,0.2) 100%)',
            }}
          />
          <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
            <span
              className="text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-6 mt-2"
              style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
            >
              AURA LIVING
            </span>
            <h1
              className="text-white font-bold leading-[1.15] pt-2"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 6vw, 72px)', textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}
            >
              Checkout
            </h1>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            </div>
          </div>
        </section>

        {/* Redirect Message */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto text-center">
            <div
              className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
            >
              <CheckCircle2 className="h-9 w-9" style={{ color: '#D4AF37' }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
            >
              Your Cart is Empty
            </h2>
            <p
              className="text-base mb-8 leading-relaxed"
              style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
            >
              Add items to your cart before proceeding to checkout. Redirecting you to the shop...
            </p>
            <PremiumButton
              variant="gold"
              size="lg"
              onClick={() => { setPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Go to Shop
              <ArrowRight className="w-4 h-4" />
            </PremiumButton>
          </div>
        </section>
      </div>
    );
  }

  /* ─────────────── Checkout with Cart Items ─────────────── */
  return (
    <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero */}
      <section
        ref={heroSectionRef}
        className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden flex items-center justify-center"
      >
        {/* Background Image */}
        <div
          ref={heroBgRef}
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/pages/checkout-hero.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(44,44,44,0.85) 0%, rgba(44,44,44,0.6) 50%, rgba(212,175,55,0.2) 100%)',
          }}
        />
        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">

          <span
            className="text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-6 mt-2"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
          >
            AURA LIVING
          </span>
          <h1
            className="text-white font-bold leading-[1.15] pt-2"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 6vw, 72px)', textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}
          >
            Checkout
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
          </div>
        </div>
      </section>
      {/* Breadcrumb strip (below hero) */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate" style={{ backgroundColor: '#F5EDDA', borderBottom: '1px solid #E8D5A3' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={() => { setPage('cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-sm transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A', background: 'none', border: 'none' }}
          >
            Cart
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#B8A99A' }} />
          <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>
            Checkout
          </span>
        </div>
      </div>

      {/* Checkout Content */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* ─── Checkout Form (Left Column) ─── */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                {/* ─── Contact Information ─── */}
                <div
                  className="rounded-sm p-6 sm:p-8"
                  style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
                >
                  <h2
                    className="text-xl sm:text-2xl font-semibold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
                  >
                    Contact Information
                  </h2>
                  <div className="mb-6">
                    <GoldDivider />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormInput
                      id="email"
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={errors.email}
                    />
                    <FormInput
                      id="phone"
                      label="Phone Number"
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      error={errors.phone}
                    />
                  </div>
                </div>

                {/* ─── Shipping Address ─── */}
                <div
                  className="rounded-sm p-6 sm:p-8"
                  style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
                >
                  <h2
                    className="text-xl sm:text-2xl font-semibold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
                  >
                    Shipping Address
                  </h2>
                  <div className="mb-6">
                    <GoldDivider />
                  </div>
                  <div className="flex flex-col gap-5">
                    <FormInput
                      id="fullName"
                      label="Full Name"
                      placeholder="Muhammad Ali"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      error={errors.fullName}
                    />
                    <FormInput
                      id="address1"
                      label="Address Line 1"
                      placeholder="House #, Street #, Area"
                      value={formData.address1}
                      onChange={handleChange}
                      required
                      error={errors.address1}
                    />
                    <FormInput
                      id="address2"
                      label="Address Line 2"
                      placeholder="Apartment, suite, landmark (optional)"
                      value={formData.address2}
                      onChange={handleChange}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      <FormInput
                        id="city"
                        label="City"
                        placeholder="Lahore"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        error={errors.city}
                      />
                      <FormInput
                        id="province"
                        label="Province"
                        placeholder="Punjab"
                        value={formData.province}
                        onChange={handleChange}
                        required
                        error={errors.province}
                      />
                      <FormInput
                        id="postalCode"
                        label="Postal Code"
                        placeholder="54000"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        error={errors.postalCode}
                      />
                    </div>
                  </div>
                </div>

                {/* ─── Payment Method ─── */}
                <div
                  className="rounded-sm p-6 sm:p-8"
                  style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
                >
                  <h2
                    className="text-xl sm:text-2xl font-semibold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
                  >
                    Payment Method
                  </h2>
                  <div className="mb-6">
                    <GoldDivider />
                  </div>
                  <div className="flex flex-col gap-3">
                    {paymentOptions.map((option) => {
                      const isSelected = formData.paymentMethod === option.id;
                      return (
                        <label
                          key={option.id}
                          className="flex items-center gap-4 p-4 rounded-sm cursor-pointer transition-all duration-200"
                          style={{
                            border: isSelected ? '2px solid #D4AF37' : '1px solid #E8D5A3',
                            backgroundColor: isSelected ? 'rgba(212,175,55,0.04)' : '#FFFDF7',
                          }}
                        >
                          {/* Custom Radio */}
                          <div
                            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                              border: isSelected ? '2px solid #D4AF37' : '2px solid #E8D5A3',
                              backgroundColor: isSelected ? '#D4AF37' : 'transparent',
                            }}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={option.id}
                            checked={isSelected}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div
                            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}
                          >
                            <option.icon className="w-4.5 h-4.5" style={{ color: '#D4AF37' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-semibold"
                              style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                            >
                              {option.label}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                            >
                              {option.description}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: '#D4AF37' }} />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* ─── Order Notes ─── */}
                <div
                  className="rounded-sm p-6 sm:p-8"
                  style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
                >
                  <h2
                    className="text-xl sm:text-2xl font-semibold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#2C2C2C' }}
                  >
                    Order Notes
                  </h2>
                  <div className="mb-6">
                    <GoldDivider />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="orderNotes"
                      className="text-sm font-medium"
                      style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                    >
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      rows={4}
                      value={formData.orderNotes}
                      onChange={handleChange}
                      placeholder="Any special delivery instructions, gift wrapping requests, or notes for our team..."
                      className="w-full px-4 py-3 rounded-sm text-sm outline-none transition-all duration-200 resize-none"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        backgroundColor: '#FFFDF7',
                        border: '1px solid #E8D5A3',
                        color: '#2C2C2C',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#D4AF37';
                        e.target.style.boxShadow = '0 0 0 2px rgba(212, 175, 55, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#E8D5A3';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ─── Order Summary Sidebar (Right Column) ─── */}
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

                  {/* Cart Items Preview */}
                  <div
                    className="flex flex-col gap-4 mb-6 max-h-72 overflow-y-auto pr-1"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="shrink-0 w-14 h-14 rounded-lg overflow-hidden relative"
                          style={{ border: '1px solid #E8D5A3', backgroundColor: '#FFFDF7' }}
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                          />
                          <div
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ backgroundColor: '#D4AF37' }}
                          >
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                          >
                            {item.product.name}
                          </p>
                          <p
                            className="text-xs capitalize"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                          >
                            {item.product.category.replace('-', ' ')}
                          </p>
                        </div>
                        <span
                          className="text-sm font-semibold shrink-0"
                          style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                        >
                          {formatPKR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px" style={{ backgroundColor: 'rgba(212,175,55,0.3)' }} />

                  {/* Summary Lines */}
                  <div className="flex flex-col gap-3 mt-5">
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
                      Total
                    </span>
                    <span
                      className="text-lg font-bold"
                      style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                    >
                      {formatPKR(estimatedTotal)}
                    </span>
                  </div>

                  {/* Place Order Button */}
                  <PremiumButton
                    variant="gold"
                    size="lg"
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Place Order
                      </>
                    )}
                  </PremiumButton>

                  {/* Back to Cart */}
                  <button
                    type="button"
                    onClick={() => { setPage('cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-full text-center text-sm font-medium py-3 mt-2 transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
                    style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}
                  >
                    &larr; Back to Cart
                  </button>

                  {/* Security Note */}
                  <div
                    className="mt-6 pt-5 text-center"
                    style={{ borderTop: '1px solid #E8D5A3' }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      <span
                        className="text-xs font-medium tracking-wide uppercase"
                        style={{ fontFamily: "'Poppins', sans-serif", color: '#5A5A5A' }}
                      >
                        Secure Checkout
                      </span>
                    </div>
                    <p
                      className="text-[11px] leading-relaxed"
                      style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
                    >
                      Your personal information is encrypted and secure. We never store your payment details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
