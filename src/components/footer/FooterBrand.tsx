'use client';

/**
 * FooterBrand — Column 1 of the footer.
 *
 * Renders the logo, tagline, and social icons.
 *
 * All styling via CSS classes (.aura-footer-brand, .aura-footer-logo,
 * .aura-footer-tagline, .aura-footer-socials). Zero inline styles.
 */

import { SocialIcon } from './FooterPrimitives';

interface FooterBrandProps {
  socialLinks: Array<{
    icon: React.ComponentType<{ size?: number; className?: string }>;
    href: string;
    label: string;
  }>;
}

export default function FooterBrand({ socialLinks }: FooterBrandProps) {
  return (
    <div className="aura-footer-brand">
      <div className="aura-footer-logo-wrap">
        <img
          src="/logo/default-monochrome-gold-white.svg"
          alt="Aura Living"
          className="aura-footer-logo"
        />
      </div>
      <p className="aura-footer-tagline">Where Comfort Meets Style</p>
      <div className="aura-footer-socials">
        {socialLinks.map(({ icon, href, label }) => (
          <SocialIcon key={label} icon={icon} href={href} label={label} />
        ))}
      </div>
    </div>
  );
}
