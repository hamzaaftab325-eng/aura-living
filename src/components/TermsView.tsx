'use client';

import { useGsapFadeIn, useGsapStagger, useGsapScaleIn } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import { FileText, ChevronRight, CheckCircle, Shield, CreditCard, Truck, RotateCcw, Lock, AlertTriangle, Eye, Mail, RefreshCw } from 'lucide-react';
import { useStore } from '@/store/useStore';


const sections = [
  {
    number: 1,
    title: 'Acceptance of Terms',
    icon: CheckCircle,
    content:
      'By accessing and using Aura Living\'s website, you agree to be bound by these Terms of Service, along with our Privacy Policy. If you do not agree with any part of these terms, you must not use our website or services. Your continued use of the site following the posting of any changes constitutes acceptance of those changes.',
  },
  {
    number: 2,
    title: 'Use of Website',
    icon: Eye,
    content:
      'This website is provided for personal, non-commercial use only. You must not misuse the site or its content, including but not limited to: attempting to gain unauthorized access to any part of the site, using the site for any unlawful purpose, transmitting any harmful or malicious code, or reproducing, duplicating, or copying any part of the site without our express written permission. We reserve the right to restrict your access to the site at our sole discretion.',
  },
  {
    number: 3,
    title: 'Products & Pricing',
    icon: CreditCard,
    content:
      'All prices displayed on our website are in Pakistani Rupees (PKR) and are subject to change without prior notice. While we make every effort to display accurate colours and product details, the colours you see on your screen may vary slightly from the actual product due to differences in monitor settings and display capabilities. We reserve the right to limit the quantity of any product purchased per customer and to discontinue any product at any time without liability.',
  },
  {
    number: 4,
    title: 'Orders & Payment',
    icon: CreditCard,
    content:
      'Your order constitutes an offer to purchase products from Aura Living. All orders are subject to availability and confirmation of the order price. We accept the following payment methods: Cash on Delivery (COD), JazzCash, and EasyPaisa. We reserve the right to refuse or cancel any order for any reason, including but not limited to: product unavailability, pricing errors, or suspected fraudulent transactions. In the event of a pricing error, we will notify you and offer the option to confirm the order at the correct price or cancel it.',
  },
  {
    number: 5,
    title: 'Shipping & Delivery',
    icon: Truck,
    content:
      'We deliver across Pakistan. Delivery times provided are estimates only and are not guaranteed. Actual delivery times may vary depending on your location, product availability, and courier partner schedules. Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. We are not responsible for delays caused by the courier, customs, or other factors beyond our control. Tracking information will be provided once your order has been dispatched.',
  },
  {
    number: 6,
    title: 'Returns & Refunds',
    icon: RotateCcw,
    content:
      'We offer a 14-day return policy from the date of delivery. Items must be unused, in their original packaging, and with all tags still attached to be eligible for a return. Customized and personalized items cannot be returned unless they arrive damaged. For full details on our return and exchange process, including how to initiate a return, please visit our Returns & Exchanges page.',
    linkText: 'View Returns & Exchanges Policy',
    linkPage: 'returns' as const,
  },
  {
    number: 7,
    title: 'Intellectual Property',
    icon: Lock,
    content:
      'All content on this website, including but not limited to text, graphics, logos, images, product descriptions, and software, is the property of Aura Living and is protected by applicable intellectual property laws. No part of this website may be reproduced, distributed, or transmitted in any form without the prior written consent of Aura Living. Our brand name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Aura Living.',
  },
  {
    number: 8,
    title: 'Limitation of Liability',
    icon: AlertTriangle,
    content:
      'To the fullest extent permitted by law, Aura Living shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the website or products purchased from it. Our maximum liability to you for any claim arising from the use of this website or products shall not exceed the purchase price paid by you for the specific product giving rise to the claim.',
  },
  {
    number: 9,
    title: 'Privacy',
    icon: Shield,
    content:
      'Your privacy is important to us. For detailed information on how we collect, use, and protect your personal data, please refer to our Privacy Policy. By using our website, you consent to the data practices described in our Privacy Policy.',
    linkText: 'View Privacy Policy',
    linkPage: 'privacy' as const,
  },
  {
    number: 10,
    title: 'Changes to Terms',
    icon: RefreshCw,
    content:
      'We reserve the right to modify or replace these Terms of Service at any time at our sole discretion. If a revision is material, we will make reasonable efforts to provide notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Your continued use of the website after any changes constitutes acceptance of the new Terms of Service.',
  },
  {
    number: 11,
    title: 'Contact',
    icon: Mail,
    content:
      'If you have any questions or concerns about these Terms of Service, please contact us at legal@auraliving.pk. We are committed to addressing your concerns promptly and will respond to all inquiries within 2 business days.',
  },
];

export default function TermsView() {
  const setPage = useStore((state) => state.setPage);

  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%',
  });

  const contentRef = useGsapStagger<HTMLDivElement>({
    selector: '.terms-section',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%',
  });

  const ctaRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.2 });
  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

  return (
    <div className="w-full page-transition" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Hero */}
      <section className="relative w-full h-[45vh] sm:h-[55vh] md:h-[60vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/pages/terms-hero.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(44,44,44,0.8) 0%, rgba(44,44,44,0.55) 50%, rgba(212,175,55,0.15) 100%)' }}
        />

        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}>
            <FileText className="w-8 h-8" style={{ color: '#D4AF37' }} />
          </div>
          <span className="text-[#D4AF37] text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            AURA LIVING
          </span>
          <h1 className="text-white text-[32px] sm:text-[42px] md:text-[52px] font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Terms of Service
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <div className="w-10 sm:w-14 h-px bg-[#D4AF37]/60" />
          </div>
          <p className="text-[#E8D5A3] text-sm mt-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Last updated: June 2026
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 breadcrumb-animate" style={{ backgroundColor: '#F5EDDA' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <button
            onClick={() => setPage('home')}
            className="text-sm transition-colors duration-200 hover:text-[#D4AF37] cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A', background: 'none', border: 'none' }}
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#8A8A8A' }} />
          <span className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>Terms of Service</span>
        </div>
      </div>

      {/* Intro */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#5A5A5A] text-base sm:text-lg leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Please read these Terms of Service carefully before using the Aura Living website. By accessing or using our site, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5EDDA' }}>
        <div ref={contentRef} className="max-w-4xl mx-auto flex flex-col gap-6">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div
                key={section.number}
                className="terms-section rounded-sm p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:border-[#D4AF37]"
                style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}>
                      <SectionIcon className="w-5 h-5" style={{ color: '#D4AF37' }} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm"
                        style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}
                      >
                        {String(section.number).padStart(2, '0')}
                      </span>
                      <h3 className="text-[#2C2C2C] text-lg sm:text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-[#5A5A5A] text-sm sm:text-base leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {section.content}
                    </p>
                    {section.linkText && section.linkPage && (
                      <button
                        onClick={() => setPage(section.linkPage)}
                        className="text-sm font-semibold transition-colors duration-200 hover:text-[#C9A22E] cursor-pointer mt-1 self-start"
                        style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif", background: 'none', border: 'none' }}
                      >
                        {section.linkText} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
            <Shield className="w-8 h-8" style={{ color: '#D4AF37' }} />
          </div>
          <h2 className="text-[#2C2C2C] text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Questions About Our Terms?
          </h2>
          <div className="flex justify-center mb-4">
            <GoldDivider />
          </div>
          <p className="text-[#5A5A5A] text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
            We are here to help. If you have any questions or concerns about our terms, feel free to reach out to our team at{' '}
            <a href="mailto:legal@auraliving.pk" className="font-semibold transition-colors duration-200 hover:text-[#C9A22E]" style={{ color: '#D4AF37' }}>
              legal@auraliving.pk
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
