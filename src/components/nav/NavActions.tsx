'use client';

/**
 * NavActions — right-side action icons in the navbar pill.
 *
 * Renders Search, Wishlist, Cart, Account, and mobile-menu-toggle buttons.
 * Wishlist + Cart show count badges when populated.
 *
 * All styling via CSS classes (.aura-nav-actions, .aura-nav-icon-btn,
 * .aura-nav-badge, etc.). Zero inline styles.
 */

import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';

interface NavActionsProps {
  scrolled: boolean;
  cartCount: number;
  wishlistCount: number;
  mobileMenuOpen: boolean;
  onSearchClick: () => void;
  onCartClick: () => void;
  onLinkClick: () => void;
  onMobileToggle: () => void;
}

export default function NavActions({
  scrolled,
  cartCount,
  wishlistCount,
  mobileMenuOpen,
  onSearchClick,
  onCartClick,
  onLinkClick,
  onMobileToggle,
}: NavActionsProps) {
  const sizeClass = scrolled ? 'aura-nav-icon-btn--scrolled' : 'aura-nav-icon-btn--default';

  return (
    <div className="aura-nav-actions">
      <button
        className={`aura-nav-icon-btn ${sizeClass}`}
        aria-label="Search"
        onClick={onSearchClick}
      >
        <Search className="aura-nav-icon" />
      </button>

      <Link
        href="/wishlist"
        className={`aura-nav-icon-btn aura-nav-icon-btn--hide-mobile ${sizeClass}`}
        aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
        onClick={onLinkClick}
      >
        <Heart className="aura-nav-icon" />
        {wishlistCount > 0 && (
          <span className="aura-nav-badge" aria-hidden="true">
            {wishlistCount}
          </span>
        )}
      </Link>

      <button
        className={`aura-nav-icon-btn ${sizeClass}`}
        aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
        onClick={onCartClick}
      >
        <ShoppingCart className="aura-nav-icon" />
        {cartCount > 0 && (
          <span className="aura-nav-badge" aria-hidden="true">
            {cartCount}
          </span>
        )}
      </button>

      {/* Live region for screen readers */}
      <span className="aura-sr-only" aria-live="polite" aria-atomic="true">
        {cartCount === 0
          ? 'Cart is empty'
          : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in cart`}
      </span>

      <Link
        href="/account"
        className={`aura-nav-icon-btn aura-nav-icon-btn--hide-mobile ${sizeClass}`}
        aria-label="Account"
        onClick={onLinkClick}
      >
        <User className="aura-nav-icon" />
      </Link>

      <button
        className={`aura-nav-icon-btn aura-nav-icon-btn--mobile-only ${sizeClass}`}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        onClick={onMobileToggle}
      >
        {mobileMenuOpen ? <X className="aura-nav-icon aura-nav-icon--lg" /> : <Menu className="aura-nav-icon aura-nav-icon--lg" />}
      </button>
    </div>
  );
}
