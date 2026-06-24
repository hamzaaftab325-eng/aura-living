'use client';

/**
 * MobileMenu — full-screen slide-in mobile navigation.
 *
 * Renders: header (logo + close button), main nav links (Shop expands inline
 * to show submenu), quick actions (Search, Wishlist, Cart, Account), and
 * a CTA card at the bottom.
 *
 * GSAP entrance animation: container fades in, nav items stagger from right,
 * quick items stagger from right, CTA card slides up.
 *
 * All styling via CSS classes (.aura-nav-mobile, .aura-nav-mobile-header,
 * .aura-nav-mobile-item, .aura-nav-mobile-submenu, .aura-nav-mobile-quick,
 * .aura-nav-mobile-cta, etc.). Zero inline styles.
 */

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronRight, Search, Heart, ShoppingCart, User, X } from 'lucide-react';
import gsap from 'gsap';
import { trapFocus, focusFirst } from '@/lib/focusTrap';
import type { MegaMenuItem } from './MegaMenu';

interface NavLink {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

interface MobileMenuProps {
  open: boolean;
  navLinks: NavLink[];
  megaMenuItems: MegaMenuItem[];
  mobileShopExpanded: boolean;
  cartCount: number;
  wishlistCount: number;
  isLinkActive: (href: string, label: string) => boolean;
  isMegaItemActive: (href: string) => boolean;
  onMobileShopToggle: () => void;
  onClose: () => void;
  onSearchOpen: () => void;
  onCartOpen: () => void;
}

export default function MobileMenu({
  open,
  navLinks,
  megaMenuItems,
  mobileShopExpanded,
  cartCount,
  wishlistCount,
  isLinkActive,
  isMegaItemActive,
  onMobileShopToggle,
  onClose,
  onSearchOpen,
  onCartOpen,
}: MobileMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Entrance animation — fade + stagger items
  useEffect(() => {
    if (!open || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    );
    const navItems = ref.current.querySelectorAll('.mobile-nav-item');
    const quickItems = ref.current.querySelectorAll('.mobile-quick-item');
    const ctaCard = ref.current.querySelector('.mobile-cta-card');
    if (navItems.length) {
      gsap.fromTo(
        navItems,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.25, stagger: 0.04, ease: 'power3.out', delay: 0.08, force3D: true }
      );
    }
    if (quickItems.length) {
      gsap.fromTo(
        quickItems,
        { opacity: 0, x: 16 },
        { opacity: 1, x: 0, duration: 0.22, stagger: 0.03, ease: 'power3.out', delay: 0.2, force3D: true }
      );
    }
    if (ctaCard) {
      gsap.fromTo(
        ctaCard,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', delay: 0.3, force3D: true }
      );
    }
  }, [open]);

  // Focus trap + restore focus on close
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => focusFirst(ref.current), 100);
    const releaseTrap = trapFocus(ref.current);
    return () => {
      clearTimeout(t);
      releaseTrap();
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const handleLinkClick = () => {
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickActionClick = (label: string) => {
    onClose();
    if (label === 'Cart') {
      onCartOpen();
      return;
    }
    if (label === 'Search') {
      onSearchOpen();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={ref}
      className="aura-nav-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
    >
      {/* Header */}
      <div className="aura-nav-mobile-header">
        <img
          src="/logo/default-monochrome-gold-white.svg"
          alt="Aura Living"
          className="aura-nav-mobile-logo"
        />
        <button
          className="aura-nav-mobile-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="aura-nav-mobile-close-icon" />
        </button>
      </div>

      {/* Content */}
      <div className="aura-nav-mobile-content">
        {/* Main nav links */}
        <div className="aura-nav-mobile-section">
          <p className="aura-nav-mobile-section-label">Menu</p>
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href, link.label);
            const labelInner = (
              <>
                <span className="aura-nav-mobile-item-text">{link.label}</span>
                {link.hasMegaMenu && (
                  <ChevronDown
                    className={`aura-nav-mobile-chev ${mobileShopExpanded ? 'aura-nav-mobile-chev--open' : ''}`}
                  />
                )}
              </>
            );
            return (
              <div key={link.label}>
                {link.hasMegaMenu ? (
                  <button
                    type="button"
                    className={`mobile-nav-item aura-nav-mobile-item ${isActive ? 'aura-nav-mobile-item--active' : ''}`}
                    onClick={onMobileShopToggle}
                    aria-expanded={mobileShopExpanded}
                  >
                    {labelInner}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`mobile-nav-item aura-nav-mobile-item ${isActive ? 'aura-nav-mobile-item--active' : ''}`}
                  >
                    {labelInner}
                  </Link>
                )}

                {/* Inline Shop submenu — CSS grid trick for smooth height animation */}
                {link.hasMegaMenu && (
                  <div className={`aura-nav-mobile-submenu ${mobileShopExpanded ? 'aura-nav-mobile-submenu--open' : ''}`}>
                    <div className="aura-nav-mobile-submenu-inner">
                      <div className="aura-nav-mobile-submenu-divider" />
                      {megaMenuItems.map((item) => {
                        const itemActive = isMegaItemActive(item.href);
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={`aura-nav-mobile-submenu-item ${itemActive ? 'aura-nav-mobile-submenu-item--active' : ''}`}
                          >
                            <div className="aura-nav-mobile-submenu-icon">{item.icon}</div>
                            <div className="aura-nav-mobile-submenu-text">
                              <p className="aura-nav-mobile-submenu-label">
                                {item.label}
                                {itemActive && <span className="aura-nav-mobile-current">Current</span>}
                              </p>
                              <p className="aura-nav-mobile-submenu-desc">{item.description}</p>
                            </div>
                            <ChevronRight className="aura-nav-mobile-submenu-arrow" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="aura-nav-mobile-divider" />

        {/* Quick actions */}
        <div className="aura-nav-mobile-section">
          <p className="aura-nav-mobile-section-label">Quick Actions</p>
          {[
            { icon: <Search className="aura-nav-mobile-quick-icon" />, label: 'Search', href: null as string | null },
            { icon: <Heart className="aura-nav-mobile-quick-icon" />, label: 'Wishlist', href: '/wishlist', count: wishlistCount },
            { icon: <ShoppingCart className="aura-nav-mobile-quick-icon" />, label: 'Cart', href: null as string | null, count: cartCount },
            { icon: <User className="aura-nav-mobile-quick-icon" />, label: 'Account', href: '/account' },
          ].map((item) => {
            const inner = (
              <>
                <div className="aura-nav-mobile-quick-iconwrap">
                  {item.icon}
                  {item.count && item.count > 0 ? (
                    <span className="aura-nav-mobile-badge" aria-hidden="true">
                      {item.count}
                    </span>
                  ) : null}
                </div>
                <span className="aura-nav-mobile-quick-text">{item.label}</span>
              </>
            );
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => handleQuickActionClick(item.label)}
                  className="mobile-quick-item aura-nav-mobile-quick"
                >
                  {inner}
                </Link>
              );
            }
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleQuickActionClick(item.label)}
                className="mobile-quick-item aura-nav-mobile-quick"
              >
                {inner}
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="aura-nav-mobile-cta-wrap">
          <div className="mobile-cta-card aura-nav-mobile-cta">
            <p className="aura-nav-mobile-cta-eyebrow">New Collection 2026</p>
            <p className="aura-nav-mobile-cta-text">
              Explore our latest arrivals and handcrafted luxury pieces
            </p>
            <Link
              href="/new-arrivals"
              onClick={handleLinkClick}
              className="aura-nav-mobile-cta-btn premium-btn btn-primary btn-sm"
            >
              Explore Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
