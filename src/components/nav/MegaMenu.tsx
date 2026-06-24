'use client';

/**
 * MegaMenu — desktop dropdown panel that opens under the navbar pill.
 *
 * Two columns: left = list of mega menu items (All Products, New Arrivals,
 * Sale, Lookbook, Care Guide), right = image preview panel that updates
 * based on which item is being hovered.
 *
 * All styling via CSS classes (.aura-nav-mega, .aura-nav-mega-panel,
 * .aura-nav-mega-col, .aura-nav-mega-item, .aura-nav-mega-preview, etc.).
 * Zero inline styles.
 */

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';

export interface MegaMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  preview: {
    image: string;
    eyebrow: string;
    headline: string;
    cta: string;
  };
}

interface MegaMenuProps {
  items: MegaMenuItem[];
  activePreview: MegaMenuItem;
  isMegaItemActive: (href: string) => boolean;
  onItemHover: (item: MegaMenuItem) => void;
  onLinkClick: () => void;
}

export default function MegaMenu({
  items,
  activePreview,
  isMegaItemActive,
  onItemHover,
  onLinkClick,
}: MegaMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Entrance animation — fade + slide down
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', force3D: true }
      );
    }
  }, []);

  return (
    <div className="aura-nav-mega" ref={ref}>
      <div className="aura-nav-mega-panel">
        {/* Left column — navigation items */}
        <div className="aura-nav-mega-col aura-nav-mega-col--list">
          <p className="aura-nav-mega-eyebrow">Explore</p>
          {items.map((item) => {
            const itemActive = isMegaItemActive(item.href);
            const isPreviewing = activePreview.href === item.href;
            const stateClass = isPreviewing
              ? 'aura-nav-mega-item--previewing'
              : itemActive
              ? 'aura-nav-mega-item--active'
              : '';
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onLinkClick}
                className={`aura-nav-mega-item ${stateClass}`}
                onMouseEnter={() => onItemHover(item)}
              >
                <div className="aura-nav-mega-icon">{item.icon}</div>
                <div className="aura-nav-mega-text">
                  <p className="aura-nav-mega-label">
                    {item.label}
                    {itemActive && <span className="aura-nav-mega-current">Current</span>}
                  </p>
                  <p className="aura-nav-mega-desc">{item.description}</p>
                </div>
                <ChevronRight
                  className={`aura-nav-mega-arrow ${isPreviewing ? 'aura-nav-mega-arrow--show' : ''}`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right column — image preview panel */}
        <div className="aura-nav-mega-col aura-nav-mega-col--preview">
          <div className="aura-nav-mega-preview">
            <div
              className="aura-nav-mega-preview-bg"
              style={{ backgroundImage: `url(${activePreview.preview.image})` }}
            />
            <div className="aura-nav-mega-preview-overlay" />
            {/* Decorative corner accents */}
            <div className="aura-nav-mega-preview-corner aura-nav-mega-preview-corner--tl" />
            <div className="aura-nav-mega-preview-corner aura-nav-mega-preview-corner--br" />
            <div className="aura-nav-mega-preview-content">
              <p className="aura-nav-mega-preview-eyebrow">
                {activePreview.preview.eyebrow}
              </p>
              <h4 className="aura-nav-mega-preview-title">
                {activePreview.preview.headline}
              </h4>
              <Link
                href={activePreview.href}
                onClick={onLinkClick}
                className="aura-nav-mega-preview-cta"
              >
                {activePreview.preview.cta}
                <ChevronRight className="aura-nav-mega-preview-cta-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
