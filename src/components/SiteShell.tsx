'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { GoldDivider, CornerOrnament, FloatingOrb } from '@/components/SVGDecorations';
import { useLenis } from '@/hooks/useLenis';
import gsap from 'gsap';;
import { useStore } from '@/store/useStore';

/**
 * Client-side site shell — wraps every page with Navbar, Footer, CartDrawer,
 * BackToTop, Lenis smooth scroll, GSAP page transitions, and decorative orbs.
 *
 * Lives in the root layout so these elements appear on every route.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Pages that should NOT show Navbar/Footer/chrome (full-bleed demo pages)
  const isFullBleed = pathname === '/hero-demos' || pathname === '/home-new' || pathname === '/bento-demos';

  // Smooth scroll (desktop only — Lenis hook handles the mobile check)
  useLenis();

  // Mount flag — prevents hydration mismatch for client-only UI
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Scroll-to-top + GSAP fade-in on route change
  useEffect(() => {
    if (!mounted) return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', force3D: true }
      );
    }
  }, [pathname, mounted]);

  return (
    <>
      {!isFullBleed && (
        <>
          <FloatingOrb size={90} top="15%" left="3%" delay={0} />
          <FloatingOrb size={70} top="55%" left="88%" delay={1.0} />
          <FloatingOrb size={80} top="80%" left="8%" delay={2.0} />
        </>
      )}

      {!isFullBleed && <Navbar />}

      <main ref={contentRef} id="main-content" className="flex-1 w-full">
        {children}
      </main>

      {!isFullBleed && (
        <>
          <div className="flex justify-center py-8 px-4 sm:px-6 w-full">
            <div className="w-full max-w-xs sm:max-w-sm">
              <GoldDivider />
            </div>
          </div>

          <Footer />

          <CartDrawer />

          <BackToTop />

          {/* Decorative corner ornaments — only on home */}
          {pathname === '/' && (
            <div className="hidden md:block fixed inset-0 pointer-events-none z-[5]">
              <CornerOrnament position="top-left" size={80} />
              <CornerOrnament position="top-right" size={80} />
              <CornerOrnament position="bottom-left" size={80} />
              <CornerOrnament position="bottom-right" size={80} />
            </div>
          )}
        </>
      )}
    </>
  );
}

/** Back-to-top button — appears after scrolling 400px, hidden when cart open */
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
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[var(--color-gold)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-gold-hover)] transition-all duration-300 cursor-pointer"
      style={{
        opacity: shouldShow ? 1 : 0,
        transform: shouldShow ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: shouldShow ? 'auto' : 'none',
        visibility: shouldShow ? 'visible' : 'hidden' }}
      aria-label="Back to top"
      tabIndex={shouldShow ? 0 : -1}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
