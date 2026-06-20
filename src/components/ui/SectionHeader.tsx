'use client';

import { GoldDivider } from '@/components/SVGDecorations';

interface SectionHeaderProps {
  /** Eyebrow text (small gold uppercase label above title) */
  eyebrow?: string;
  /** Main section title */
  title: string;
  /** Optional subtitle/description below title */
  subtitle?: string;
  /** Alignment */
  align?: 'left' | 'center';
  /** Show gold divider below title */
  showDivider?: boolean;
  className?: string;
}

/**
 * Reusable section header — standardizes the eyebrow + title + subtitle + divider
 * pattern used across all sections.
 *
 * Typography:
 * - Eyebrow: .aura-eyebrow (gold uppercase)
 * - Title: .aura-h2 (Playfair Display, fluid clamp)
 * - Subtitle: .aura-body-large (Poppins, muted)
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  showDivider = true,
  className = '',
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'} mb-12 ${className}`}
    >
      {eyebrow && (
        <span className="aura-eyebrow mb-4 block">{eyebrow}</span>
      )}
      <h2 className="aura-h2 aura-text-primary">{title}</h2>
      {showDivider && (
        <div className="flex justify-center mt-4 mb-4">
          <GoldDivider />
        </div>
      )}
      {subtitle && (
        <p className="aura-body-large aura-text-secondary max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
