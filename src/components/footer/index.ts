/**
 * Footer sub-components — exported for the Footer shell to compose.
 *
 * Structure:
 * - FooterBrand       — logo + tagline + socials (column 1)
 * - FooterLinks       — heading + link list (reusable; used for cols 2 & 3)
 * - FooterNewsletter  — signup card with email input (column 4)
 * - FooterBottom      — copyright + legal links + payment methods
 * - FooterPrimitives  — FooterLink, SocialIcon, PinterestIcon (shared)
 */

export { default as FooterBrand } from './FooterBrand';
export { default as FooterLinks } from './FooterLinks';
export { default as FooterNewsletter } from './FooterNewsletter';
export { default as FooterBottom } from './FooterBottom';
export { FooterLink, SocialIcon, PinterestIcon } from './FooterPrimitives';
