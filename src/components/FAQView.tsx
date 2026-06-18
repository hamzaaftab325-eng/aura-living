'use client';

import { useState, useRef, useEffect } from 'react';
import { useGsapFadeIn, useGsapStagger,  gsap } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import { HelpCircle, ChevronDown, ChevronRight, MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import PremiumButton from '@/components/ui/PremiumButton';


type FAQCategory = 'all' | 'orders' | 'returns' | 'products' | 'payment';

interface FAQItem {
  id: number;
  category: FAQCategory;
  question: string;
  answer: string;
}

const categories: { key: FAQCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'orders', label: 'Orders & Shipping' },
  { key: 'returns', label: 'Returns & Exchanges' },
  { key: 'products', label: 'Products' },
  { key: 'payment', label: 'Payment' },
];

const faqItems: FAQItem[] = [
  {
    id: 1,
    category: 'orders',
    question: 'What are the shipping times for my order?',
    answer: 'Standard delivery takes 3-5 business days across Pakistan. Express delivery is available for 1-2 business days, and same-day delivery is offered within Lahore. Once your order is dispatched, you will receive a tracking number via SMS and email to monitor your shipment in real time.',
  },
  {
    id: 2,
    category: 'orders',
    question: 'Which areas do you deliver to?',
    answer: 'We deliver to all major cities in Pakistan including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and Quetta, plus 50+ additional cities. If you are unsure whether we deliver to your area, please contact us and we will do our best to accommodate your location.',
  },
  {
    id: 3,
    category: 'payment',
    question: 'Is Cash on Delivery (COD) available?',
    answer: 'Yes, we offer Cash on Delivery across Pakistan. Simply select the COD option at checkout. For COD orders, please ensure someone is available at the delivery address to receive and pay for the package. A confirmation call will be made before dispatch.',
  },
  {
    id: 4,
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 14-day return window from the date of delivery. Items must be unused, in their original packaging, and with all tags still attached. To initiate a return, please contact us via WhatsApp or email within the 14-day period, and we will guide you through the process.',
  },
  {
    id: 5,
    category: 'returns',
    question: 'How do I exchange an item for a different size or color?',
    answer: 'To exchange an item, contact us within 14 days of delivery via WhatsApp or email. Specify the item you wish to exchange and your preferred size or color. We will arrange a pickup and deliver the replacement once we receive the original item. Exchanges are subject to stock availability.',
  },
  {
    id: 6,
    category: 'products',
    question: 'What materials are your products made from?',
    answer: 'Our products are crafted from premium materials sourced from skilled artisans across Pakistan. This includes hand-thrown ceramics, sustainably sourced wood, pure cotton and linen textiles, brass and copper metals, and natural soy wax for candles. Each product description includes detailed material information.',
  },
  {
    id: 7,
    category: 'products',
    question: 'Do you offer product customization?',
    answer: 'Yes, select items in our collection can be customized. This includes personalized engravings on ceramic pieces, custom sizes for textiles, and bespoke color options for certain decor items. Customized products typically take 7-14 additional business days and are non-returnable. Contact us to discuss your requirements.',
  },
  {
    id: 8,
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Cash on Delivery (COD), JazzCash, EasyPaisa, bank transfer, and all major credit/debit cards (Visa, Mastercard) through our secure payment gateway. All online transactions are encrypted and processed through SSL-secured servers for your safety.',
  },
  {
    id: 9,
    category: 'orders',
    question: 'How can I track my order?',
    answer: 'Once your order is dispatched, you will receive a tracking number via SMS and email. You can use this tracking number on our website or the courier partner\'s website to monitor your shipment in real time. You can also contact our support team for order status updates.',
  },
  {
    id: 10,
    category: 'orders',
    question: 'Do you offer gift wrapping?',
    answer: 'Yes! We offer premium gift wrapping for PKR 299. Each gift-wrapped order includes elegant packaging with a handwritten card and our signature gold ribbon. You can add gift wrapping during checkout. Gift wrapping is especially popular for our candle sets, vases, and decorative trays.',
  },
  {
    id: 11,
    category: 'products',
    question: 'Do your products come with a warranty?',
    answer: 'All our products undergo strict quality checks before dispatch. If you receive a defective or damaged item, please contact us within 48 hours of delivery with photo evidence, and we will provide a free replacement or full refund. Handcrafted items may have slight variations, which are a hallmark of artisan craftsmanship.',
  },
  {
    id: 12,
    category: 'payment',
    question: 'Do you have a loyalty or rewards program?',
    answer: 'Yes, we offer the Aura Rewards program. Earn 1 point for every PKR 100 spent. Points can be redeemed for discounts on future purchases — 100 points equals PKR 50 off. You also receive bonus points on your birthday, double points during sale events, and exclusive early access to new collections as a loyalty member.',
  },
  {
    id: 13,
    category: 'orders',
    question: 'Can I change or cancel my order after placing it?',
    answer: 'You can modify or cancel your order within 2 hours of placing it by contacting our support team. After 2 hours, your order enters processing and changes may not be possible. If your order has already been dispatched, you will need to follow our returns process once it is delivered.',
  },
  {
    id: 14,
    category: 'products',
    question: 'How should I care for my Aura Living products?',
    answer: 'Each product comes with specific care instructions. Generally, we recommend hand-washing ceramics and textiles with mild detergent, keeping candles away from direct sunlight, and dusting wooden items regularly. Avoid using harsh chemicals or abrasive cleaners on any of our products to maintain their beauty and longevity.',
  },
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

export default function FAQView() {
  const setPage = useStore((state) => state.setPage);
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('all');
  const [openId, setOpenId] = useState<number | null>(null);
  const accordionRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const chevronRefs = useRef<Map<number, SVGElement>>(new Map());

  // GSAP refs
  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%',
  });

  const contentRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7 });
  const ctaRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.2 });

  // GSAP-based accordion animation — uses scrollHeight so long answers are not clipped
  useEffect(() => {
    accordionRefs.current.forEach((el, id) => {
      if (id === openId) {
        // Use scrollHeight to fit any answer length; fall back to 'none' if undefined
        const targetHeight = el ? el.scrollHeight : 500;
        gsap.to(el, { maxHeight: targetHeight || 'none', opacity: 1, duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(el, { maxHeight: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
      }
    });
    chevronRefs.current.forEach((el, id) => {
      if (id === openId) {
        gsap.to(el, { rotation: 180, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.to(el, { rotation: 0, duration: 0.3, ease: 'power2.in' });
      }
    });
  }, [openId]);

  const filteredItems = activeCategory === 'all'
    ? faqItems
    : faqItems.filter((item) => item.category === activeCategory);

  const toggleItem = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/pages/faq-hero.webp)',
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
            <HelpCircle className="w-8 h-8" style={{ color: '#D4AF37' }} />
          </div>
          <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            AURA LIVING
          </span>
          <h1 className="text-white text-[32px] sm:text-[42px] md:text-[52px] font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Frequently Asked Questions
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
            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#8A8A8A' }} />
          <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>FAQ</span>
        </div>
      </div>

      {/* Category Tabs */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setOpenId(null); }}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-sm text-xs sm:text-sm font-medium tracking-wider uppercase cursor-pointer transition-all duration-300"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor: activeCategory === cat.key ? '#D4AF37' : '#FFFDF7',
                  color: activeCategory === cat.key ? '#FFFFFF' : '#5A5A5A',
                  border: `1px solid ${activeCategory === cat.key ? '#D4AF37' : '#E8D5A3'}`,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {filteredItems.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-sm overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: '#FFFDF7',
                    border: `1px solid ${isOpen ? '#D4AF37' : '#E8D5A3'}`,
                    borderLeft: isOpen ? '4px solid #D4AF37' : '4px solid transparent',
                  }}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-6 text-left cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    id={`faq-button-${item.id}`}
                  >
                    <span
                      className="text-sm sm:text-base font-semibold leading-relaxed"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: isOpen ? '#D4AF37' : '#2C2C2C',
                      }}
                    >
                      {item.question}
                    </span>
                    <ChevronDown
                      ref={(el) => { if (el) chevronRefs.current.set(item.id, el); }}
                      className="w-5 h-5 shrink-0"
                      style={{
                        color: isOpen ? '#D4AF37' : '#8A8A8A',
                      }}
                    />
                  </button>
                  <div
                    ref={(el) => { if (el) accordionRefs.current.set(item.id, el); }}
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-button-${item.id}`}
                    className="overflow-hidden"
                    style={{
                      maxHeight: 0,
                      opacity: 0,
                    }}
                  >
                    <div
                      className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base leading-relaxed"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: '#5A5A5A',
                        borderTop: isOpen ? '1px solid #E8D5A3' : 'none',
                        paddingTop: isOpen ? '16px' : '0px',
                      }}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5EDDA' }}>
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
            <MessageCircle className="w-8 h-8" style={{ color: '#D4AF37' }} />
          </div>
          <h2 className="text-[#2C2C2C] text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Still Have Questions?
          </h2>
          <div className="flex justify-center mb-4">
            <GoldDivider />
          </div>
          <p className="text-[#5A5A5A] text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our team is here to help. Reach out to us and we will get back to you as soon as possible.
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
              style={{ backgroundColor: '#25D366', color: '#FFFFFF', fontFamily: "'Poppins', sans-serif" }}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* JSON-LD structured data for FAQ rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
