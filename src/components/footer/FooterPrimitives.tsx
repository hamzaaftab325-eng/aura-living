'use client';

/**
 * PinterestIcon — custom SVG (kept as a sub-component for reuse).
 */
import Link from 'next/link';

export function PinterestIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

/**
 * FooterLink — CSS hover with gold glow + translateX + underline.
 * Renders a Next.js <Link> when href is provided, otherwise a <button>.
 *
 * All styling via CSS classes (.aura-footer-link, .aura-footer-link-underline,
 * .aura-footer-link-text). Zero inline styles.
 */
export function FooterLink({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="aura-footer-link-underline" />
      <span className="aura-footer-link-text">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="aura-footer-link">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="aura-footer-link aura-footer-link--btn">
      {inner}
    </button>
  );
}

/**
 * SocialIcon — gold icon in a bordered circle, with hover scale + rotate + glow.
 *
 * All styling via CSS classes (.aura-footer-social). Zero inline styles.
 */
export function SocialIcon({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="aura-footer-social"
    >
      <Icon size={18} className="aura-footer-social-icon" />
    </a>
  );
}
