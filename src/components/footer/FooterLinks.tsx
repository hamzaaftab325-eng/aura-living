'use client';

/**
 * FooterLinks — a single link column in the footer.
 *
 * Renders a heading (with decorative gold underline) + a list of links.
 * Used twice: once for Quick Links, once for Customer Service.
 *
 * All styling via CSS classes (.aura-footer-col, .aura-footer-col-h,
 * .aura-footer-col-underline, .aura-footer-links). Zero inline styles.
 */

import { FooterLink } from './FooterPrimitives';

interface FooterLinksProps {
  heading: string;
  links: Array<{ label: string; href: string }>;
}

export default function FooterLinks({ heading, links }: FooterLinksProps) {
  return (
    <div className="aura-footer-col">
      <h3 className="aura-footer-col-h">
        {heading}
        <span className="aura-footer-col-underline" />
      </h3>
      <ul className="aura-footer-links">
        {links.map(({ label, href }) => (
          <li key={label}>
            <FooterLink href={href}>{label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
