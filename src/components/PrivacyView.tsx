'use client';

import { useGsapFadeIn, useGsapStagger, useGsapScaleIn } from '@/hooks/useGsap';
import { GoldDivider } from '@/components/SVGDecorations';
import { Shield, Lock, User, Settings, Share2,  Cookie, FileText, Clock, ExternalLink, Baby, RefreshCw, Mail } from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';


const sections = [
  {
    number: 1,
    title: 'Information We Collect',
    icon: User,
    paragraphs: [
      'We collect information that you provide directly to us when you create an account, place an order, or contact our support team. This includes personal information such as your name, email address, phone number, and delivery address.',
      'When you make a purchase, we collect payment information necessary to process your transaction. This may include details required for Cash on Delivery, JazzCash, or EasyPaisa payments. We do not store your full payment credentials on our servers.',
      'We also automatically collect certain information when you visit our website, including your browsing data (such as pages visited and time spent on each page), device information (such as browser type, operating system, and IP address), and referral source. This information helps us understand how visitors use our site and improve their experience.',
    ],
  },
  {
    number: 2,
    title: 'How We Use Your Information',
    icon: Settings,
    paragraphs: [
      'We use the information we collect to process and fulfill your orders, including shipping, delivery confirmation, and order-related communications. Your contact information allows us to send you order updates, delivery notifications, and customer support responses.',
      'We use browsing data and device information to improve our website, personalize your shopping experience, and optimize our services. This includes analyzing usage patterns, fixing technical issues, and making data-driven improvements to our product offerings.',
      'With your consent, we may use your email address to send marketing communications about new arrivals, special offers, and exclusive events. You can opt out of marketing emails at any time by clicking the unsubscribe link in any marketing email or by contacting us directly. We will never send you marketing emails without your explicit consent.',
    ],
  },
  {
    number: 3,
    title: 'Information Sharing',
    icon: Share2,
    paragraphs: [
      'We do not sell, trade, or rent your personal information to third parties. This is a core principle of our privacy commitment and one we take very seriously.',
      'We may share your information with trusted third parties only as necessary to provide our services: delivery partners (to ship your orders), payment processors (to process your transactions), and analytics providers (to help us understand site usage). These partners are contractually obligated to protect your data and use it only for the purposes we specify.',
      'We may also disclose your information if required by law, in response to a valid legal request (such as a court order or subpoena), or when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others, or to investigate fraud or security issues.',
    ],
  },
  {
    number: 4,
    title: 'Data Security',
    icon: Lock,
    paragraphs: [
      'We implement industry-standard security measures to protect your personal information. Our website uses SSL (Secure Sockets Layer) encryption to ensure that all data transmitted between your browser and our servers remains private and secure.',
      'All payment processing is handled through secure, PCI-compliant payment gateways. We do not store full credit card numbers or sensitive payment credentials on our servers. Regular security audits are conducted to identify and address potential vulnerabilities in our systems.',
      'While we take every reasonable precaution to protect your data, no method of transmission over the Internet or method of electronic storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest practicable standards of data protection.',
    ],
  },
  {
    number: 5,
    title: 'Cookies',
    icon: Cookie,
    paragraphs: [
      'Our website uses cookies — small text files placed on your device — to enhance your browsing experience. Essential cookies are required for the site to function properly, including maintaining your shopping cart, remembering your preferences, and enabling secure checkout.',
      'We also use analytics cookies to understand how visitors interact with our website, which pages are most popular, and how we can improve the user experience. These cookies collect anonymous, aggregated data and do not personally identify you.',
      'You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies, and you can set preferences for specific sites. Please note that disabling essential cookies may affect the functionality of our website, particularly the checkout process.',
    ],
  },
  {
    number: 6,
    title: 'Your Rights',
    icon: FileText,
    paragraphs: [
      'You have the right to access the personal information we hold about you. You can request a copy of your data at any time by contacting us at privacy@auraliving.pk.',
      'You have the right to request correction of any inaccurate or incomplete personal information we hold about you. You also have the right to request deletion of your personal data, subject to certain legal exceptions such as data we are required to retain for order processing or legal compliance.',
      'You can opt out of marketing communications at any time. Simply click the unsubscribe link in any marketing email or contact us directly. Opting out of marketing will not affect our ability to send you transactional communications related to your orders.',
    ],
  },
  {
    number: 7,
    title: 'Data Retention',
    icon: Clock,
    paragraphs: [
      'We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. Order-related data is typically retained for a minimum of three years to comply with tax and consumer protection regulations.',
      'When your data is no longer needed, we will securely delete or anonymize it in accordance with our data retention policy. If you wish to have your data deleted sooner, you may submit a request to privacy@auraliving.pk, and we will process it within 30 days, subject to any legal retention requirements.',
    ],
  },
  {
    number: 8,
    title: 'Third-Party Links',
    icon: ExternalLink,
    paragraphs: [
      'Our website may contain links to external websites that are not operated or controlled by Aura Living. We are not responsible for the content, privacy policies, or practices of any third-party websites.',
      'We encourage you to review the privacy policies of any third-party sites you visit through links on our website. This Privacy Policy applies only to information collected on the Aura Living website and does not cover practices of external sites.',
    ],
  },
  {
    number: 9,
    title: "Children's Privacy",
    icon: Baby,
    paragraphs: [
      'Our website and services are not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected personal data from a child under 13, we will take steps to delete that information as quickly as possible.',
      'If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@auraliving.pk so we can take appropriate action.',
    ],
  },
  {
    number: 10,
    title: 'Changes to Policy',
    icon: RefreshCw,
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will update the "Last updated" date at the top of this page.',
      'We encourage you to review this Privacy Policy regularly to stay informed about how we protect your information. Your continued use of our website after any changes constitutes acceptance of the updated Privacy Policy.',
    ],
  },
  {
    number: 11,
    title: 'Contact Us',
    icon: Mail,
    paragraphs: [
      'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at privacy@auraliving.pk. We are committed to addressing your privacy concerns promptly and will respond to all inquiries within 2 business days.',
    ],
  },
];

export default function PrivacyView() {

  const heroRef = useGsapStagger<HTMLDivElement>({
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out',
    start: 'top 90%',
  });

  const contentRef = useGsapStagger<HTMLDivElement>({
    selector: '.privacy-section',
    y: 60,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
    start: 'top 85%',
  });

  const ctaRef = useGsapFadeIn<HTMLDivElement>({ y: 30, duration: 0.7, delay: 0.2 });
  const dividerRef = useGsapScaleIn<HTMLDivElement>({ duration: 0.6, delay: 0.2 });

  return (
    <div className="w-full page-transition" style={{ backgroundColor: 'var(--surface-page)' }}>
      {/* Hero */}
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(/images/pages/privacy-hero.webp)',
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
            <Shield className="w-8 h-8" style={{ color: 'var(--color-gold-text)' }} />
          </div>
          <span className="text-[var(--color-gold)] text-xs sm:text-sm tracking-[4px] uppercase font-medium mb-4" >
            AURA LIVING
          </span>
          <h1 className="aura-hero-title text-white" >
            Privacy Policy
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
            <div className="w-10 sm:w-14 h-px bg-[var(--color-gold)]/60" />
          </div>
          <p className="text-[var(--color-gold-soft)] text-sm mt-4" >
            Last updated: June 2026
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' },
        ]}
      />

      {/* Intro */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[var(--color-warm-gray)] text-base sm:text-lg leading-relaxed" >
            At Aura Living, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-gold-pale)' }}>
        <div ref={contentRef} className="max-w-4xl mx-auto flex flex-col gap-6">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div
                key={section.number}
                className="privacy-section rounded-xl p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:border-[var(--color-gold)]"
                style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--color-gold-soft)' }}
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.12)' }}>
                      <SectionIcon className="w-5 h-5" style={{ color: 'var(--color-gold-text)' }} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm"
                        style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: 'var(--color-gold)' }}
                      >
                        {String(section.number).padStart(2, '0')}
                      </span>
                      <h3 className="text-[var(--surface-dark)] text-lg sm:text-xl font-semibold" >
                        {section.title}
                      </h3>
                    </div>
                    {section.paragraphs.map((paragraph, idx) => (
                      <p key={idx} className="text-[var(--color-warm-gray)] text-sm sm:text-base leading-relaxed" >
                        {paragraph}
                      </p>
                    ))}
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
            <Lock className="w-8 h-8" style={{ color: 'var(--color-gold-text)' }} />
          </div>
          <h2 className="text-[var(--surface-dark)] text-[28px] sm:text-[32px] lg:text-[40px] font-bold mb-4" >
            Your Privacy Matters
          </h2>
          <div className="flex justify-center mb-4">
            <GoldDivider />
          </div>
          <p className="text-[var(--color-warm-gray)] text-base sm:text-lg mb-6 max-w-lg mx-auto leading-relaxed" >
            We take the protection of your personal data seriously. If you have any questions or concerns, reach out to us at{' '}
            <a href="mailto:privacy@auraliving.pk" className="font-semibold transition-colors duration-200 hover:text-[var(--color-gold-hover)]" style={{ color: 'var(--color-gold)' }}>
              privacy@auraliving.pk
            </a>
          </p>
          <Link
            href="/terms"
            className="text-sm font-semibold transition-colors duration-200 hover:text-[var(--color-gold-hover)] cursor-pointer"
            style={{ color: 'var(--color-gold)', background: 'none' }}
          >
            View our Terms of Service →
          </Link>
        </div>
      </section>
    </div>
  );
}
