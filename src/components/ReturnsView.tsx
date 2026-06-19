'use client';

import { useGsapFadeIn, useGsapStagger } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import { RotateCcw, CheckCircle, ChevronRight, MessageCircle, XCircle, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PremiumButton from '@/components/ui/PremiumButton';


const returnSteps = [
  {
    step: 1,
    title: 'Contact Us',
    description: 'Reach out to us via WhatsApp or email within 14 days of delivery. Provide your order number and reason for return.',
  },
  {
    step: 2,
    title: 'Receive Authorization',
    description: 'We will review your request and send you a return authorization along with a prepaid shipping label for damaged items.',
  },
  {
    step: 3,
    title: 'Pack Securely',
    description: 'Pack the item securely in its original packaging with all tags and accessories included. Ensure the item is unused and undamaged.',
  },
  {
    step: 4,
    title: 'Ship It Back',
    description: 'Ship the item back using the provided label. Return shipping is free for damaged items. For other returns, a nominal fee may apply.',
  },
  {
    step: 5,
    title: 'Refund Processed',
    description: 'Once we receive and inspect the item, your refund will be processed within 5-7 business days to your original payment method.',
  },
];

const exchangeSteps = [
  {
    step: 1,
    title: 'Contact Us',
    description: 'Reach out within 14 days of delivery. Let us know which item you want to exchange and your preferred size or color.',
  },
  {
    step: 2,
    title: 'Confirm Availability',
    description: 'We will check stock availability for your preferred replacement and confirm the exchange details with you.',
  },
  {
    step: 3,
    title: 'Ship Original Item',
    description: 'Pack and ship the original item back to us in its original packaging with all tags attached.',
  },
  {
    step: 4,
    title: 'Receive Replacement',
    description: 'Once we receive your returned item, we will dispatch the replacement. If the new item costs more, you will pay the difference. If less, you will receive store credit.',
  },
];

const nonReturnableItems = [
  { item: 'Customized Products', reason: 'Personalized and custom-made items cannot be returned as they are crafted specifically for you.' },
  { item: 'Candles (Once Lit)', reason: 'Candles that have been lit or used cannot be returned due to hygiene and safety reasons.' },
  { item: 'Plants', reason: 'Live plants are non-returnable unless they arrive damaged. Contact us within 48 hours if your plant is damaged on arrival.' },
  { item: 'Sale Items', reason: 'Items purchased on sale are eligible for exchange only, not for a refund.' },
];

/* ═══════════════════════════════════════════════════════════
   AnimatedSection — uses useGsapStagger for children reveal
   ═══════════════════════════════════════════════════════════ */
function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.15,
    ease: 'power3.out',
    start: 'top 80%',
  });

  return <div ref={ref} className={className}>{children}</div>;
}

export default function ReturnsView() {
  const setPage = useStore((state) => state.setPage);

  // GSAP refs
  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%',
  });

  const policyRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });
  const returnStepsRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%',
  });
  const exchangeStepsRef = useGsapStagger<HTMLDivElement>({
    selector: ':scope > div',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%',
  });
  const ctaRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.2 });

  return (
    <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/returns-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.75) 0%, rgba(44,44,44,0.5) 50%, rgba(212,175,55,0.15) 100%)' }}
        />

        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}>
            <RotateCcw className="w-8 h-8" style={{ color: '#D4AF37' }} />
          </div>
          <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-4" >
            AURA LIVING
          </span>
          <h1 className="aura-hero-title text-white" >
            Returns & Exchanges
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate" style={{ backgroundColor: '#F5EDDA' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={() => setPage('home')}
            className="text-sm transition-colors duration-200 hover:text-[#D4AF37]"
            style={{ color: '#8A8A8A' }}
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#8A8A8A' }} />
          <span className="text-sm font-medium" style={{ color: '#B8941F' }}>Returns & Exchanges</span>
        </div>
      </div>

      {/* Our Return Policy */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div ref={policyRef} className="max-w-4xl mx-auto text-center">
          <div className="rounded-xl p-5 sm:p-6 lg:p-8 md:p-10" style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}>
              <RotateCcw className="w-6 h-6" style={{ color: '#D4AF37' }} />
            </div>
            <h2 className="text-[#2C2C2C] text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-3" >
              Our Return Policy
            </h2>
            <div className="flex justify-center mb-4">
              <GoldDivider />
            </div>
            <p className="text-[#5A5A5A] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-4" >
              We offer a <strong style={{ color: '#2C2C2C' }}>14-day return window</strong> from the date of delivery. Items must be unused, in their original packaging, and with all tags still attached.
            </p>
            <p className="text-[#5A5A5A] text-base leading-relaxed max-w-2xl mx-auto" >
              We want you to be completely satisfied with your purchase. If for any reason you are not happy with your order, we are here to make it right.
            </p>
          </div>
        </div>
      </section>

      {/* How to Return - Steps */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5EDDA' }}>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[3px] uppercase font-medium" >Step by Step</span>
              <h2 className="text-[#2C2C2C] text-[28px] sm:text-[32px] lg:text-[40px] font-bold mt-2" >How to Return</h2>
              <div className="mt-3 flex justify-center">
                <GoldDivider />
              </div>
            </div>

            <div ref={returnStepsRef} className="flex flex-col gap-4">
              {returnSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-xl p-5 sm:p-6 flex items-start gap-4 sm:gap-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[#D4AF37]"
                  style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}>
                      <CheckCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5" style={{ color: '#D4AF37' }} />
                    </div>
                    {step.step < returnSteps.length && (
                      <div className="w-px h-4 sm:h-6 mt-1" style={{ backgroundColor: '#E8D5A3' }} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37' }}>
                        Step {step.step}
                      </span>
                      <h3 className="text-[#2C2C2C] text-base sm:text-lg font-semibold" >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[#5A5A5A] text-sm sm:text-base leading-relaxed" >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Exchange Process */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[3px] uppercase font-medium" >Swap & Replace</span>
              <h2 className="text-[#2C2C2C] text-[28px] sm:text-[32px] lg:text-[40px] font-bold mt-2" >Exchange Process</h2>
              <div className="mt-3 flex justify-center">
                <GoldDivider />
              </div>
              <p className="text-[#5A5A5A] text-base leading-relaxed max-w-xl mx-auto mt-4" >
                Want a different size or color? Our exchange process is simple and hassle-free. Size and color exchanges are available for all eligible items.
              </p>
            </div>

            <div ref={exchangeStepsRef} className="flex flex-col gap-4">
              {exchangeSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-xl p-5 sm:p-6 flex items-start gap-4 sm:gap-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[#D4AF37]"
                  style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}>
                      <CheckCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5" style={{ color: '#D4AF37' }} />
                    </div>
                    {step.step < exchangeSteps.length && (
                      <div className="w-px h-4 sm:h-6 mt-1" style={{ backgroundColor: '#E8D5A3' }} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37' }}>
                        Step {step.step}
                      </span>
                      <h3 className="text-[#2C2C2C] text-base sm:text-lg font-semibold" >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[#5A5A5A] text-sm sm:text-base leading-relaxed" >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Non-Returnable Items */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5EDDA' }}>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[3px] uppercase font-medium" >Please Note</span>
              <h2 className="text-[#2C2C2C] text-[28px] sm:text-[32px] lg:text-[40px] font-bold mt-2" >Non-Returnable Items</h2>
              <div className="mt-3 flex justify-center">
                <GoldDivider />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nonReturnableItems.map((item) => (
                <div
                  key={item.item}
                  className="rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)]"
                  style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#C44' }} />
                    <div>
                      <h3 className="text-[#2C2C2C] text-base sm:text-lg font-semibold mb-1" >
                        {item.item}
                      </h3>
                      <p className="text-[#5A5A5A] text-sm leading-relaxed" >
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Refund Methods */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[3px] uppercase font-medium" >Getting Your Money Back</span>
              <h2 className="text-[#2C2C2C] text-[28px] sm:text-[32px] lg:text-[40px] font-bold mt-2" >Refund Methods</h2>
              <div className="mt-3 flex justify-center">
                <GoldDivider />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div
                className="rounded-xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[#D4AF37]"
                style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}>
                  <CreditCard className="w-5 h-5" style={{ color: '#D4AF37' }} />
                </div>
                <h3 className="text-[#2C2C2C] text-lg sm:text-xl font-semibold mb-2" >
                  Original Payment Method
                </h3>
                <p className="text-[#5A5A5A] text-sm sm:text-base leading-relaxed" >
                  Refunds are processed to your original payment method within 5-7 business days after we receive and inspect the returned item. This applies to credit/debit cards, JazzCash, EasyPaisa, and bank transfers.
                </p>
              </div>

              <div
                className="rounded-xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[#D4AF37]"
                style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}>
                  <CreditCard className="w-5 h-5" style={{ color: '#D4AF37' }} />
                </div>
                <h3 className="text-[#2C2C2C] text-lg sm:text-xl font-semibold mb-2" >
                  Store Credit
                </h3>
                <p className="text-[#5A5A5A] text-sm sm:text-base leading-relaxed" >
                  Opt for store credit and receive a <strong style={{ color: '#D4AF37' }}>10% bonus</strong> on your refund amount. Store credit never expires and can be used across our entire collection — a great way to discover something new.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Damaged or Defective Items */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5EDDA' }}>
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="rounded-xl p-5 sm:p-6 lg:p-8" style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(204, 68, 68, 0.1)' }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: '#C44' }} />
                </div>
                <div>
                  <h2 className="text-[#2C2C2C] text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-2" >
                    Damaged or Defective Items
                  </h2>
                  <GoldDivider />
                </div>
              </div>

              <div className="flex flex-col gap-4 ml-0 sm:ml-16">
                <p className="text-[#5A5A5A] text-base leading-relaxed" >
                  If you receive a damaged or defective item, please contact us <strong style={{ color: '#2C2C2C' }}>within 48 hours</strong> of delivery. Photo evidence is required for all damage claims.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-sm" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid #E8D5A3' }}>
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#D4AF37' }} />
                    <span className="text-sm font-medium" style={{ color: '#2C2C2C' }}>Free replacement shipped immediately</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-sm" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid #E8D5A3' }}>
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#D4AF37' }} />
                    <span className="text-sm font-medium" style={{ color: '#2C2C2C' }}>Full refund available</span>
                  </div>
                </div>
                <p className="text-[#5A5A5A] text-sm leading-relaxed" >
                  We will cover all return shipping costs for damaged items and prioritize your case for the fastest possible resolution.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
            <RotateCcw className="w-8 h-8" style={{ color: '#D4AF37' }} />
          </div>
          <h2 className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold mb-4" >
            Need to Return Something?
          </h2>
          <div className="flex justify-center mb-4">
            <GoldDivider />
          </div>
          <p className="text-[#5A5A5A] text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed" >
            Our customer support team will guide you through the return or exchange process. We are committed to making it as smooth as possible.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <PremiumButton variant="gold" onClick={() => setPage('contact')}>
              Contact Us
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </PremiumButton>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-sm text-sm font-semibold tracking-wider uppercase cursor-pointer transition-all duration-300 hover:shadow-[0_8px_25px_rgba(37,211,102,0.3)] hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
