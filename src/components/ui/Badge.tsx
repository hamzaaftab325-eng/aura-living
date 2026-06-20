'use client';

import { badgeColors } from '@/store/useStore';

interface BadgeProps {
  variant?: 'NEW' | 'SALE' | 'BESTSELLER' | 'custom';
  customBg?: string;
  customText?: string;
  children?: React.ReactNode;
  className?: string;
  /** Render as inline-block (default) or as positioned absolute */
  position?: 'inline' | 'absolute';
}

/**
 * Reusable badge. Uses badgeColors map from store for consistency.
 * Falls back to custom colors when variant='custom'.
 */
export default function Badge({
  variant = 'NEW',
  customBg,
  customText,
  children,
  className = '',
  position = 'inline',
}: BadgeProps) {
  const isCustom = variant === 'custom';
  const colors = !isCustom ? badgeColors[variant] : null;
  const bg = colors?.bg || customBg || 'var(--cta-bg)';
  const text = colors?.text || customText || 'var(--primary-foreground)';

  return (
    <span
      className={`inline-flex items-center justify-center text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm ${
        position === 'absolute' ? 'absolute top-3 left-3 z-10' : ''
      } ${className}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {children || variant}
    </span>
  );
}
