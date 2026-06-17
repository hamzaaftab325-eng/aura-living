'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/hooks/useGsap';
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  Tag,
  Camera,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { products, formatPKR } from '@/data/products';

type PageType = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'wishlist' | 'account' | 'about' | 'contact' | 'login' | 'signup' | 'faq' | 'shipping' | 'returns' | 'care-guide' | 'new-arrivals' | 'sale' | 'lookbook' | 'terms' | 'privacy' | 'forgot-password';

interface NavLink {
  label: string;
  page: PageType;
  hasMegaMenu?: boolean;
}

const navLinks: NavLink[] = [
  { label: 'Home', page: 'home' },
  { label: 'Shop', page: 'shop', hasMegaMenu: true },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
];

interface MegaMenuItem {
  label: string;
  page: PageType;
  icon: React.ReactNode;
  description: string;
}

const megaMenuItems: MegaMenuItem[] = [
  {
    label: 'All Products',
    page: 'shop',
    icon: <ShoppingBag className="h-5 w-5" />,
    description: 'Browse our complete collection',
  },
  {
    label: 'New Arrivals',
    page: 'new-arrivals',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'The latest additions to our store',
  },
  {
    label: 'Sale',
    page: 'sale',
    icon: <Tag className="h-5 w-5" />,
    description: 'Exclusive offers & discounts',
  },
  {
    label: 'Lookbook',
    page: 'lookbook',
    icon: <Camera className="h-5 w-5" />,
    description: 'Curated style inspirations',
  },
  {
    label: 'Care Guide',
    page: 'care-guide',
    icon: <Heart className="h-5 w-5" />,
    description: 'Tips to preserve your luxury pieces',
  },
];

// Pages that belong to the Shop mega-menu family
const shopFamilyPages: PageType[] = ['shop', 'new-arrivals', 'sale', 'lookbook', 'care-guide'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  // Animated cursor for pill nav
  const [cursorPos, setCursorPos] = useState({ left: 0, width: 0, opacity: 0 });
  const navItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const searchInputRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileBackdropRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileShopContentRef = useRef<HTMLDivElement>(null);

  const { currentPage, setPage, getCartCount, cartOpen, setCartOpen, wishlist } = useStore();
  // Avoid hydration mismatch: persisted cart/wishlist load from localStorage on the client,
  // so server render sees 0 but client render may see a non-zero count. We render 0 on the
  // first client pass too, then update after mount.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  const cartCount = hydrated ? getCartCount() : 0;
  const wishlistCount = hydrated ? wishlist.length : 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logo animation on mount
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' });
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Focus search input when search opens; reset query only when actually closing (not in effect body)
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Mobile menu animation — staggered entrance with delay, GPU-accelerated
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
        // Stagger nav items after menu slides in
        const navItems = mobileMenuRef.current.querySelectorAll('.mobile-nav-item');
        const quickItems = mobileMenuRef.current.querySelectorAll('.mobile-quick-item');
        const ctaCard = mobileMenuRef.current.querySelector('.mobile-cta-card');
        if (navItems.length) {
          gsap.fromTo(navItems,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power3.out', delay: 0.25, force3D: true }
          );
        }
        if (quickItems.length) {
          gsap.fromTo(quickItems,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out', delay: 0.55, force3D: true }
          );
        }
        if (ctaCard) {
          gsap.fromTo(ctaCard,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', delay: 0.75, force3D: true }
          );
        }
    }
  }, [mobileMenuOpen]);

  // Mega menu animation — GPU-accelerated
  useEffect(() => {
    if (megaMenuOpen && megaMenuRef.current) {
      gsap.fromTo(
        megaMenuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', force3D: true }
      );
    }
  }, [megaMenuOpen]);

  // Mobile shop expand/collapse animation
  useEffect(() => {
    if (mobileShopContentRef.current) {
      if (mobileShopExpanded) {
        gsap.fromTo(
          mobileShopContentRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      } else {
        gsap.to(mobileShopContentRef.current, {
          height: 0, opacity: 0, duration: 0.2, ease: 'power2.in',
        });
      }
    }
  }, [mobileShopExpanded]);

  const handleNavClick = useCallback((page: PageType) => {
    setPage(page);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setMobileShopExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setPage]);

  const closeMobileMenu = useCallback(() => {
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        opacity: 0, duration: 0.2, ease: 'power2.in',
        onComplete: () => { setMobileMenuOpen(false); setMobileShopExpanded(false); },
      });
    } else {
      setMobileMenuOpen(false); setMobileShopExpanded(false);
    }
  }, []);

  // Mega menu hover handlers with delay
  const handleMegaMenuEnter = useCallback(() => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(true);
    }, 100);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) {
        clearTimeout(megaMenuTimeoutRef.current);
      }
    };
  }, []);

  const isLinkActive = (page: PageType, label: string) => {
    if (label === 'Shop') return shopFamilyPages.includes(currentPage);
    return currentPage === page;
  };

  const isMegaItemActive = (page: PageType) => {
    return currentPage === page;
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          borderBottom: 'none',
          boxShadow: 'none',
        }}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4">

          {/* ═══ Single Pill Container — logo + links + actions ═══ */}
          <div
            className="flex items-center justify-between rounded-full px-4 sm:px-5 py-2.5 sm:py-3"
            style={{
              backgroundColor: '#2C2C2C', border: '1px solid rgba(212, 175, 55, 0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}
          >
            {/* Logo */}
            <div
              ref={logoRef}
              className="cursor-pointer shrink-0 outline-none"
              onClick={() => handleNavClick('home')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNavClick('home'); } }}
              role="button"
              tabIndex={0}
              aria-label="Aura Living home"
            >
              <img src="/logo/default-monochrome-gold-white.svg" alt="Aura Living" style={{ height: 'clamp(50px, 8vw, 80px)', width: 'auto', objectFit: 'contain' }} />
            </div>

            {/* Desktop Nav Links — inside pill */}
            <div className="hidden lg:flex items-center">
              <ul
                className="relative mx-auto flex w-fit rounded-full p-1"
                onMouseLeave={() => {
                  setHoveredLink(null);
                  setCursorPos((pv) => ({ ...pv, opacity: 0 }));
                }}
              >
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.page, link.label);
                  return (
                    <li
                      key={link.label}
                      ref={(el) => {
                        if (el) navItemRefs.current.set(link.label, el);
                      }}
                      className="relative z-10 block cursor-pointer px-6 py-3 text-base uppercase font-medium transition-colors duration-200"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.7)',
                      }}
                      onMouseEnter={() => {
                        setHoveredLink(link.label);
                        if (link.hasMegaMenu) handleMegaMenuEnter();
                        const el = navItemRefs.current.get(link.label);
                        if (el) {
                          setCursorPos({
                            left: el.offsetLeft,
                            width: el.offsetWidth,
                            opacity: 1,
                          });
                        }
                      }}
                      onClick={() => handleNavClick(link.page)}
                    >
                      {link.label}
                      {link.hasMegaMenu && (
                        <ChevronDown
                          className="inline ml-1 h-3 w-3 transition-transform duration-300"
                          style={{
                            transform: megaMenuOpen && hoveredLink === link.label ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      )}
                    </li>
                  );
                })}

                {/* Animated cursor */}
                <motion.li
                  animate={cursorPos}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute z-0 h-7 rounded-full"
                  style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.25)',
                    top: '50%',
                    translateY: '-50%',
                  }}
                />
              </ul>
            </div>

            {/* Action icons — inside pill */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Search */}
              <button
                className="p-3 rounded-full transition-colors duration-200 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Wishlist — desktop/tablet */}
              <button
                className="relative hidden sm:flex p-2 rounded-full transition-colors duration-200 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                aria-label="Wishlist"
                onClick={() => handleNavClick('wishlist')}
              >
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-bold text-white px-1 bg-[#D4AF37]">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                className="relative p-2 rounded-full transition-colors duration-200 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                aria-label="Cart"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-bold text-white px-1 bg-[#D4AF37]">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account — desktop/tablet */}
              <button
                className="hidden sm:flex p-2 rounded-full transition-colors duration-200 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                aria-label="Account"
                onClick={() => handleNavClick('account')}
              >
                <User className="h-4 w-4" />
              </button>

              {/* Hamburger — mobile/tablet */}
              <button
                className="lg:hidden p-2 rounded-full transition-colors duration-200 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Desktop Mega Menu — outside pill, positioned below */}
          {megaMenuOpen && hoveredLink === 'Shop' && (
            <div
              ref={megaMenuRef}
              className="absolute left-1/2 -translate-x-1/2 pt-2"
              style={{ top: '100%', zIndex: 60 }}
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  background: 'rgba(44, 44, 44, 0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderTop: '2px solid #D4AF37',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                  minWidth: '280px',
                }}
              >
                <div className="py-3">
                  {megaMenuItems.map((item) => {
                    const itemActive = isMegaItemActive(item.page);
                    return (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-4 px-5 py-3 text-left transition-colors duration-200 group"
                        style={{
                          backgroundColor: itemActive ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = itemActive ? 'rgba(212, 175, 55, 0.12)' : 'transparent';
                        }}
                        onClick={() => handleNavClick(item.page)}
                      >
                        <div
                          className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                          style={{
                            backgroundColor: itemActive ? 'rgba(212, 175, 55, 0.2)' : 'rgba(232, 213, 163, 0.1)',
                            color: itemActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-medium"
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              color: itemActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.9)',
                            }}
                          >
                            {item.label}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              color: 'rgba(255, 255, 255, 0.4)',
                            }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu — Elegant Slide-In from Right */}
      {mobileMenuOpen && (
        <div
            ref={mobileMenuRef}
            className="fixed inset-0 z-[52] flex flex-col"
            style={{ backgroundColor: 'rgba(20, 20, 20, 0.97)', backdropFilter: 'blur(20px)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); closeMobileMenu(); } }}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 shrink-0" style={{ height: '72px', borderBottom: '1px solid rgba(212, 175, 55, 0.15)' }}>
              <img src="/logo/default-monochrome-gold-white.svg" alt="Aura Living" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
              <button className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10" style={{ color: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(212, 175, 55, 0.2)' }} onClick={closeMobileMenu} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Content — Modern clean design */}
            <div className="flex flex-col py-5 px-5 flex-1 overflow-y-auto">
              {/* Main Navigation Links */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[3px] font-medium px-3 mb-3" style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}>Menu</p>
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.page, link.label);
                  return (
                    <button
                      key={link.label}
                      className="mobile-nav-item flex items-center justify-between py-3.5 text-left transition-colors duration-200 rounded-xl px-3 w-full"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: isActive ? '#D4AF37' : '#2C2C2C',
                        backgroundColor: isActive ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                      }}
                      onClick={() => {
                        if (link.hasMegaMenu) {
                          setMobileShopExpanded(!mobileShopExpanded);
                        } else {
                          handleNavClick(link.page);
                        }
                      }}
                    >
                      <span className="text-base font-medium">{link.label}</span>
                      {link.hasMegaMenu && (
                        <ChevronDown
                          className="h-4 w-4 transition-transform duration-300"
                          style={{ transform: mobileShopExpanded ? 'rotate(180deg)' : 'rotate(0deg)', color: '#D4AF37' }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Shop Sub-menu */}
              {mobileShopExpanded && (
                <div ref={mobileShopContentRef} className="overflow-hidden pb-2">
                  <div className="pl-6 flex flex-col gap-0.5">
                    {megaMenuItems.map((item) => {
                      const itemActive = isMegaItemActive(item.page);
                      return (
                        <button
                          key={item.label}
                          className="flex items-center gap-3 py-2.5 px-3 text-left rounded-xl transition-all duration-200 hover:bg-white/10"
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            color: itemActive ? '#D4AF37' : '#5A5A5A',
                          }}
                          onClick={() => handleNavClick(item.page)}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-[11px]" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{item.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="my-5 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />

              {/* Quick Actions */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[3px] font-medium px-3 mb-3" style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}>Quick Actions</p>
                {[
                  { icon: <Search className="h-5 w-5" />, label: 'Search', page: 'shop' as PageType },
                  { icon: <Heart className="h-5 w-5" />, label: 'Wishlist', page: 'wishlist' as PageType, count: wishlistCount },
                  { icon: <ShoppingCart className="h-5 w-5" />, label: 'Cart', page: 'cart' as PageType, count: cartCount },
                  { icon: <User className="h-5 w-5" />, label: 'Account', page: 'account' as PageType },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="mobile-quick-item flex items-center gap-3 py-3.5 px-3 text-left transition-colors duration-200 hover:bg-white/10 rounded-xl w-full"
                    style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: "'Poppins', sans-serif" }}
                    onClick={() => { closeMobileMenu(); if (item.label === 'Cart') setCartOpen(true); if (item.label === 'Wishlist') handleNavClick('wishlist'); if (item.label === 'Search') { setSearchOpen(true); } if (item.label === 'Account') handleNavClick('account'); }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center relative" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
                      {item.icon}
                      {item.count && item.count > 0 ? (
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] font-bold text-white px-1 bg-[#D4AF37]">
                          {item.count}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-auto pt-6">
                <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(232,213,163,0.12) 100%)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p className="text-[11px] uppercase tracking-[3px] font-semibold mb-1.5" style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}>New Collection 2026</p>
                  <p className="text-xs mb-4 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: "'Poppins', sans-serif" }}>Explore our latest arrivals and handcrafted luxury pieces</p>
                  <button
                    className="premium-btn btn-gold px-5 py-2.5 text-xs w-full rounded-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                    onClick={() => handleNavClick('new-arrivals')}
                  >
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <>
          <div className="fixed inset-0 z-[55] bg-black/30" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
          <div
            className="fixed top-0 left-0 right-0 z-[56] py-6 px-4 sm:px-6"
            style={{ backgroundColor: 'rgba(44, 44, 44, 0.95)', borderBottom: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', backdropFilter: 'blur(12px)' }}
          >
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 shrink-0" style={{ color: '#D4AF37' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent outline-none text-base"
                  style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255, 255, 255, 0.9)' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      useStore.getState().setSearchQuery(searchQuery.trim());
                      setSearchOpen(false); setSearchQuery('');
                      handleNavClick('shop');
                    }
                  }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-2 rounded-full hover:bg-white/10 transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }} aria-label="Close search">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Search Results */}
              {searchQuery.trim().length > 1 && (
                <div className="mt-4 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {products
                    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 5)
                    .map((p) => (
                      <button
                        key={p.id}
                        className="w-full flex items-center gap-3 py-3 px-2 text-left rounded-lg transition-colors hover:bg-white/10"
                        onClick={() => {
                          useStore.getState().setSelectedProduct(p);
                          setSearchOpen(false); setSearchQuery('');
                          handleNavClick('product');
                        }}
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255, 255, 255, 0.9)' }}>{p.name}</p>
                          <p className="text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>{formatPKR(p.price)}</p>
                        </div>
                      </button>
                    ))}
                  {products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="text-sm py-4 text-center" style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255, 255, 255, 0.4)' }}>No products found for &quot;{searchQuery}&quot;</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
