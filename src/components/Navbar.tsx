'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
    if (mobileMenuOpen) {
      // Backdrop fade in
      if (mobileBackdropRef.current) {
        gsap.fromTo(mobileBackdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      }
      // Menu slide in from right
      if (mobileMenuRef.current) {
        gsap.fromTo(mobileMenuRef.current,
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 0.1, force3D: true }
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
    const onComplete = () => { setMobileMenuOpen(false); setMobileShopExpanded(false); };
    if (mobileBackdropRef.current) {
      gsap.to(mobileBackdropRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        opacity: 0, x: 60, duration: 0.3, ease: 'power3.in', force3D: true,
        onComplete,
      });
    } else {
      onComplete();
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
          background: 'rgba(250, 248, 245, 0.97)',
          borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(232, 213, 163, 0.4)',
          boxShadow: scrolled ? '0 1px 0 0 rgba(212, 175, 55, 0.1), 0 4px 20px rgba(0,0,0,0.04)' : '0 1px 0 0 rgba(232, 213, 163, 0.3)',
        }}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 lg:h-28 items-center justify-between">
            {/* Logo — Gold + Black gradient, same across all screens */}
            <div
              ref={logoRef}
              className="cursor-pointer shrink-0 py-1 sm:py-2 outline-none"
              onClick={() => handleNavClick('home')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleNavClick('home'); } }}
              role="button"
              tabIndex={0}
              aria-label="Aura Living home"
            >
              <img src="/logo/default-monochrome-gold-black.svg" alt="Aura Living" style={{ height: 'clamp(40px, 9vw, 64px)', width: 'auto', objectFit: 'contain' }} />
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.page, link.label);
                const isHovered = hoveredLink === link.label;
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => {
                      setHoveredLink(link.label);
                      if (link.hasMegaMenu) handleMegaMenuEnter();
                    }}
                    onMouseLeave={() => {
                      setHoveredLink(null);
                      if (link.hasMegaMenu) handleMegaMenuLeave();
                    }}
                  >
                    <button
                      className="relative py-2 text-sm font-medium transition-all duration-300 flex items-center gap-1"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: isActive ? '#D4AF37' : '#5A5A5A',
                      }}
                      onClick={() => {
                        if (link.hasMegaMenu) {
                          handleNavClick(link.page);
                        } else {
                          handleNavClick(link.page);
                        }
                      }}
                    >
                      {link.label}
                      {link.hasMegaMenu && (
                        <ChevronDown
                          className="h-3.5 w-3.5 transition-transform duration-300"
                          style={{
                            transform: megaMenuOpen && hoveredLink === link.label ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      )}
                      <span
                        className="absolute bottom-0 left-0 h-[2px] rounded-full bg-[#D4AF37] transition-all duration-300"
                        style={{ width: isActive || isHovered ? '100%' : '0%' }}
                      />
                    </button>

                    {/* Desktop Mega Menu */}
                    {link.hasMegaMenu && megaMenuOpen && hoveredLink === link.label && (
                      <div
                        ref={megaMenuRef}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                        style={{ zIndex: 60 }}
                        onMouseEnter={handleMegaMenuEnter}
                        onMouseLeave={handleMegaMenuLeave}
                      >
                        <div
                          className="rounded-lg overflow-hidden"
                          style={{
                            background: 'rgba(250, 248, 245, 0.98)',
                            borderTop: '2px solid #D4AF37',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
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
                                    backgroundColor: itemActive ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = itemActive ? 'rgba(212, 175, 55, 0.08)' : 'transparent';
                                  }}
                                  onClick={() => handleNavClick(item.page)}
                                >
                                  <div
                                    className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-colors duration-200"
                                    style={{
                                      backgroundColor: itemActive ? 'rgba(212, 175, 55, 0.15)' : 'rgba(232, 213, 163, 0.2)',
                                      color: itemActive ? '#D4AF37' : '#8A8A8A',
                                    }}
                                  >
                                    {item.icon}
                                  </div>
                                  <div className="min-w-0">
                                    <p
                                      className="text-sm font-medium transition-colors duration-200"
                                      style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: itemActive ? '#D4AF37' : '#2C2C2C',
                                      }}
                                    >
                                      {item.label}
                                    </p>
                                    <p
                                      className="text-xs mt-0.5"
                                      style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: '#8A8A8A',
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
                );
              })}
            </div>

            {/* Desktop Action Icons */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="p-2.5 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]" style={{ color: '#5A5A5A' }} aria-label="Search" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </button>
              <button className="relative p-2.5 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]" style={{ color: '#5A5A5A' }} aria-label="Wishlist" onClick={() => handleNavClick('wishlist')}>
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] font-bold text-white px-1 bg-[#D4AF37]">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button className="relative p-2.5 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]" style={{ color: '#5A5A5A' }} aria-label="Cart" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] font-bold text-white px-1 bg-[#D4AF37]">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="p-2.5 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]" style={{ color: '#5A5A5A' }} aria-label="Account" onClick={() => handleNavClick('account')}>
                <User className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div className="flex lg:hidden items-center gap-1">
              <button className="relative p-2.5 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]" style={{ color: '#5A5A5A' }} aria-label="Cart" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] font-bold text-white px-1 bg-[#D4AF37]">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="p-2.5 rounded-full transition-colors duration-200 hover:bg-[#F5EDDA]" style={{ color: '#5A5A5A' }} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileMenuOpen((prev) => !prev)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — Elegant Slide-In from Right */}
      {mobileMenuOpen && (
        <>
          <div ref={mobileBackdropRef} className="fixed inset-0 z-[51] bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} aria-hidden="true" />
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 bottom-0 z-[52] flex flex-col w-full sm:w-[420px] sm:max-w-[92vw]"
            style={{ backgroundColor: 'rgba(250, 248, 245, 0.97)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(212, 175, 55, 0.15)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); closeMobileMenu(); } }}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 shrink-0" style={{ height: '72px', borderBottom: '1px solid rgba(212, 175, 55, 0.12)' }}>
              <img src="/logo/default-monochrome-gold-black.svg" alt="Aura Living" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
              <button className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#F5EDDA]" style={{ color: '#5A5A5A', border: '1px solid rgba(212,175,55,0.15)' }} onClick={closeMobileMenu} aria-label="Close menu">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex flex-col py-5 px-5 flex-1 overflow-y-auto">
              {/* Main Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.page, link.label);

                  if (link.hasMegaMenu) {
                    return (
                      <div key={link.label} className="mobile-nav-item">
                        <button
                          className="flex items-center justify-between py-3 text-left w-full transition-colors duration-200 rounded-xl px-3 hover:bg-[#F5EDDA]/60"
                          style={{ fontFamily: "'Poppins', sans-serif", color: isActive ? '#D4AF37' : '#2C2C2C' }}
                          onClick={() => setMobileShopExpanded((prev) => !prev)}
                          aria-expanded={mobileShopExpanded}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: isActive ? 'rgba(212,175,55,0.12)' : 'rgba(232,213,163,0.15)' }}>
                              <ShoppingBag className="h-4 w-4" style={{ color: isActive ? '#D4AF37' : '#8A8A8A' }} />
                            </div>
                            <span className="text-[15px] font-medium">{link.label}</span>
                          </div>
                          <ChevronDown
                            className="h-4 w-4 transition-transform duration-300"
                            style={{
                              color: isActive ? '#D4AF37' : '#8A8A8A',
                              transform: mobileShopExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        </button>
                        <div
                          ref={mobileShopContentRef}
                          className="overflow-hidden"
                          style={{ height: mobileShopExpanded ? 'auto' : 0, opacity: mobileShopExpanded ? 1 : 0 }}
                        >
                          <div className="pb-2 pl-6 flex flex-col gap-0.5">
                            {megaMenuItems.map((item) => {
                              const itemActive = isMegaItemActive(item.page);
                              return (
                                <button
                                  key={item.label}
                                  className="flex items-center gap-3 py-2.5 px-3 text-left rounded-xl transition-all duration-200 hover:bg-[#F5EDDA]/60"
                                  style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    color: itemActive ? '#D4AF37' : '#5A5A5A',
                                    backgroundColor: itemActive ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                                  }}
                                  onClick={() => handleNavClick(item.page)}
                                >
                                  <div
                                    className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors duration-200"
                                    style={{
                                      backgroundColor: itemActive ? 'rgba(212, 175, 55, 0.15)' : 'rgba(232, 213, 163, 0.15)',
                                      color: itemActive ? '#D4AF37' : '#8A8A8A',
                                    }}
                                  >
                                    {item.icon}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium">{item.label}</p>
                                    <p className="text-[11px] mt-0.5" style={{ color: '#8A8A8A' }}>{item.description}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={link.label}
                      className="mobile-nav-item flex items-center justify-between py-3 text-left transition-colors duration-200 rounded-xl px-3 hover:bg-[#F5EDDA]/60 w-full"
                      style={{ fontFamily: "'Poppins', sans-serif", color: isActive ? '#D4AF37' : '#2C2C2C' }}
                      onClick={() => handleNavClick(link.page)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: isActive ? 'rgba(212,175,55,0.12)' : 'rgba(232,213,163,0.15)' }}>
                          {link.label === 'Home' && <svg className="h-4 w-4" style={{ color: isActive ? '#D4AF37' : '#8A8A8A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>}
                          {link.label === 'About' && <svg className="h-4 w-4" style={{ color: isActive ? '#D4AF37' : '#8A8A8A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          {link.label === 'Contact' && <svg className="h-4 w-4" style={{ color: isActive ? '#D4AF37' : '#8A8A8A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        </div>
                        <span className="text-[15px] font-medium">{link.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" style={{ color: '#D4AF37', opacity: 0.5 }} />
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="my-5 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />

              {/* Quick Actions */}
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase tracking-[3px] font-medium px-3 mb-2.5" style={{ color: '#8A8A8A', fontFamily: "'Poppins', sans-serif" }}>Quick Actions</p>
                {[
                  { icon: <Search className="h-4 w-4" />, label: 'Search', page: 'shop' as PageType },
                  { icon: <Heart className="h-4 w-4" />, label: 'Wishlist', page: 'wishlist' as PageType, count: wishlistCount },
                  { icon: <ShoppingCart className="h-4 w-4" />, label: 'Cart', page: 'cart' as PageType, count: cartCount },
                  { icon: <User className="h-4 w-4" />, label: 'Account', page: 'account' as PageType },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="mobile-quick-item flex items-center gap-3 py-2.5 text-left transition-colors duration-200 hover:bg-[#F5EDDA]/60 rounded-xl px-3 w-full"
                    style={{ color: '#5A5A5A', fontFamily: "'Poppins', sans-serif" }}
                    onClick={() => { closeMobileMenu(); if (item.label === 'Cart') setCartOpen(true); if (item.label === 'Wishlist') handleNavClick('wishlist'); if (item.label === 'Search') { setSearchOpen(true); } if (item.label === 'Account') handleNavClick('account'); }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center relative" style={{ backgroundColor: 'rgba(232,213,163,0.15)' }}>
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
                <div className="mobile-cta-card rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(232,213,163,0.12) 100%)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p className="text-[11px] uppercase tracking-[3px] font-semibold mb-1.5" style={{ color: '#D4AF37', fontFamily: "'Poppins', sans-serif" }}>New Collection 2026</p>
                  <p className="text-xs mb-4 leading-relaxed" style={{ color: '#5A5A5A', fontFamily: "'Poppins', sans-serif" }}>Explore our latest arrivals and handcrafted luxury pieces</p>
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
        </>
      )}

      <div className="h-16 sm:h-20 lg:h-28" />

      {/* Search Modal */}
      {searchOpen && (
        <>
          <div className="fixed inset-0 z-[55] bg-black/30" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
          <div
            className="fixed top-0 left-0 right-0 z-[56] py-6 px-4 sm:px-6"
            style={{ backgroundColor: 'rgba(250, 248, 245, 0.98)', borderBottom: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
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
                  style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      useStore.getState().setSearchQuery(searchQuery.trim());
                      setSearchOpen(false); setSearchQuery('');
                      handleNavClick('shop');
                    }
                  }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-2 rounded-full hover:bg-[#F5EDDA] transition-colors" style={{ color: '#5A5A5A' }} aria-label="Close search">
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
                        className="w-full flex items-center gap-3 py-3 px-2 text-left rounded-lg transition-colors hover:bg-[#F5EDDA]"
                        onClick={() => {
                          useStore.getState().setSelectedProduct(p);
                          setSearchOpen(false); setSearchQuery('');
                          handleNavClick('product');
                        }}
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: '#FFFDF7', border: '1px solid #E8D5A3' }}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ fontFamily: "'Poppins', sans-serif", color: '#2C2C2C' }}>{p.name}</p>
                          <p className="text-xs" style={{ fontFamily: "'Poppins', sans-serif", color: '#D4AF37' }}>{formatPKR(p.price)}</p>
                        </div>
                      </button>
                    ))}
                  {products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="text-sm py-4 text-center" style={{ fontFamily: "'Poppins', sans-serif", color: '#8A8A8A' }}>No products found for &quot;{searchQuery}&quot;</p>
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
