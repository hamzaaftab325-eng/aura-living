/**
 * Nav sub-components — exported for the Navbar shell to compose.
 *
 * Structure:
 * - NavLogo      — logo with GSAP entrance animation
 * - NavLinks     — desktop nav links + animated cursor pill
 * - NavActions   — search/wishlist/cart/account/mobile-toggle buttons
 * - MegaMenu     — desktop dropdown panel (categories + image preview)
 * - MobileMenu   — full-screen slide-in mobile navigation
 * - SearchModal  — top sheet with live product search results
 */

export { default as NavLogo } from './NavLogo';
export { default as NavLinks } from './NavLinks';
export { default as NavActions } from './NavActions';
export { default as MegaMenu } from './MegaMenu';
export { default as MobileMenu } from './MobileMenu';
export { default as SearchModal } from './SearchModal';
export type { MegaMenuItem } from './MegaMenu';
