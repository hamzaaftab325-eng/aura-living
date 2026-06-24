'use client';

/**
 * NavLogo — the Aura Living logo in the navbar.
 *
 * Renders the SVG logo with a GSAP entrance animation (scale + fade in).
 * Height shrinks when `scrolled` is true (driven by parent state).
 *
 * All styling via CSS classes (.aura-nav-logo, .aura-nav-logo-img,
 * .aura-nav-logo-img--scrolled). Zero inline styles.
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

interface NavLogoProps {
  scrolled: boolean;
  onClick: () => void;
}

export default function NavLogo({ scrolled, onClick }: NavLogoProps) {
  const logoRef = useRef<HTMLSpanElement>(null);

  // Logo entrance animation — runs once on mount
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <Link
      href="/"
      aria-label="Aura Living home"
      className="aura-nav-logo"
      onClick={onClick}
    >
      <span ref={logoRef} className="aura-nav-logo-inner">
        <img
          src="/logo/default-monochrome-gold-white.svg"
          alt="Aura Living"
          className={`aura-nav-logo-img ${scrolled ? 'aura-nav-logo-img--scrolled' : ''}`}
        />
      </span>
    </Link>
  );
}
