'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore, pageTitles } from '@/store/useStore';
import { products } from '@/data/products';
import { gsap } from '@/hooks/useGsap';
import { useLenis } from '@/hooks/useLenis';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import TrendingCollection from '@/components/TrendingCollection';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterSection from '@/components/NewsletterSection';
import ShopView from '@/components/ShopView';
import ProductDetailView from '@/components/ProductDetailView';
import AboutView from '@/components/AboutView';
import ContactView from '@/components/ContactView';
import AuthView from '@/components/AuthView';
import CartView from '@/components/CartView';
import CheckoutView from '@/components/CheckoutView';
import WishlistView from '@/components/WishlistView';
import AccountView from '@/components/AccountView';
import FAQView from '@/components/FAQView';
import ShippingView from '@/components/ShippingView';
import ReturnsView from '@/components/ReturnsView';
import CareGuideView from '@/components/CareGuideView';
import NewArrivalsView from '@/components/NewArrivalsView';
import SaleView from '@/components/SaleView';
import LookbookView from '@/components/LookbookView';
import TermsView from '@/components/TermsView';
import PrivacyView from '@/components/PrivacyView';
import ForgotPasswordView from '@/components/ForgotPasswordView';
import TrackOrdersView from '@/components/TrackOrdersView';
import AddressesView from '@/components/AddressesView';
import SettingsView from '@/components/SettingsView';
import AdminDashboard from '@/components/AdminDashboard';
import CartDrawer from '@/components/CartDrawer';
import { GoldDivider, CornerOrnament, FloatingOrb, FloatingGoldDots } from '@/components/SVGDecorations';

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const cartOpen = useStore((s) => s.cartOpen);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldShow = visible && !cartOpen;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-lg hover:bg-[#C9A22E] transition-all duration-300 cursor-pointer"
      style={{
        opacity: shouldShow ? 1 : 0,
        transform: shouldShow ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: shouldShow ? 'auto' : 'none',
        visibility: shouldShow ? 'visible' : 'hidden',
      }}
      aria-label="Back to top"
      tabIndex={shouldShow ? 0 : -1}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

export default function Home() {
  const currentPage = useStore((s) => s.currentPage);
  const contentRef = useRef<HTMLDivElement>(null);
  // hydrated = false during SSR + first client render, true after mount.
  // This prevents the server from rendering home content into the HTML
  // (which the browser would display before React hydrates and corrects
  // to the hash-based page). SSR and first client render both render null
  // for <main>, so they match — no hydration error. After mount, the store
  // already has the correct page from the URL hash, so the right page
  // appears immediately.
  const [hydrated, setHydrated] = useState(false);

  useLenis();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Read URL hash and sync store to the correct page.
    // Validate the hash against the known PageType list — ignore invalid hashes
    // (e.g. #shop-section anchors, malformed input) instead of setting an
    // invalid currentPage that breaks renderPage() and document.title.
    const validPages: typeof currentPage[] = [
      'home', 'shop', 'product', 'cart', 'checkout', 'wishlist', 'account',
      'about', 'contact', 'login', 'signup', 'faq', 'shipping', 'returns',
      'care-guide', 'new-arrivals', 'sale', 'lookbook', 'terms', 'privacy',
      'forgot-password', 'track-orders', 'addresses', 'settings', 'admin',
    ];
    const hash = window.location.hash.replace('#', '');
    // Check if it's a product page with an ID (e.g. #product/pendant-lamp)
    if (hash.startsWith('product/') || hash === 'product') {
      const productId = hash.includes('/') ? hash.split('/')[1] : null;
      if (productId) {
        // Find the product by ID and set it in the store
        const product = products.find((p) => p.id === productId);
        if (product) {
          useStore.getState().setSelectedProduct(product);
          useStore.setState({ currentPage: 'product' });
        } else {
          // Product not found — go to shop
          useStore.setState({ currentPage: 'shop' });
          window.history.replaceState({ page: 'shop' }, '', '#shop');
        }
      } else if (hash === 'product' && !useStore.getState().selectedProduct) {
        // #product with no ID and no selected product — go to shop
        useStore.setState({ currentPage: 'shop' });
        window.history.replaceState({ page: 'shop' }, '', '#shop');
      } else {
        useStore.setState({ currentPage: 'product' as typeof currentPage });
      }
    } else if (hash && hash !== 'home' && hash !== currentPage && validPages.includes(hash as typeof currentPage)) {
      useStore.setState({ currentPage: hash as typeof currentPage });
    }

    // Seed history so back button works from the first navigation
    if (!window.history.state) {
      const current = useStore.getState().currentPage;
      window.history.replaceState({ page: current }, '', `#${current}`);
    }

    // Listen for back/forward — validate the page from history state
    const handlePopState = (event: PopStateEvent) => {
      const candidate = (event.state?.page as typeof currentPage) || 'home';
      const page = validPages.includes(candidate) ? candidate : 'home';
      // If going back to product page, check if we need to restore the product
      if (page === 'product') {
        const hash = window.location.hash.replace('#', '');
        const productId = hash.includes('/') ? hash.split('/')[1] : null;
        if (productId) {
          const product = products.find((p) => p.id === productId);
          if (product) {
            useStore.getState().setSelectedProduct(product);
          }
        }
      }
      useStore.setState({ currentPage: page });
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', handlePopState);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document title per SPA page
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = pageTitles[currentPage] || 'Aura Living';
    }
  }, [currentPage]);

  // GSAP page transition — skip on initial render
  useEffect(() => {
    if (!hydrated) return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', force3D: true }
      );
    }
  }, [currentPage, hydrated]);

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <ShopView />;
      case 'product':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'wishlist':
        return <WishlistView />;
      case 'account':
        return <AccountView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'faq':
        return <FAQView />;
      case 'shipping':
        return <ShippingView />;
      case 'returns':
        return <ReturnsView />;
      case 'care-guide':
        return <CareGuideView />;
      case 'new-arrivals':
        return <NewArrivalsView />;
      case 'sale':
        return <SaleView />;
      case 'lookbook':
        return <LookbookView />;
      case 'terms':
        return <TermsView />;
      case 'privacy':
        return <PrivacyView />;
      case 'forgot-password':
        return <ForgotPasswordView />;
      case 'track-orders':
        return <TrackOrdersView />;
      case 'addresses':
        return <AddressesView />;
      case 'settings':
        return <SettingsView />;
      case 'admin':
        return <AdminDashboard />;
      case 'login':
      case 'signup':
        return <AuthView />;
      case 'home':
      default:
        return (
          <>
            <HeroSection />
            <FloatingGoldDots />
            <CategoriesSection />
            <FloatingGoldDots />
            <FeaturedProducts />
            <FloatingGoldDots />
            <TrendingCollection />
            <FloatingGoldDots />
            <TestimonialsSection />
            <FloatingGoldDots />
            <NewsletterSection />
          </>
        );
    }
  };

  // Loading state — render ONLY a blank cream background. No Navbar, no Footer,
  // no orbs, no ornaments. This prevents the user from seeing home-page chrome
  // (active Home link, corner ornaments) flash before the correct page loads.
  if (!hydrated) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: '#FAF8F5' }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] relative grain-overlay w-full overflow-x-hidden">
      <FloatingOrb size={90} top="15%" left="3%" delay={0} />
      <FloatingOrb size={70} top="55%" left="88%" delay={1.0} />
      <FloatingOrb size={80} top="80%" left="8%" delay={2.0} />
      <Navbar />
      <main ref={contentRef} id="main-content" className="flex-1 w-full">
        {renderPage()}
      </main>
      <div className="flex justify-center py-8 px-4 sm:px-6 w-full">
        <div className="w-full max-w-xs sm:max-w-sm">
          <GoldDivider />
        </div>
      </div>
      <Footer />
      <CartDrawer />
      <BackToTop />
      {currentPage === 'home' && (
        <div className="hidden md:block fixed inset-0 pointer-events-none z-[5]">
          <CornerOrnament position="top-left" size={80} />
          <CornerOrnament position="top-right" size={80} />
          <CornerOrnament position="bottom-left" size={80} />
          <CornerOrnament position="bottom-right" size={80} />
        </div>
      )}
    </div>
  );
}
