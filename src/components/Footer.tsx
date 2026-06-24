'use client';

/**
 * Footer — thin shell that orchestrates all footer sub-components.
 *
 * STATE owned here (preserved from original — zero functionality change):
 * - (none — newsletter state moved into FooterNewsletter)
 *
 * REFS owned here:
 * - footerRef, gridRef (for GSAP scroll-triggered entrance animation)
 *
 * EFFECTS owned here (all preserved from original):
 * - GSAP columns entrance animation with safety fallback (3s timeout)
 *
 * Renders: <FooterBrand>, <FooterLinks> × 2, <FooterNewsletter>,
 * <GoldDivider>, <FooterBottom>.
 *
 * All styling via CSS classes (.aura-footer, .aura-footer-grid, etc.).
 * Zero inline styles.
 */

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { GoldDivider } from '@/components/SVGDecorations';
import {
  FooterBrand,
  FooterLinks,
  FooterNewsletter,
  FooterBottom,
  PinterestIcon,
} from '@/components/footer';

gsap.registerPlugin(ScrollTrigger);

// ── Static data ──

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Sale', href: '/sale' },
  { label: 'Lookbook', href: '/lookbook' },
];

const customerLinks = [
  { label: 'Shipping Info', href: '/shipping' },
  { label: 'Returns & Exchange', href: '/returns' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Care Guide', href: '/care-guide' },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: PinterestIcon, href: '#', label: 'Pinterest' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

const paymentMethods = ['COD', 'JazzCash', 'EasyPaisa', 'Bank Transfer'];

// ── Main component ──

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Hydration-safe mount — using a ref so we don't trigger a cascading re-render
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
  }, []);

  // Footer entrance animation — safe with fallback
  useEffect(() => {
    if (!mountedRef.current || !footerRef.current || !gridRef.current) return;

    const columns = gridRef.current.querySelectorAll(':scope > div');
    if (!columns.length) return;

    // Set initial state
    gsap.set(columns, { opacity: 0, y: 30 });

    // Animate in when scrolled into view
    const trigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(columns, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        });
      },
    });

    // Safety fallback: if columns are still hidden after 3s, show them
    const fallback = setTimeout(() => {
      columns.forEach((col) => {
        const el = col as HTMLElement;
        if ((gsap.getProperty(el, 'opacity') as number) === 0) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.3 });
        }
      });
    }, 3000);

    return () => {
      trigger.kill();
      clearTimeout(fallback);
    };
  }, [mountedRef]);

  return (
    <footer ref={footerRef} className="aura-footer">
      {/* Gold accent line top edge */}
      <div className="aura-footer-top-line" />

      {/* Subtle gradient transition from page cream to footer charcoal */}
      <div className="aura-footer-gradient-fade" />

      {/* Subtle brand pattern overlay */}
      <div className="aura-footer-pattern" />

      {/* Main Footer Content */}
      <div className="aura-footer-main">
        <div ref={gridRef} className="aura-footer-grid">
          <FooterBrand socialLinks={socialLinks} />
          <FooterLinks heading="Quick Links" links={quickLinks} />
          <FooterLinks heading="Customer Service" links={customerLinks} />
          <FooterNewsletter />
        </div>
      </div>

      {/* Gold Divider */}
      <div className="aura-footer-divider-wrap">
        <GoldDivider />
      </div>

      {/* Bottom Bar */}
      <div className="aura-footer-bottom-wrap">
        <FooterBottom paymentMethods={paymentMethods} />
      </div>

      {/* Bottom gold gradient accent */}
      <div className="aura-footer-bottom-line" />
    </footer>
  );
}
