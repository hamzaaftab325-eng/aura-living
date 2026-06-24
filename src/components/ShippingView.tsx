'use client';

import { useScrollReveal, useStaggerReveal, useScaleIn } from '@/hooks/useAnimations';;
import { GoldDivider } from '@/components/SVGDecorations';
import { Truck, Package, MapPin, Clock, Gift, Globe } from 'lucide-react';
import PremiumButton from '@/components/ui/PremiumButton';
import Breadcrumb from '@/components/ui/Breadcrumb';


const shippingRates = [
  {
    icon: Package,
    title: 'Standard Delivery',
    duration: '3-5 business days',
    price: 'PKR 250',
    note: 'FREE on orders above PKR 2,999' },
  {
    icon: Truck,
    title: 'Express Delivery',
    duration: '1-2 business days',
    price: 'PKR 500',
    note: 'Available in major cities' },
  {
    icon: Clock,
    title: 'Same-Day Delivery',
    duration: 'Same day (Lahore only)',
    price: 'PKR 800',
    note: 'Order before 12 PM PKT' },
];

const deliveryCities = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi',
  'Faisalabad', 'Multan', 'Peshawar', 'Quetta',
];

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

export default function ShippingView() {

  // GSAP refs
  const heroRef = useStaggerReveal<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%' });

  const overviewRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 });
  const ratesRef = useStaggerReveal<HTMLDivElement>({
    selector: ':scope > div',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%' });
  const ctaRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.2 });
  const dividerRef = useScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

  return (
    <div className="w-full page-transition" >
      {/* Hero */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/shipping-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.75) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)' }}
        />

        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5">
            <Truck className="w-8 h-8"  />
          </div>
          <span className="aura-text-gold text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-4" >
            AURA LIVING
          </span>
          <h1 className="aura-hero-title text-white" >
            Shipping Information
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shipping' },
        ]}
      />

      {/* Shipping Overview */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div ref={overviewRef} className="max-w-4xl mx-auto text-center">
          <div className="rounded-xl p-5 sm:p-6 lg:p-8 md:p-10" >
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5">
              <Truck className="w-6 h-6"  />
            </div>
            <h2 className="aura-text-primary aura-h2 mb-3" >
              Shipping Overview
            </h2>
            <div className="flex justify-center mb-4">
              <GoldDivider />
            </div>
            <p className="aura-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" >
              We deliver across Pakistan with care and attention to every package. Your order is handled with the same love and precision that goes into crafting each product. From our artisan workshop to your doorstep, we ensure every item arrives safely and beautifully presented.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Rates */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-8 sm:mb-10">
              <span className="aura-text-gold text-xs sm:text-sm tracking-[3px] uppercase font-medium" >Delivery Options</span>
              <h2 className="aura-text-primary aura-h2 mt-2" >Shipping Rates</h2>
              <div className="mt-3 flex justify-center">
                <GoldDivider />
              </div>
            </div>

            <div ref={ratesRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {shippingRates.map((rate) => (
                <div
                  key={rate.title}
                  className="rounded-xl p-5 sm:p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[var(--color-gold)]"
                  
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <rate.icon className="w-5 h-5"  />
                  </div>
                  <h3 className="aura-text-primary text-lg sm:text-xl font-semibold mb-1" >
                    {rate.title}
                  </h3>
                  <span className="block text-xs sm:text-sm tracking-wider uppercase mb-3" >
                    {rate.duration}
                  </span>
                  <span className="block aura-h2 mb-3" >
                    {rate.price}
                  </span>
                  <span className="block text-xs sm:text-sm leading-relaxed" >
                    {rate.note}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Delivery Areas */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="rounded-xl p-5 sm:p-6 lg:p-8" >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5"  />
                </div>
                <div>
                  <h2 className="aura-text-primary aura-h2 mb-2" >
                    Delivery Areas
                  </h2>
                  <GoldDivider />
                </div>
              </div>
              <p className="aura-text-secondary text-base leading-relaxed mb-6" >
                We deliver to all major cities across Pakistan. Our courier partners ensure timely and safe delivery to your doorstep.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {deliveryCities.map((city) => (
                  <div
                    key={city}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-sm aura-bg-gold-tint"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0"  />
                    <span className="text-sm font-medium" >{city}</span>
                  </div>
                ))}
              </div>
              <p className="aura-text-secondary text-sm leading-relaxed" >
                ...and 50+ more cities across Pakistan. Not sure if we deliver to your area? Contact us and we will find a way.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Order Tracking, Packaging, International Shipping */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* Order Tracking */}
              <div className="rounded-xl p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)]" >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5"  />
                  </div>
                  <div>
                    <h3 className="aura-text-primary aura-h2 mb-3" >
                      Order Tracking
                    </h3>
                    <p className="aura-text-secondary text-base leading-relaxed" >
                      Track your order with the tracking number sent via SMS and email once your order is dispatched. You can use this tracking number on our website or the courier partner&apos;s website to monitor your shipment in real time. You will also receive notifications at each stage of delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Packaging */}
              <div className="rounded-xl p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)]" >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5"  />
                  </div>
                  <div>
                    <h3 className="aura-text-primary aura-h2 mb-3" >
                      Packaging
                    </h3>
                    <p className="aura-text-secondary text-base leading-relaxed mb-3" >
                      Each item is carefully wrapped in premium protective materials to ensure it arrives in perfect condition. We take great pride in our unboxing experience — because the joy of receiving something beautiful should start the moment you open the package.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm" >
                      <Gift className="w-4 h-4"  />
                      <span className="text-sm font-medium" >
                        Gift-wrap option available for PKR 299
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* International Shipping */}
              <div className="rounded-xl p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)]" >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5"  />
                  </div>
                  <div>
                    <h3 className="aura-text-primary aura-h2 mb-3" >
                      International Shipping
                    </h3>
                    <p className="aura-text-secondary text-base leading-relaxed" >
                      Currently we only ship within Pakistan. International shipping is coming soon! Sign up for our newsletter to be the first to know when we start delivering worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
          <h2 className="aura-text-primary text-2xl sm:text-3xl md:text-4xl font-bold mb-4" >
            Need Help With Your Delivery?
          </h2>
          <div className="flex justify-center mb-4">
            <GoldDivider />
          </div>
          <p className="aura-text-secondary text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed" >
            Our customer support team is always ready to assist you with any shipping inquiries or delivery concerns.
          </p>
          <PremiumButton variant="primary" href="/contact">
            Contact Support
            <Truck className="w-4 h-4" />
          </PremiumButton>
        </div>
      </section>
    </div>
  );
}
