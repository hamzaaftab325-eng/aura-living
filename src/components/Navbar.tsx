'use client';

/**
 * Navbar — thin shell that orchestrates all nav sub-components.
 *
 * STATE owned here (preserved from original — zero functionality change):
 * - mobileMenuOpen, mobileShopExpanded — mobile menu state
 * - searchOpen, searchQuery, searchResults, searchLoading — search modal state
 * - megaMenuOpen, previewItem — mega menu state
 * - cursorPos, hoveredLink — animated cursor pill state
 * - scrolled — scroll-shrink state
 * - hydrated — SSR-safe cart/wishlist counts
 *
 * REFS owned here:
 * - navItemRefs (Map of link label → <li> element, used for cursor positioning)
 * - searchInputRef (passed to SearchModal)
 * - mobileMenuRef (passed to MobileMenu)
 * - megaMenuRef (passed to MegaMenu)
 *
 * EFFECTS owned here (all preserved from original):
 * - Scroll detection → setScrolled
 * - Body scroll lock when mobileMenuOpen
 * - Debounced search → /api/products/search
 * - Mega menu click-outside + Escape close
 *
 * Renders: <NavLogo>, <NavLinks>, <NavActions>, <MegaMenu>,
 * <MobileMenu>, <SearchModal>.
 *
 * All styling via CSS classes (.aura-nav-shell, .aura-nav-pill, etc.).
 * Zero inline styles.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { formatRupees as formatPKR } from '@/lib/currency-display';
import {
  NavLogo,
  NavLinks,
  NavActions,
  MegaMenu,
  MobileMenu,
  SearchModal,
  type MegaMenuItem,
} from '@/components/nav';

// ── Static data ──

interface NavLink {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop', hasMegaMenu: true },
  { label: 'Journal', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const megaMenuItems: MegaMenuItem[] = [
  {
    label: 'All Products',
    href: '/shop',
    icon: (
      <svg className="aura-nav-mega-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
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
    href: '/new-arrivals',
    icon: (
      <svg className="aura-nav-mega-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      </svg>
    ),
    description: 'The latest additions to our store',
    preview: {
      image: '/images/pages/new-arrivals-hero.webp',
      eyebrow: 'Fresh Off the Workbench',
      headline: 'New Pieces, Just Landed This Week',
      cta: "Discover What's New",
    },
  },
  {
    label: 'Sale',
    href: '/sale',
    icon: (
      <svg className="aura-nav-mega-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
        <circle cx="7.5" cy="7.5" r="0.5" fill="currentColor" />
      </svg>
    ),
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
    href: '/lookbook',
    icon: (
      <svg className="aura-nav-mega-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
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
    href: '/care-guide',
    icon: (
      <svg className="aura-nav-mega-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
      </svg>
    ),
    description: 'Tips to preserve your luxury pieces',
    preview: {
      image: '/images/pages/care-guide-hero.webp',
      eyebrow: 'Preserve the Beauty',
      headline: 'How to Care for Your Aura Pieces for Years',
      cta: 'Read the Guide',
    },
  },
];

// Routes that belong to the Shop mega-menu family (highlight "Shop" when on any of these)
const shopFamilyRoutes = ['/shop', '/new-arrivals', '/sale', '/lookbook', '/care-guide'];

// Routes that belong to the Journal family
const journalFamilyRoutes = ['/blog'];

// ── Main component ──

export default function Navbar() {
  // ── UI state ──
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; name: string; slug: string; price: number; image: string }>
  >([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MegaMenuItem | null>(null);
  const [cursorPos, setCursorPos] = useState({ left: 0, width: 0, opacity: 0 });
  const [scrolled, setScrolled] = useState(false);

  // ── Refs ──
  const navItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Store + router ──
  const { getCartCount, cartOpen, setCartOpen, wishlist } = useStore();
  const pathname = usePathname();
  const router = useRouter();

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
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Debounced search — fetches from /api/products/search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.ok) {
          setSearchResults(data.results);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close mega menu on click outside OR Escape key
  useEffect(() => {
    if (!megaMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Don't close if click is inside the mega menu panel
      const megaPanel = document.querySelector('.aura-nav-mega');
      if (megaPanel?.contains(target)) return;
      // Also check if click is on the Shop link itself
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
  const closeMenusAndScroll = useCallback(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setMobileShopExpanded(false);
    setPreviewItem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileShopExpanded(false);
  }, []);

  const toggleMegaMenu = useCallback(() => {
    setMegaMenuOpen((prev) => {
      const next = !prev;
      if (!next) setPreviewItem(null);
      return next;
    });
  }, []);

  const handleLinkHover = useCallback(
    (label: string, el: HTMLLIElement | null) => {
      if (el) {
        setCursorPos({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
      }
    },
    []
  );

  const handleListMouseLeave = useCallback(() => {
    setCursorPos((pv) => ({ ...pv, opacity: 0 }));
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  const handleSearchResultClick = useCallback(
    (slug: string) => {
      setSearchOpen(false);
      setSearchQuery('');
      router.push(`/product/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [router]
  );

  const handleSearchEnter = useCallback(
    (q: string) => {
      setSearchOpen(false);
      setSearchQuery('');
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [router]
  );

  // ── Helpers ──
  const isLinkActive = (href: string, label: string) => {
    if (label === 'Shop') return shopFamilyRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));
    if (label === 'Journal') return journalFamilyRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));
    return pathname === href;
  };

  const isMegaItemActive = (href: string) => pathname === href;

  const activePreview = previewItem ?? megaMenuItems[0];

  // ── Render ──
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          DESKTOP NAV — Pill container with logo + links + actions
          ═══════════════════════════════════════════════════════════ */}
      <nav className="aura-nav-shell">
        <div className={`aura-nav-pill-wrap ${scrolled ? 'aura-nav-pill-wrap--scrolled' : ''}`}>
          <div
            className={`aura-nav-pill ${scrolled ? 'aura-nav-pill--scrolled' : ''}`}
          >
            <NavLogo scrolled={scrolled} onClick={closeMenusAndScroll} />

            <NavLinks
              links={navLinks}
              scrolled={scrolled}
              megaMenuOpen={megaMenuOpen}
              cursorPos={cursorPos}
              isLinkActive={isLinkActive}
              onLinkHover={handleLinkHover}
              onListMouseLeave={handleListMouseLeave}
              onLinkClick={closeMenusAndScroll}
              onMegaToggle={toggleMegaMenu}
              registerRef={(label, el) => {
                if (el) navItemRefs.current.set(label, el);
              }}
            />

            <NavActions
              scrolled={scrolled}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              mobileMenuOpen={mobileMenuOpen}
              onSearchClick={() => setSearchOpen(true)}
              onCartClick={() => setCartOpen(true)}
              onLinkClick={closeMenusAndScroll}
              onMobileToggle={() => setMobileMenuOpen((prev) => !prev)}
            />

            {/* Mega menu — rendered inside the pill so it can absolutely position from it */}
            {megaMenuOpen && (
              <MegaMenu
                items={megaMenuItems}
                activePreview={activePreview}
                isMegaItemActive={isMegaItemActive}
                onItemHover={setPreviewItem}
                onLinkClick={closeMenusAndScroll}
              />
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE MENU — Full-screen slide-in
          ═══════════════════════════════════════════════════════════ */}
      <MobileMenu
        open={mobileMenuOpen}
        navLinks={navLinks}
        megaMenuItems={megaMenuItems}
        mobileShopExpanded={mobileShopExpanded}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLinkActive={isLinkActive}
        isMegaItemActive={isMegaItemActive}
        onMobileShopToggle={() => setMobileShopExpanded((prev) => !prev)}
        onClose={closeMobileMenu}
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={() => setCartOpen(true)}
      />

      {/* ═══════════════════════════════════════════════════════════
          SEARCH MODAL — top sheet with live product results
          ═══════════════════════════════════════════════════════════ */}
      <SearchModal
        open={searchOpen}
        query={searchQuery}
        results={searchResults}
        loading={searchLoading}
        inputRef={searchInputRef}
        onQueryChange={setSearchQuery}
        onClose={handleSearchClose}
        onResultClick={handleSearchResultClick}
        onEnterSubmit={handleSearchEnter}
        formatPrice={formatPKR}
      />
    </>
  );
}
