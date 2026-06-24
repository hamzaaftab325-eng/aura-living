'use client';

/**
 * NavLinks — desktop navigation links with animated cursor pill.
 *
 * Renders the 5 nav links (Home, Shop, Journal, About, Contact) inside
 * a <ul>. The "Shop" link toggles the mega menu on click (doesn't navigate).
 * A cursor pill animates to follow the hovered link (CSS transition).
 *
 * All styling via CSS classes (.aura-nav-links, .aura-nav-link, .aura-nav-cursor,
 * etc.). Zero inline styles — the cursor position is set via CSS custom
 * properties (--cursor-x, --cursor-w) on the <ul>.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

interface NavLinksProps {
  links: NavLink[];
  scrolled: boolean;
  megaMenuOpen: boolean;
  cursorPos: { left: number; width: number; opacity: number };
  isLinkActive: (href: string, label: string) => boolean;
  onLinkHover: (label: string, el: HTMLLIElement | null) => void;
  onListMouseLeave: () => void;
  onLinkClick: () => void;
  onMegaToggle: () => void;
  registerRef: (label: string, el: HTMLLIElement | null) => void;
}

export default function NavLinks({
  links,
  scrolled,
  megaMenuOpen,
  cursorPos,
  isLinkActive,
  onLinkHover,
  onListMouseLeave,
  onLinkClick,
  onMegaToggle,
  registerRef,
}: NavLinksProps) {
  const listRef = useRef<HTMLUListElement>(null);

  return (
    <div className="aura-nav-links-wrap">
      <ul
        ref={listRef}
        className="aura-nav-links"
        onMouseLeave={onListMouseLeave}
        style={
          {
            '--aura-nav-cursor-x': `${cursorPos.left}px`,
            '--aura-nav-cursor-w': `${cursorPos.width}px`,
            '--aura-nav-cursor-opacity': cursorPos.opacity,
          } as React.CSSProperties
        }
      >
        {links.map((link) => {
          const isActive = isLinkActive(link.href, link.label);
          const labelContent = (
            <>
              {link.label}
              {link.hasMegaMenu && (
                <ChevronDown
                  className={`aura-nav-chev ${megaMenuOpen ? 'aura-nav-chev--open' : ''}`}
                />
              )}
            </>
          );
          return (
            <li
              key={link.label}
              ref={(el) => {
                registerRef(link.label, el);
                if (el) onLinkHover(link.label, el);
              }}
              className={`aura-nav-link ${isActive ? 'aura-nav-link--active' : ''} ${
                scrolled ? 'aura-nav-link--scrolled' : ''
              }`}
              onMouseEnter={(e) => onLinkHover(link.label, e.currentTarget)}
            >
              {link.hasMegaMenu ? (
                <button
                  type="button"
                  onClick={onMegaToggle}
                  aria-haspopup="menu"
                  aria-expanded={megaMenuOpen}
                  className="aura-nav-link-btn"
                >
                  {labelContent}
                </button>
              ) : (
                <Link
                  href={link.href}
                  onClick={onLinkClick}
                  className="aura-nav-link-btn"
                >
                  {labelContent}
                </Link>
              )}
            </li>
          );
        })}
        <li className="aura-nav-cursor" aria-hidden="true" />
      </ul>
    </div>
  );
}
