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
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Tag,
  Camera,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { products, formatPKR } from '@/data/products';

type PageType = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'wishlist' | 'account' | 'about' | 'contact' | 'login' | 'signup' | 'faq' | 'shipping' | 'returns' | 'care-guide' | 'new-arrivals' | 'sale' | 'lookbook' | 'terms' | 'privacy' | 'forgot-password' | 'track-orders' | 'addresses' | 'settings';

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
  preview: {
    image: string;
    eyebrow: string;
    headline: string;
    cta: string;
  };
}

const megaMenuItems: MegaMenuItem[] = [
  {
    label: 'All Products',
    page: 'shop',
    icon: <ShoppingBag className="h-5 w-5" />,
    description: 'Browse our complete collection',
    preview: {
      image: '/images/pages/shop-hero.webp',
      eyebrow: 'The Full Collection',
      headline: 'Explore Every Piece, Curated for Pakistan',
      cta: 'Shop Everything',
    },
  },
  {
    label: 'New Arrivals',
    page: 'new-arrivals',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'The latest additions to our store',
    preview: {
      image: '/images/pages/new-arrivals-hero.webp',
      eyebrow: 'Fresh Off the Workbench',
      headline: "New Pieces, Just Landed This Week",
      cta: "Discover What's New",
    },
  },
  {
    label: 'Sale',
    page: 'sale',
    icon: <Tag className="h-5 w-5" />,
    description: 'Exclusive offers & discounts',
    preview: {
      image: '/images/pages/sale-hero.webp',
      eyebrow: 'Limited Time Only',
      headline: 'Up to 40% Off Select Home Treasures',
      cta: 'Shop the Sale',
    },
  },
  {
    label: 'Lookbook',
    page: 'lookbook',
    icon: <Camera className="h-5 w-5" />,
    description: 'Curated style inspirations',
    preview: {
      image: '/images/pages/lookbook-hero.webp',
      eyebrow: 'Styled Spaces',
      headline: 'Real Rooms, Real Inspiration for Your Home',
      cta: 'Browse the Lookbook',
    },
  },
  {
    label: 'Care Guide',
    page: 'care-guide',
    icon: <Heart className="h-5 w-5" />,
    description: 'Tips to preserve your luxury pieces',
    preview: {
      image: '/images/pages/care-guide-hero.webp',
      eyebrow: 'Preserve the Beauty',
      headline: 'How to Care for Your Aura Pieces for Years',
      cta: 'Read the Guide',
    },
  },
];

// Pages that belong to the Shop mega-menu family (highlight "Shop" when on any of these)
const shopFamilyPages: PageType[] = ['shop', 'new-arrivals', 'sale', 'lookbook', 'care-guide'];

export default function Navbar() {
  // ── UI state ──
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MegaMenuItem | null>(null);
  const [cursorPos, setCursorPos] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // ── Refs ──
  const navItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const searchInputRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // ── Store ──
  const { currentPage, setPage, getCartCount, cartOpen, setCartOpen, wishlist } = useStore();

  // Hydration guard — persisted cart/wishlist read from localStorage on the client only
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  const cartCount = hydrated ? getCartCount() : 0;
  const wishlistCount = hydrated ? wishlist.length : 0;

  // ── Effects ──
  // Scroll detection — shrink navbar after scrolling 60px
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll(); // Initialize on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logo entrance animation
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' });
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Mobile menu entrance animation — fast and snappy
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power2.out' }
      );
      const navItems = mobileMenuRef.current.querySelectorAll('.mobile-nav-item');
      const quickItems = mobileMenuRef.current.querySelectorAll('.mobile-quick-item');
      const ctaCard = mobileMenuRef.current.querySelector('.mobile-cta-card');
      if (navItems.length) {
        gsap.fromTo(navItems,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.25, stagger: 0.04, ease: 'power3.out', delay: 0.08, force3D: true }
        );
      }
      if (quickItems.length) {
        gsap.fromTo(quickItems,
          { opacity: 0, x: 16 },
          { opacity: 1, x: 0, duration: 0.22, stagger: 0.03, ease: 'power3.out', delay: 0.2, force3D: true }
        );
      }
      if (ctaCard) {
        gsap.fromTo(ctaCard,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', delay: 0.3, force3D: true }
        );
      }
    }
  }, [mobileMenuOpen]);

  // Mega menu entrance animation
  useEffect(() => {
    if (megaMenuOpen && megaMenuRef.current) {
      gsap.fromTo(
        megaMenuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', force3D: true }
      );
    }
  }, [megaMenuOpen]);

  // Close mega menu on click outside OR Escape key
  useEffect(() => {
    if (!megaMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Don't close if click is inside the mega menu panel or on the Shop link itself
      if (megaMenuRef.current?.contains(target)) return;
      // Also check if click is on any nav link (Shop toggles separately)
      const shopLink = navItemRefs.current.get('Shop');
      if (shopLink?.contains(target)) return;
      setMegaMenuOpen(false);
      setPreviewItem(null);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaMenuOpen(false);
        setPreviewItem(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [megaMenuOpen]);

  // ── Handlers ──
  const handleNavClick = useCallback((page: PageType) => {
    setPage(page);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setMobileShopExpanded(false);
    setPreviewItem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setPage]);

  const closeMobileMenu = useCallback(() => {
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        opacity: 0, duration: 0.15, ease: 'power2.in',
        onComplete: () => { setMobileMenuOpen(false); setMobileShopExpanded(false); },
      });
    } else {
      setMobileMenuOpen(false);
      setMobileShopExpanded(false);
    }
  }, []);

  // Mega menu CLICK toggle (no hover). Shop link calls this instead of navigating.
  const toggleMegaMenu = useCallback(() => {
    setMegaMenuOpen((prev) => {
      const next = !prev;
      if (!next) setPreviewItem(null);
      return next;
    });
  }, []);

  // ── Helpers ──
  const isLinkActive = (page: PageType, label: string) => {
    if (label === 'Shop') return shopFamilyPages.includes(currentPage);
    return currentPage === page;
  };

  const isMegaItemActive = (page: PageType) => currentPage === page;

  const activePreview = previewItem ?? megaMenuItems[0];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          DESKTOP NAV — Pill container with logo + links + actions
          ═══════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background: 'transparent' }}
      >
        <div
          className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 transition-all duration-300"
          style={{ paddingTop: scrolled ? '8px' : '14px', paddingBottom: scrolled ? '4px' : '8px' }}
        >

          {/* Pill container — NO hover handlers (mega menu is click-only now) */}
          <div
            className="relative flex items-center justify-between rounded-full transition-all duration-300 ease-out"
            style={{
              backgroundColor: '#2C2C2C',
              border: scrolled ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid rgba(212, 175, 55, 0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              paddingLeft: scrolled ? '14px' : '16px',
              paddingRight: scrolled ? '14px' : '16px',
              paddingTop: scrolled ? '8px' : '10px',
              paddingBottom: scrolled ? '8px' : '12px',
              boxShadow: scrolled ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
            }}
          >
            {/* Logo */}
            <div
              ref={logoRef}
              className="cursor-pointer shrink-0 outline-none transition-all duration-300"
              onClick={() => handleNavClick('home')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNavClick('home'); } }}
              role="button"
              tabIndex={0}
              aria-label="Aura Living home"
            >
              <img
                src="/logo/default-monochrome-gold-white.svg"
                alt="Aura Living"
                style={{
                  height: scrolled ? 'clamp(38px, 6vw, 52px)' : 'clamp(46px, 7vw, 64px)',
                  width: 'auto',
                  objectFit: 'contain',
                  transition: 'height 0.3s ease-out',
                }}
              />
            </div>

            {/* Desktop Nav Links — inside pill */}
            <div className="hidden lg:flex items-center">
              <ul
                className="relative mx-auto flex w-fit rounded-full p-1"
                onMouseLeave={() => setCursorPos((pv) => ({ ...pv, opacity: 0 }))}
              >
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.page, link.label);
                  return (
                    <li
                      key={link.label}
                      ref={(el) => { if (el) navItemRefs.current.set(link.label, el); }}
                      className="relative z-10 block cursor-pointer uppercase font-medium transition-all duration-300 select-none"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.85)',
                        paddingLeft: scrolled ? '20px' : '24px',
                        paddingRight: scrolled ? '20px' : '24px',
                        paddingTop: scrolled ? '8px' : '12px',
                        paddingBottom: scrolled ? '8px' : '12px',
                        fontSize: scrolled ? '13px' : '15px',
                      }}
                      onMouseEnter={() => {
                        setHoveredLink(link.label);
                        const el = navItemRefs.current.get(link.label);
                        if (el) {
                          setCursorPos({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
                        }
                      }}
                      onClick={() => {
                        // Shop link ONLY toggles the dropdown — does NOT navigate to /shop
                        if (link.hasMegaMenu) {
                          toggleMegaMenu();
                        } else {
                          handleNavClick(link.page);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-haspopup={link.hasMegaMenu ? 'menu' : undefined}
                      aria-expanded={link.hasMegaMenu ? megaMenuOpen : undefined}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (link.hasMegaMenu) {
                            toggleMegaMenu();
                          } else {
                            handleNavClick(link.page);
                          }
                        }
                      }}
                    >
                      {link.label}
                      {link.hasMegaMenu && (
                        <ChevronDown
                          className="inline ml-1 h-3 w-3 transition-transform duration-300"
                          style={{ transform: megaMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      )}
                    </li>
                  );
                })}

                {/* Animated cursor pill */}
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
              <button
                className="rounded-full transition-all duration-300 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.85)', padding: scrolled ? '8px' : '12px' }}
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                className="relative hidden sm:flex rounded-full transition-all duration-300 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.85)', padding: scrolled ? '6px' : '8px' }}
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

              <button
                className="relative rounded-full transition-all duration-300 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.85)', padding: scrolled ? '6px' : '8px' }}
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

              <button
                className="hidden sm:flex rounded-full transition-all duration-300 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.85)', padding: scrolled ? '6px' : '8px' }}
                aria-label="Account"
                onClick={() => handleNavClick('account')}
              >
                <User className="h-4 w-4" />
              </button>

              <button
                className="lg:hidden rounded-full transition-all duration-300 hover:bg-white/10"
                style={{ color: 'rgba(255, 255, 255, 0.85)', padding: scrolled ? '6px' : '8px' }}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                DESKTOP MEGA MENU — two-column panel with image preview
                Absolutely positioned, but DOM-descendant of the pill.
                Opens on click (not hover) and closes on click-outside / Escape.
                ═══════════════════════════════════════════════════════════ */}
            {megaMenuOpen && (
              <div
                ref={megaMenuRef}
                className="absolute left-1/2 -translate-x-1/2 pt-3"
                style={{ top: '100%', zIndex: 60 }}
              >
                <div
                  className="rounded-2xl overflow-hidden flex"
                  style={{
                    background: 'rgba(28, 28, 28, 0.94)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '2px solid #D4AF37',
                    boxShadow: '0 16px 50px rgba(0,0,0,0.35), 0 0 0 1px rgba(212,175,55,0.1)',
                    width: 'min(720px, calc(100vw - 32px))',
                  }}
                >
                  {/* Left column — navigation items */}
                  <div className="flex-1 py-4" style={{ borderRight: '1px solid rgba(212,175,55,0.12)' }}>
                    <p
                      className="px-5 pb-2 text-[10px] uppercase tracking-[3px] font-semibold"
                      style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}
                    >
                      Explore
                    </p>
                    {megaMenuItems.map((item) => {
                      const itemActive = isMegaItemActive(item.page);
                      const isPreviewing = activePreview.page === item.page;
                      return (
                        <button
                          key={item.label}
                          className="w-full flex items-center gap-4 px-5 py-3 text-left transition-colors duration-200"
                          style={{
                            backgroundColor: isPreviewing || itemActive ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                            borderLeft: isPreviewing ? '3px solid #D4AF37' : '3px solid transparent',
                          }}
                          onMouseEnter={() => setPreviewItem(item)}
                          onClick={() => handleNavClick(item.page)}
                        >
                          <div
                            className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-all duration-300"
                            style={{
                              backgroundColor: isPreviewing || itemActive ? 'rgba(212, 175, 55, 0.22)' : 'rgba(232, 213, 163, 0.08)',
                              color: isPreviewing || itemActive ? '#D4AF37' : '#FFFFFF',
                            }}
                          >
                            {item.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-sm font-medium flex items-center gap-2"
                              style={{
                                fontFamily: "'Poppins', sans-serif",
                                color: isPreviewing || itemActive ? '#D4AF37' : '#FFFFFF',
                              }}
                            >
                              {item.label}
                              {itemActive && (
                                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: 'rgba(212, 175, 55, 0.25)', color: '#D4AF37' }}>
                                  Current
                                </span>
                              )}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255, 255, 255, 0.6)' }}
                            >
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight
                            className="w-3.5 h-3.5 transition-opacity duration-200"
                            style={{ color: '#D4AF37', opacity: isPreviewing ? 1 : 0 }}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right column — image preview panel */}
                  <div className="w-[300px] shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0">
                      <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                          backgroundImage: `url(${activePreview.preview.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(180deg, rgba(28,28,28,0.35) 0%, rgba(28,28,28,0.85) 60%, rgba(28,28,28,0.95) 100%)',
                        }}
                      />
                      <div
                        className="absolute top-4 right-4 w-10 h-10"
                        style={{ borderTop: '1px solid rgba(212,175,55,0.5)', borderRight: '1px solid rgba(212,175,55,0.5)' }}
                      />
                      <div className="relative h-full flex flex-col justify-end p-6">
                        <p
                          className="text-[10px] uppercase tracking-[3px] font-semibold mb-2"
                          style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}
                        >
                          {activePreview.preview.eyebrow}
                        </p>
                        <h4
                          className="text-white text-lg font-bold leading-tight mb-4"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {activePreview.preview.headline}
                        </h4>
                        <button
                          onClick={() => handleNavClick(activePreview.page)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:gap-2.5 cursor-pointer group"
                          style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif", background: 'none', border: 'none' }}
                        >
                          {activePreview.preview.cta}
                          <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" style={{ color: '#D4AF37' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE MENU — Full-screen slide-in
          ═══════════════════════════════════════════════════════════ */}
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
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 shrink-0"
            style={{ height: '72px', borderBottom: '1px solid rgba(212, 175, 55, 0.15)' }}
          >
            <img
              src="/logo/default-monochrome-gold-white.svg"
              alt="Aura Living"
              style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
            />
            <button
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10"
              style={{ color: '#FFFFFF', border: '1px solid rgba(212, 175, 55, 0.2)' }}
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content — custom thin scrollbar styling for dark menu */}
          <div
            className="flex flex-col py-5 px-5 flex-1 overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212, 175, 55, 0.3) transparent' }}
          >
            <style>{`
              .mobile-menu-scroll::-webkit-scrollbar { width: 4px; }
              .mobile-menu-scroll::-webkit-scrollbar-track { background: transparent; }
              .mobile-menu-scroll::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 2px; }
            `}</style>

            {/* Main nav links — Shop submenu renders INLINE right below "Shop" */}
            <div className="space-y-1">
              <p
                className="text-[10px] uppercase tracking-[3px] font-medium px-3 mb-3"
                style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}
              >
                Menu
              </p>
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.page, link.label);
                return (
                  <React.Fragment key={link.label}>
                    <button
                      className="mobile-nav-item flex items-center justify-between py-3.5 text-left transition-colors duration-200 rounded-xl px-3 w-full"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.95)',
                        backgroundColor: isActive ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                      }}
                      onClick={() => {
                        if (link.hasMegaMenu) {
                          setMobileShopExpanded((prev) => !prev);
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

                    {/* Inline Shop submenu — appears right below "Shop" link
                        Uses CSS grid-template-rows trick (1fr ↔ 0fr) for smooth
                        height animation in BOTH directions. Always in the DOM
                        so transitions work on collapse too. */}
                    {link.hasMegaMenu && (
                      <div
                        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                        style={{
                          gridTemplateRows: mobileShopExpanded ? '1fr' : '0fr',
                          opacity: mobileShopExpanded ? 1 : 0,
                        }}
                      >
                        <div className="overflow-hidden">
                          <div className="pl-3 pr-1 py-1 flex flex-col gap-0.5">
                            <div
                              className="ml-3 mb-1 mt-1 h-px"
                              style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.25), transparent)' }}
                            />
                            {megaMenuItems.map((item) => {
                              const itemActive = isMegaItemActive(item.page);
                              return (
                                <button
                                  key={item.label}
                                  className="flex items-center gap-3 py-2.5 px-3 text-left rounded-xl transition-all duration-200 hover:bg-white/10"
                                  style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    color: itemActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.9)',
                                    backgroundColor: itemActive ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                                  }}
                                  onClick={() => handleNavClick(item.page)}
                                >
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
                                    style={{
                                      backgroundColor: itemActive ? 'rgba(212, 175, 55, 0.22)' : 'rgba(212, 175, 55, 0.12)',
                                      color: '#D4AF37',
                                    }}
                                  >
                                    {item.icon}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium flex items-center gap-2">
                                      {item.label}
                                      {itemActive && (
                                        <span
                                          className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm"
                                          style={{ backgroundColor: 'rgba(212, 175, 55, 0.25)', color: '#D4AF37' }}
                                        >
                                          Current
                                        </span>
                                      )}
                                    </p>
                                    <p
                                      className="text-[11px] truncate"
                                      style={{ color: 'rgba(255, 255, 255, 0.55)' }}
                                    >
                                      {item.description}
                                    </p>
                                  </div>
                                  <ChevronRight
                                    className="w-3.5 h-3.5 shrink-0"
                                    style={{ color: 'rgba(212, 175, 55, 0.5)' }}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Divider */}
            <div
              className="my-4 h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }}
            />

            {/* Quick actions */}
            <div className="space-y-1">
              <p
                className="text-[10px] uppercase tracking-[3px] font-medium px-3 mb-2"
                style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}
              >
                Quick Actions
              </p>
              {[
                { icon: <Search className="h-5 w-5" />, label: 'Search', page: 'shop' as PageType },
                { icon: <Heart className="h-5 w-5" />, label: 'Wishlist', page: 'wishlist' as PageType, count: wishlistCount },
                { icon: <ShoppingCart className="h-5 w-5" />, label: 'Cart', page: 'cart' as PageType, count: cartCount },
                { icon: <User className="h-5 w-5" />, label: 'Account', page: 'account' as PageType },
              ].map((item) => (
                <button
                  key={item.label}
                  className="mobile-quick-item flex items-center gap-3 py-3 px-3 text-left transition-colors duration-200 hover:bg-white/10 rounded-xl w-full"
                  style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: "'Poppins', sans-serif" }}
                  onClick={() => {
                    closeMobileMenu();
                    if (item.label === 'Cart') { setCartOpen(true); return; }
                    if (item.label === 'Search') { setSearchOpen(true); return; }
                    handleNavClick(item.page);
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center relative"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37' }}
                  >
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
            <div className="mt-auto pt-5">
              <div
                className="mobile-cta-card rounded-2xl p-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(232,213,163,0.12) 100%)',
                  border: '1px solid rgba(212,175,55,0.2)',
                }}
              >
                <p
                  className="text-[11px] uppercase tracking-[3px] font-semibold mb-1.5"
                  style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}
                >
                  New Collection 2026
                </p>
                <p
                  className="text-xs mb-4 leading-relaxed"
                  style={{ color: 'rgba(255, 255, 255, 0.75)', fontFamily: "'Poppins', sans-serif" }}
                >
                  Explore our latest arrivals and handcrafted luxury pieces
                </p>
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

      {/* ═══════════════════════════════════════════════════════════
          SEARCH MODAL — top sheet with live product results
          ═══════════════════════════════════════════════════════════ */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-black/30"
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
          />
          <div
            className="fixed top-0 left-0 right-0 z-[56] py-6 px-4 sm:px-6"
            style={{
              backgroundColor: 'rgba(44, 44, 44, 0.95)',
              borderBottom: '1px solid rgba(212,175,55,0.2)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
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
                  style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255, 255, 255, 0.95)' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      useStore.getState().setSearchQuery(searchQuery.trim());
                      setSearchOpen(false);
                      setSearchQuery('');
                      handleNavClick('shop');
                    }
                  }}
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {searchQuery.trim().length > 1 && (
                <div className="mt-4 max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {products
                    .filter((p) =>
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.category.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((p) => (
                      <button
                        key={p.id}
                        className="w-full flex items-center gap-3 py-3 px-2 text-left rounded-lg transition-colors hover:bg-white/10"
                        onClick={() => {
                          useStore.getState().setSelectedProduct(p);
                          setSearchOpen(false);
                          setSearchQuery('');
                          handleNavClick('product');
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-md overflow-hidden shrink-0"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
                        >
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255, 255, 255, 0.95)' }}
                          >
                            {p.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}
                          >
                            {formatPKR(p.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  {products.filter((p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <p
                      className="text-sm py-4 text-center"
                      style={{ fontFamily: "'Poppins', sans-serif", color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      No products found for &quot;{searchQuery}&quot;
                    </p>
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
